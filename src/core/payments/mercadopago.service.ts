import { MercadoPagoConfig, Preference } from 'mercadopago';

// Configuración del cliente de Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || '',
  options: {
    timeout: 5000,
  }
});

const preference = new Preference(client);

export interface MercadoPagoItem {
  id?: string;
  title: string;
  quantity: number;
  unit_price: number;
  currency_id?: string;
  picture_url?: string;
  description?: string;
}

export interface MercadoPagoPayer {
  name?: string;
  surname?: string;
  email?: string;
  phone?: {
    area_code?: string;
    number?: string;
  };
  address?: {
    zip_code?: string;
    street_name?: string;
    street_number?: string;
  };
}

export interface CreatePreferenceInput {
  items: MercadoPagoItem[];
  payer?: MercadoPagoPayer;
  back_urls?: {
    success?: string;
    failure?: string;
    pending?: string;
  };
  auto_return?: 'approved' | 'all';
  external_reference?: string;
  notification_url?: string;
  statement_descriptor?: string;
}

export const MercadoPagoService = {
  /**
   * Crea una preferencia de pago en Mercado Pago
   */
  createPreference: async (data: CreatePreferenceInput) => {
    try {
      // Validar que el Access Token esté configurado
      if (!process.env.MERCADO_PAGO_ACCESS_TOKEN || process.env.MERCADO_PAGO_ACCESS_TOKEN.startsWith('TEST-12345')) {
        console.error('MERCADO_PAGO_ACCESS_TOKEN no configurado correctamente');
        return {
          success: false,
          message: 'Credenciales de Mercado Pago no configuradas. Por favor contacta al administrador.',
        };
      }

      const appUrl = process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

      // Validar que la URL sea válida
      if (!appUrl.startsWith('http')) {
        throw new Error('BETTER_AUTH_URL o NEXT_PUBLIC_APP_URL no son URLs válidas');
      }

      const body = {
        items: data.items.map(item => ({
          id: item.id,
          title: item.title,
          quantity: item.quantity,
          unit_price: item.unit_price,
          currency_id: item.currency_id || 'ARS',
          picture_url: item.picture_url,
          description: item.description,
        })),
        payer: data.payer,
        back_urls: {
          success: `${appUrl}/order/success`,
          failure: `${appUrl}/order/failure`,
          pending: `${appUrl}/order/pending`,
        },
        // auto_return se usa cuando se quiere retorno automático
        // Solo incluir si las URLs están completamente configuradas
        external_reference: data.external_reference,
        notification_url: data.notification_url || `${appUrl}/api/mercadopago/webhook`,
        statement_descriptor: data.statement_descriptor || 'ALA TABLA',
      };

      const response = await preference.create({ body });

      return {
        success: true,
        data: {
          id: response.id,
          init_point: response.init_point, // URL de pago para web
          sandbox_init_point: response.sandbox_init_point, // URL de pago para sandbox
        },
      };
    } catch (error) {
      console.error('Error creating Mercado Pago preference:', error);
      
      // Mensaje de error más descriptivo
      let errorMessage = 'Error al crear preferencia de pago';
      if (error instanceof Error) {
        if (error.message.includes('UNAUTHORIZED') || error.message.includes('403')) {
          errorMessage = 'Las credenciales de Mercado Pago son inválidas. Por favor verifica que hayas configurado los tokens correctamente en el archivo .env';
        } else {
          errorMessage = error.message;
        }
      }

      return {
        success: false,
        message: errorMessage,
      };
    }
  },

  /**
   * Obtiene una preferencia por ID
   */
  getPreference: async (id: string) => {
    try {
      const response = await preference.get({ preferenceId: id });
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.error('Error getting Mercado Pago preference:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error al obtener preferencia',
      };
    }
  },
};
