import { Resend } from 'resend';
import { currencyFormat } from '../helpers/currencyFormat';

const resend = new Resend(process.env.RESEND_API_KEY);

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const OFFICIAL_EMAIL = process.env.OFFICIAL_EMAIL || 'admin@alatabla.store';
const OFFICIAL_EMAIL_NAME = process.env.OFFICIAL_EMAIL_NAME || 'AlaTabla';
const FROM_ADDRESS = `${OFFICIAL_EMAIL_NAME} <${OFFICIAL_EMAIL}>`;
const LOGO_URL = process.env.LOGO_URL || 'https://alatabla.store/logo.png';

interface SendVerificationEmailParams {
  email: string;
  name: string;
  verificationUrl: string;
}

/**
 * Sends a verification email to the user using Resend.
 * Updated to match the application's dark theme and orange accents.
 */
export async function sendVerificationEmail({ email, name, verificationUrl }: SendVerificationEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: email,
      subject: 'Verifica tu email - AlaTabla',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verifica tu Email</title>
          </head>
          <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #ffffff; background-color: #0a0a0a; margin: 0; padding: 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; width: 100%; margin: 0; padding: 40px 0;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #171718; border-radius: 16px; border: 1px solid #262626; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
                    <!-- Logo Header -->
                    <tr>
                      <td align="center" style="padding: 30px 40px 20px 40px; background-color: #0a0a0a;">
                        <img src="${LOGO_URL}" alt="AlaTabla" style="width: 80px; height: 80px; border-radius: 50%;" />
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 20px 40px;">
                        <h2 style="color: #ffffff; margin: 0 0 20px 0; font-size: 22px; text-align: center;">¡Bienvenido, ${name}!</h2>
                        <p style="font-size: 16px; color: #a3a3a3; margin-bottom: 25px; text-align: center;">
                          Gracias por unirte a nuestra comunidad de productos artesanales. Para empezar a disfrutar de la mejor calidad, por favor verifica tu dirección de email.
                        </p>
                        
                        <div style="text-align: center; margin: 35px 0;">
                          <a href="${verificationUrl}" style="display: inline-block; background-color: #fb923c; color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px; transition: all 0.3s ease;">
                            Verificar mi cuenta
                          </a>
                        </div>
                        
                        <p style="font-size: 14px; color: #737373; margin-top: 30px; border-top: 1px solid #262626; padding-top: 20px; text-align: center;">
                          Si el botón de arriba no funciona, puedes copiar y pegar el siguiente enlace en tu navegador:
                        </p>
                        <p style="font-size: 12px; color: #fb923c; word-break: break-all; text-align: center;">
                          ${verificationUrl}
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="padding: 20px 40px 40px 40px; text-align: center;">
                        <p style="font-size: 12px; color: #525252; margin: 0;">
                          Si no creaste esta cuenta, puedes ignorar este email de forma segura.
                        </p>
                        <p style="font-size: 12px; color: #525252; margin: 10px 0 0 0;">
                          © ${new Date().getFullYear()} AlaTabla. Todos los derechos reservados.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending verification email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, error };
  }
}

interface SendPasswordResetEmailParams {
  email: string;
  name: string;
  resetUrl: string;
}

/**
 * Sends a password reset email to the user.
 * Updated to match the application's dark theme and orange accents.
 */
