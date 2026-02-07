import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { PaymentDAO } from '@/core/payments/payment.dao';
import { OrderDAO } from '@/core/orders/order.dao';
import { OrderStatus, PaymentProvider, PaymentStatus } from '@/lib/types/enums';
import { sendPaymentConfirmationEmail } from '@/lib/email/resend';

// Configuración del cliente de Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || '',
  options: {
    timeout: 5000,
  }
});

const payment = new Payment(client);

/**
 * Webhook de Mercado Pago para recibir notificaciones de pagos
 * Documentación: https://www.mercadopago.com.ar/developers/es/docs/your-integrations/notifications/webhooks
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log('Webhook received from Mercado Pago:', body);

    // Mercado Pago envía diferentes tipos de notificaciones
    const { type, data } = body;

    // Solo procesamos notificaciones de pagos
    if (type !== 'payment') {
      return NextResponse.json({ success: true, message: 'Notification type not handled' });
    }

    // El ID del pago viene en data.id
    const paymentId = data?.id;

    if (!paymentId) {
      return NextResponse.json(
        { success: false, message: 'Payment ID not found' },
        { status: 400 }
      );
    }

    // Consultar la información del pago usando el SDK de Mercado Pago
    const paymentInfo = await payment.get({ id: paymentId });
    
    console.log('Payment info from Mercado Pago:', {
      id: paymentInfo.id,
      status: paymentInfo.status,
      status_detail: paymentInfo.status_detail,
      external_reference: paymentInfo.external_reference,
      transaction_amount: paymentInfo.transaction_amount,
      payment_method_id: paymentInfo.payment_method_id,
    });

    const orderId = paymentInfo.external_reference;
    
    if (!orderId) {
      console.error('Order ID not found in payment');
      return NextResponse.json({ success: false, message: 'Order ID not found' }, { status: 400 });
    }

    // Verificar que la orden existe
    const order = await OrderDAO.getById(orderId);
    if (!order) {
      console.error(`Order ${orderId} not found`);
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    // Obtener o crear el pago en la base de datos
    const existingPayment = await PaymentDAO.getByOrderId(orderId);
    
    const paymentStatus = mapMercadoPagoStatus(paymentInfo.status || '');
    const transactionAmount = paymentInfo.transaction_amount || 0;
    const paymentMethodId = paymentInfo.payment_method_id || 'unknown';

    if (!existingPayment) {
      // Crear nuevo registro de pago
      await PaymentDAO.create({
        orderId,
        provider: PaymentProvider.MERCADOPAGO,
        amount: transactionAmount,
        transactionId: String(paymentId),
        notes: `Método: ${paymentMethodId}${paymentInfo.status_detail ? ` - ${paymentInfo.status_detail}` : ''}`,
      });
      console.log('Payment created in database for order:', orderId);
    } else {
      // Actualizar pago existente
      await PaymentDAO.update(existingPayment.id, {
        status: paymentStatus,
        transactionId: String(paymentId),
        notes: `Método: ${paymentMethodId}${paymentInfo.status_detail ? ` - ${paymentInfo.status_detail}` : ''}`,
      });
      console.log('Payment updated in database:', existingPayment.id);
    }

    // Si el pago fue aprobado, actualizar el estado de la orden
    if (paymentStatus === PaymentStatus.COMPLETED) {
      await OrderDAO.update(orderId, {
        status: OrderStatus.PAID,
      });
      console.log(`Order ${orderId} marked as PAID`);
      
      // Enviar email de confirmación de pago
      try {
        const updatedOrder = await OrderDAO.getById(orderId);
        if (updatedOrder?.user?.email && updatedOrder?.user?.name) {
          await sendPaymentConfirmationEmail({
            email: updatedOrder.user.email,
            name: updatedOrder.user.name,
            orderId: updatedOrder.id,
            total: updatedOrder.total,
            items: updatedOrder.items?.map(item => ({
              id: item.id,
              name: item.variant 
                ? `${item.product?.name} - ${item.variant.name}`
                : item.product?.name || 'Producto',
              quantity: item.quantity,
              price: item.price,
            })) || [],
          });
          console.log(`Payment confirmation email sent to ${updatedOrder.user.email}`);
        }
      } catch (emailError) {
        console.error('Error sending payment confirmation email:', emailError);
        // Don't fail the webhook if email fails
      }
    } else if (paymentStatus === PaymentStatus.FAILED) {
      await OrderDAO.update(orderId, {
        status: OrderStatus.CANCELED,
      });
      console.log(`Order ${orderId} marked as CANCELED due to payment failure`);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error processing Mercado Pago webhook:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Error processing webhook'
      },
      { status: 500 }
    );
  }
}

/**
 * Mapea el estado de Mercado Pago al estado de PaymentStatus de Prisma
 */
function mapMercadoPagoStatus(mpStatus: string): PaymentStatus {
  switch (mpStatus) {
    case 'approved':
      return PaymentStatus.COMPLETED;
    case 'pending':
    case 'in_process':
    case 'in_mediation':
      return PaymentStatus.PENDING;
    case 'rejected':
    case 'cancelled':
      return PaymentStatus.FAILED;
    case 'refunded':
    case 'charged_back':
      return PaymentStatus.REFUNDED;
    default:
      return PaymentStatus.PENDING;
  }
}

// Permitir peticiones GET para verificar el endpoint
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Mercado Pago webhook endpoint is active'
  });
}
