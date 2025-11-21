import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendVerificationEmailParams {
  email: string;
  name: string;
  verificationUrl: string;
}

export async function sendVerificationEmail({ email, name, verificationUrl }: SendVerificationEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'AlaTabla <onboarding@resend.dev>',
      to: 'juancruzbonadeo04@gmail.com',
      subject: 'Verifica tu email - AlaTabla',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; border-radius: 10px; padding: 30px; text-align: center;">
              <h1 style="color: #2563eb; margin-bottom: 20px;">¡Bienvenido a AlaTabla!</h1>
              <p style="font-size: 16px; margin-bottom: 20px;">Hola ${name},</p>
              <p style="font-size: 14px; color: #666; margin-bottom: 10px;">
                Email de prueba para: ${email}
              </p>
              <p style="font-size: 16px; margin-bottom: 30px;">
                Gracias por registrarte. Para completar tu registro, por favor verifica tu dirección de email haciendo clic en el botón de abajo.
              </p>
              <a href="${verificationUrl}" style="display: inline-block; background-color: #2563eb; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
                Verificar Email
              </a>
              <p style="font-size: 14px; color: #666; margin-top: 30px;">
                Si no creaste esta cuenta, puedes ignorar este email de forma segura.
              </p>
              <p style="font-size: 12px; color: #999; margin-top: 20px;">
                Este enlace expirará en 24 horas.
              </p>
            </div>
            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
              <p>© ${new Date().getFullYear()} AlaTabla. Todos los derechos reservados.</p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending verification email:', error);
      return { success: false, error };
    }

    console.log('Verification email sent:', data);
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

export async function sendPasswordResetEmail({ email, name, resetUrl }: SendPasswordResetEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'AlaTabla <onboarding@resend.dev>',
      to: 'juancruzbonadeo04@gmail.com',
      subject: 'Restablecer contraseña - AlaTabla',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; border-radius: 10px; padding: 30px; text-align: center;">
              <h1 style="color: #2563eb; margin-bottom: 20px;">Restablecer Contraseña</h1>
              <p style="font-size: 16px; margin-bottom: 20px;">Hola ${name},</p>
              <p style="font-size: 14px; color: #666; margin-bottom: 10px;">
                Email de prueba para: ${email}
              </p>
              <p style="font-size: 16px; margin-bottom: 30px;">
                Recibimos una solicitud para restablecer la contraseña de tu cuenta. Haz clic en el botón de abajo para crear una nueva contraseña.
              </p>
              <a href="${resetUrl}" style="display: inline-block; background-color: #2563eb; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
                Restablecer Contraseña
              </a>
              <p style="font-size: 14px; color: #666; margin-top: 30px;">
                Si no solicitaste restablecer tu contraseña, puedes ignorar este email de forma segura.
              </p>
              <p style="font-size: 12px; color: #999; margin-top: 20px;">
                Este enlace expirará en 1 hora.
              </p>
            </div>
            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
              <p>© ${new Date().getFullYear()} AlaTabla. Todos los derechos reservados.</p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending password reset email:', error);
      return { success: false, error };
    }

    console.log('Password reset email sent:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error };
  }
}