export async function sendPasswordResetEmail({ email, name, resetUrl }: SendPasswordResetEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: email,
      subject: 'Restablecer contraseña - AlaTabla',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Restablecer Contraseña</title>
          </head>
          <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #ffffff; background-color: #0a0a0a; margin: 0; padding: 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="width: 100%; margin: 0; padding: 40px 0;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #171718; border-radius: 16px; border: 1px solid #262626; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
                    <!-- Logo Header -->
                    <tr>
                      <td align="center" style="padding: 30px 40px 20px 40px; background-color: #0a0a0a;">
                        <img src="${LOGO_URL}" alt="AlaTabla" style="width: 80px; height: 80px; border-radius: 50%;" />
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 20px 40px;">
                        <h2 style="color: #ffffff; margin: 0 0 20px 0; font-size: 22px; text-align: center;">Hola ${name}</h2>
                        <p style="font-size: 16px; color: #a3a3a3; margin-bottom: 25px; text-align: center;">
                          Recibimos una solicitud para restablecer la contraseña de tu cuenta. No te preocupes, ¡puedes crear una nueva fácilmente!
                        </p>
                        
                        <div style="text-align: center; margin: 35px 0;">
                          <a href="${resetUrl}" style="display: inline-block; background-color: #fb923c; color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px; transition: all 0.3s ease;">
                            Restablecer Contraseña
                          </a>
                        </div>
                        
                        <p style="font-size: 14px; color: #737373; margin-top: 30px; border-top: 1px solid #262626; padding-top: 20px; text-align: center;">
                          Este enlace expirará en 1 hora por razones de seguridad. Si no solicitaste este cambio, puedes ignorar el email.
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="padding: 20px 40px 40px 40px; text-align: center;">
                        <p style="font-size: 12px; color: #525252; margin: 10px 0 0 0;">
                          © ${new Date().getFullYear()} AlaTabla. Todos los derechos reservados.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending password reset email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error };
  }
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface SendOrderConfirmationEmailParams {
  email: string;
  name: string;
  orderId: string;
  total: number;
  items: OrderItem[];
}

/**
 * Sends an order confirmation email to the user.
 * Features a detailed table of items and the official dark/orange theme.
 */
export async function sendOrderConfirmationEmail({ email, orderId, total, items }: SendOrderConfirmationEmailParams) {
  try {
    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #262626; color: #ffffff; font-size: 14px;">
          ${item.name} <span style="color: #737373;">x ${item.quantity}</span>
        </td>
        <td align="right" style="padding: 12px 0; border-bottom: 1px solid #262626; color: #fb923c; font-size: 14px; font-weight: bold;">
          ${currencyFormat(item.price)}
        </td>
      </tr>
    `).join('');

    const { data, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: email,
      subject: `¡Confirmación de Pedido #${orderId.slice(-8)}! - AlaTabla`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirmación de Pedido</title>
          </head>
          <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #ffffff; background-color: #0a0a0a; margin: 0; padding: 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="width: 100%; margin: 0; padding: 40px 0;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #171718; border-radius: 16px; border: 1px solid #262626; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
                    <!-- Logo Header -->
                    <tr>
                      <td align="center" style="padding: 30px 40px 20px 40px; background-color: #0a0a0a;">
                        <img src="${LOGO_URL}" alt="AlaTabla" style="width: 80px; height: 80px; border-radius: 50%;" />
                      </td>
                    </tr>
                    <!-- Title -->
                    <tr>
                      <td align="center" style="padding: 20px 40px 20px 40px; background-color: #fb923c;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold; text-transform: uppercase;">¡Gracias por tu compra!</h1>
                        <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Hemos recibido tu pedido correctamente.</p>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px;">
                        <div style="margin-bottom: 30px;">
                          <p style="color: #fb923c; font-weight: bold; margin: 0; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Detalles del Pedido</p>
                          <h2 style="color: #ffffff; margin: 5px 0 0 0; font-size: 20px;">Orden #${orderId.slice(-8)}</h2>
                        </div>
                        
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                          ${itemsHtml}
                          <tr>
                            <td style="padding: 20px 0 0 0; color: #ffffff; font-size: 18px; font-weight: bold;">Total</td>
                            <td align="right" style="padding: 20px 0 0 0; color: #fb923c; font-size: 24px; font-weight: bold;">
                              ${currencyFormat(total)}
                            </td>
                          </tr>
                        </table>
                        
                        <div style="background-color: #0a0a0a; border-radius: 12px; padding: 25px; text-align: center; border: 1px solid #262626;">
                          <p style="color: #ffffff; margin: 0 0 10px 0; font-weight: bold;">¿Qué sigue ahora?</p>
                          <p style="color: #a3a3a3; margin: 0; font-size: 14px;">
                            Estamos preparando tu pedido. Te enviaremos otro email cuando tu paquete esté en camino.
                          </p>
                          <div style="margin-top: 20px;">
                            <a href="${APP_URL}/profile/orders" style="display: inline-block; color: #fb923c; text-decoration: none; font-weight: bold; font-size: 14px; border-bottom: 2px solid #fb923c; padding-bottom: 2px;">
                              Ver mis pedidos
                            </a>
                          </div>
                        </div>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="padding: 20px 40px 40px 40px; text-align: center; border-top: 1px solid #262626;">
                        <p style="font-size: 12px; color: #525252; margin: 0;">
                          Si tienes alguna duda, responde a este email o contáctanos por WhatsApp.
                        </p>
                        <p style="font-size: 12px; color: #525252; margin: 10px 0 0 0;">
                          © ${new Date().getFullYear()} AlaTabla. Todos los derechos reservados.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending order confirmation email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return { success: false, error };
  }
}

