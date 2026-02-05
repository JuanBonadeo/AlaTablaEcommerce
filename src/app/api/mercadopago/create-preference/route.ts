import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoService } from '@/core/payments/mercadopago.service';
import { OrderDAO } from '@/core/orders/order.dao';
import { auth } from '@/lib/auth/auth';

export async function POST(req: NextRequest) {
  try {
    // Verificar autenticación
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: 'El ID de orden es requerido' },
        { status: 400 }
      );
    }

    // Obtener la orden
    const order = await OrderDAO.getById(orderId);

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Orden no encontrada' },
        { status: 404 }
      );
    }

    // Verificar que la orden pertenece al usuario
    if (order.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, message: 'No tienes permiso para acceder a esta orden' },
        { status: 403 }
      );
    }

    // Crear items para Mercado Pago
    const items = order.items?.map((item) => ({
      id: item.productId,
      title: item.product?.name || 'Producto',
      quantity: item.quantity,
      unit_price: item.price,
      currency_id: 'ARS',
      picture_url: item.product?.images?.[0]?.url,
      description: item.variant ? `${item.product?.name} - ${item.variant.name}` : item.product?.name,
    })) || [];

    // Agregar costo de envío si existe
    if (order.shipment?.cost && order.shipment.cost > 0) {
      items.push({
        id: 'shipping',
        title: 'Envío',
        quantity: 1,
        unit_price: order.shipment.cost,
        currency_id: 'ARS',
        picture_url: '',
        description: `Envío - ${order.shipment.serviceName || 'Correo Argentino'}`,
      });
    }

    // Datos del comprador
    const payer = {
      name: order.user?.name?.split(' ')[0],
      surname: order.user?.name?.split(' ').slice(1).join(' '),
      email: order.user?.email,
      phone: order.address?.phone ? {
        number: order.address.phone,
      } : undefined,
      address: order.address ? {
        zip_code: order.address.zip,
        street_name: order.address.street,
      } : undefined,
    };

    // Crear preferencia de pago
    console.log('=== API: Creating Mercado Pago Preference ===');
    console.log('Order ID:', orderId);
    console.log('Items count:', items.length);
    console.log('Total amount:', items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0));

    const preferenceResult = await MercadoPagoService.createPreference({
      items,
      payer,
      external_reference: orderId,
      statement_descriptor: 'ALA TABLA',
    });

    console.log('=== API: Preference Result ===');
    console.log('Success:', preferenceResult.success);
    console.log('Message:', preferenceResult.message);
    console.log('Data:', preferenceResult.data);

    if (!preferenceResult.success) {
      return NextResponse.json(
        { success: false, message: preferenceResult.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: preferenceResult.data,
    });

  } catch (error) {
    console.error('Error creating payment preference:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Error al crear preferencia de pago'
      },
      { status: 500 }
    );
  }
}
