/**
 * Servicio de notificaciones de Telegram
 * Envía notificaciones push cuando ocurren eventos importantes
 */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderNotificationData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  total: number;
  items: OrderItem[];
  paymentMethod?: string;
  hasShipping: boolean;
}

/**
 * Envía una notificación de nueva orden a Telegram
 */
export async function sendNewOrderNotification(data: OrderNotificationData) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('⚠️ Telegram no configurado. Saltando notificación.');
    return { success: false, message: 'Telegram no configurado' };
  }

  try {
    // Formatear lista de productos
    const productsList = data.items.map(item => 
      `  • ${item.name} x${item.quantity} - $${item.price.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`
    ).join('\n');

    const message = `
🛒 <b>¡Nueva Orden Recibida!</b>

<b>📋 ID de Orden:</b> #${data.orderId.slice(0, 8)}
<b>👤 Cliente:</b> ${data.customerName}
<b>📧 Email:</b> ${data.customerEmail}

<b>📦 Productos:</b>
${productsList}

<b>💰 Total:</b> $${data.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
${data.paymentMethod ? `<b>💳 Pago:</b> ${data.paymentMethod}` : ''}
${data.hasShipping ? '🚚 <b>Envío:</b> Sí' : '🏠 <b>Retiro:</b> En local'}

<a href="https://alatabla.store/admin/orders">🔗 Ver en Admin Panel</a>
    `.trim();

    const response = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    const result = await response.json();

    if (!result.ok) {
      console.error('❌ Error al enviar notificación de Telegram:', result);
      return { success: false, message: result.description };
    }

    console.log('✅ Notificación de Telegram enviada exitosamente');
    return { success: true, data: result };
  } catch (error) {
    console.error('❌ Error al enviar notificación de Telegram:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Error desconocido' };
  }
}

/**
 * Envía una notificación de pago confirmado
 */
export async function sendPaymentConfirmedNotification(data: {
  orderId: string;
  amount: number;
  paymentMethod: string;
}) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return { success: false, message: 'Telegram no configurado' };
  }

  try {
    const message = `
✅ <b>Pago Confirmado</b>

<b>📋 Orden:</b> #${data.orderId.slice(0, 8)}
<b>💸 Monto:</b> $${data.amount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
<b>💳 Método:</b> ${data.paymentMethod}

<a href="https://alatabla.store/admin/orders">🔗 Ver detalles</a>
    `.trim();

    const response = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    const result = await response.json();
    return result.ok ? { success: true, data: result } : { success: false, message: result.description };
  } catch (error) {
    console.error('Error enviando notificación de pago:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Error desconocido' };
  }
}

/**
 * Envía una notificación de prueba para verificar la configuración
 */
export async function sendTestNotification() {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return { 
      success: false, 
      message: 'Telegram no configurado. Verifica TELEGRAM_BOT_TOKEN y TELEGRAM_CHAT_ID en .env' 
    };
  }

  try {
    const message = `
🧪 <b>Prueba de Notificaciones</b>

¡El bot de Telegram está funcionando correctamente! ✅

Recibirás notificaciones aquí cuando:
• Se cree una nueva orden 🛒
• Se confirme un pago 💰
• Ocurran eventos importantes 📢

<i>Configurado desde AlaTabla Store</i>
    `.trim();

    const response = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    const result = await response.json();

    if (!result.ok) {
      return { 
        success: false, 
        message: `Error de Telegram: ${result.description}` 
      };
    }

    return { success: true, message: '¡Notificación de prueba enviada!' };
  } catch (error) {
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Error desconocido' 
    };
  }
}