interface SendPaymentConfirmationEmailParams {
  email: string;
  name: string;
  orderId: string;
  total: number;
  items: OrderItem[];
}

/**
 * Sends a payment confirmation email to the user after successful payment.
 * Features a thank you message and notifies that contact will be made soon.
 */
export async function sendPaymentConfirmationEmail({ email, name, orderId, total, items }: SendPaymentConfirmationEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: email,
      subject: `¡Pago Confirmado - Orden #${orderId.slice(-8)}! - AlaTabla`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Pago Confirmado</title>
          </head>
          <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #ffffff; background-color: #0a0a0a; margin: 0; padding: 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="width: 100%; margin: 0; padding: 40px 0;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #171718; border-radius: 16px; border: 1px solid #262626; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
                    <!-- Logo Header -->
                    <tr>
                      <td align="center" style="padding: 30px 40px 20px 40px; background-color: #0a0a0a;">
                        <img src="${LOGO_URL}" alt="AlaTabla" style="width: 80px; height: 80px; border-radius: 50%;" />
                      </td>
                    </tr>
                    <!-- Title with Check -->
                    <tr>
                      <td align="center" style="padding: 30px 40px; background: linear-gradient(135deg, #fb923c 0%, #ea580c 100%);">
                        <div style="color: #ffffff; font-size: 48px; margin-bottom: 15px;">✓</div>
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">¡Gracias por tu compra!</h1>
                        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Tu pago ha sido confirmado exitosamente</p>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px;">
                        <div style="text-align: center; margin-bottom: 30px;">
                          <p style="color: #a3a3a3; font-size: 16px; line-height: 1.8; margin: 0;">
                            Hola <strong style="color: #ffffff;">${name}</strong>,
                          </p>
                          <p style="color: #a3a3a3; font-size: 16px; line-height: 1.8; margin: 20px 0;">
                            Hemos recibido tu pago correctamente. En breve nos pondremos en contacto contigo para coordinar la entrega de tu pedido.
                          </p>
                        </div>
                        
                        ${items.length > 0 ? `
                        <div style="margin-bottom: 25px;">
                          <p style="color: #fb923c; font-weight: bold; margin: 0 0 15px 0; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Productos de tu Orden</p>
                          <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #262626; border-radius: 8px; overflow: hidden;">
                            ${items.map(item => `
                              <tr>
                                <td style="padding: 12px; border-bottom: 1px solid #262626; color: #ffffff; font-size: 14px; background-color: #0a0a0a;">
                                  ${item.name} <span style="color: #737373;">x ${item.quantity}</span>
                                </td>
                                <td align="right" style="padding: 12px; border-bottom: 1px solid #262626; color: #fb923c; font-size: 14px; font-weight: bold; background-color: #0a0a0a;">
                                  ${currencyFormat(item.price)}
                                </td>
                              </tr>
                            `).join('')}
                          </table>
                        </div>
                        ` : ''}
                        
                        <div style="background-color: #0a0a0a; border-radius: 12px; padding: 25px; border: 1px solid #262626; margin-bottom: 30px;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="padding: 10px 0;">
                                <p style="color: #737373; margin: 0; font-size: 14px;">Número de Orden</p>
                                <p style="color: #ffffff; margin: 5px 0 0 0; font-size: 18px; font-weight: bold;">#${orderId.slice(-8)}</p>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 10px 0; border-top: 1px solid #262626;">
                                <p style="color: #737373; margin: 0; font-size: 14px;">Total Pagado</p>
                                <p style="color: #fb923c; margin: 5px 0 0 0; font-size: 24px; font-weight: bold;">${currencyFormat(total)}</p>
                              </td>
                            </tr>
                          </table>
                        </div>
                        
                        <div style="background-color: rgba(251, 146, 60, 0.1); border-left: 4px solid #fb923c; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                          <p style="color: #ffffff; margin: 0 0 10px 0; font-weight: bold; font-size: 16px;">📦 Próximos Pasos</p>
                          <p style="color: #a3a3a3; margin: 0; font-size: 14px; line-height: 1.6;">
                            Nuestro equipo está preparando tu pedido. Te contactaremos pronto por email o WhatsApp para coordinar los detalles del envío o retiro.
                          </p>
                        </div>
                        
                        <div style="text-align: center;">
                          <a href="${APP_URL}/profile/orders" style="display: inline-block; background-color: #fb923c; color: #ffffff; padding: 14px 35px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px; transition: all 0.3s ease;">
                            Ver Estado de mi Orden
                          </a>
                        </div>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="padding: 20px 40px 40px 40px; text-align: center; border-top: 1px solid #262626;">
                        <p style="font-size: 12px; color: #525252; margin: 0;">
                          Si tienes alguna consulta, no dudes en respondernos a este email.
                        </p>
                        <p style="font-size: 12px; color: #525252; margin: 10px 0 0 0;">
                          © ${new Date().getFullYear()} AlaTabla. Todos los derechos reservados.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending payment confirmation email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending payment confirmation email:', error);
    return { success: false, error };
  }
}

