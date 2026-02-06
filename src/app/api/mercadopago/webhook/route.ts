import { NextRequest, NextResponse } from 'next/server';
import { PaymentDAO } from '@/core/payments/payment.dao';
import { OrderDAO } from '@/core/orders/order.dao';
import { OrderStatus, PaymentProvider, PaymentStatus } from '@/lib/types/enums';
import { sendPaymentConfirmationEmail } from '@/lib/email/resend';

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

    // Aquí deberías consultar la información del pago usando el SDK de Mercado Pago
    // Por ahora, solo registramos la notificación
    // TODO: Implementar la consulta del estado del pago usando MercadoPago SDK

    // Ejemplo de cómo procesar el pago (esto lo implementarás cuando consultes el pago):
    /*
    const paymentInfo = await MercadoPagoSDK.getPayment(paymentId);
    
    const orderId = paymentInfo.external_reference;
    
    if (!orderId) {
      console.error('Order ID not found in payment');
      return NextResponse.json({ success: false, message: 'Order ID not found' }, { status: 400 });
    }

    // Obtener o crear el pago en la base de datos
    let payment = await PaymentDAO.getByOrderId(orderId);
    
    if (!payment) {
      // Crear nuevo registro de pago
      payment = await PaymentDAO.create({
        orderId,
        provider: PaymentProvider.MERCADO_PAGO,
        status: mapMercadoPagoStatus(paymentInfo.status),
        amount: paymentInfo.transaction_amount,
        transactionId: String(paymentId),
        notes: `Método: ${paymentInfo.payment_method_id}`,
      });
    } else {
      // Actualizar pago existente
      payment = await PaymentDAO.update(payment.id, {
        status: mapMercadoPagoStatus(paymentInfo.status),
        transactionId: String(paymentId),
      });
    }

    // Si el pago fue aprobado, actualizar el estado de la orden
    if (payment.status === PaymentStatus.COMPLETED) {
      await OrderDAO.update(orderId, {
        status: OrderStatus.PAID,
      });
      
      // Send payment confirmation email
      try {
        const order = await OrderDAO.getById(orderId);
        if (order?.user?.email && order?.user?.name) {
          await sendPaymentConfirmationEmail({
            email: order.user.email,
            name: order.user.name,
            orderId: order.id,
            total: order.total,
            items: order.items?.map(item => ({
              id: item.id,
              name: item.variant 
                ? `${item.product.name} - ${item.variant.name}`
                : item.product.name,
              quantity: item.quantity,
              price: item.price,
            })) || [],
          });
        }
      } catch (emailError) {
        console.error('Error sending payment confirmation email:', emailError);
        // Don't fail the webhook if email fails
      }
    } else if (payment.status === PaymentStatus.FAILED) {
      await OrderDAO.update(orderId, {
        status: OrderStatus.CANCELLED,
      });
    }
    */

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