interface SendMarketingEmailParams {
  email: string;
  name: string;
  subject: string;
  message: string;
}

/**
 * Sends a marketing email to a single user.
 * Matches the official dark/orange theme.
 */
export async function sendMarketingEmail({ email, name, subject, message }: SendMarketingEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: email,
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${subject}</title>
          </head>
          <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #ffffff; background-color: #0a0a0a; margin: 0; padding: 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="width: 100%; margin: 0; padding: 40px 0;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #171718; border-radius: 16px; border: 1px solid #262626; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
                    <!-- Logo Header -->
                    <tr>
                      <td align="center" style="padding: 30px 40px 20px 40px; background-color: #0a0a0a;">
                        <img src="${LOGO_URL}" alt="AlaTabla" style="width: 80px; height: 80px; border-radius: 50%;" />
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 20px 40px;">
                        <h2 style="color: #ffffff; margin: 0 0 20px 0; font-size: 22px;">Hola ${name},</h2>
                        <div style="font-size: 16px; color: #a3a3a3; margin-bottom: 25px; white-space: pre-wrap;">
                          ${message}
                        </div>
                        
                        <div style="text-align: center; margin: 35px 0;">
                          <a href="${APP_URL}" style="display: inline-block; background-color: #fb923c; color: #ffffff; padding: 14px 35px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px;">
                            Visitar la Tienda
                          </a>
                        </div>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="padding: 20px 40px 40px 40px; text-align: center; border-top: 1px solid #262626;">
                        <p style="font-size: 12px; color: #525252; margin: 0;">
                          Recibiste este email porque eres cliente de AlaTabla.
                        </p>
                        <p style="font-size: 12px; color: #525252; margin: 10px 0 0 0;">
                          © ${new Date().getFullYear()} AlaTabla. Todos los derechos reservados.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending marketing email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending marketing email:', error);
    return { success: false, error };
  }
}
