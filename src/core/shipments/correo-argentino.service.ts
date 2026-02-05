import {
  CorreoArgentinoQuoteResponse,
  ShippingQuoteRequest,
  ShippingQuoteResponse,
  ShippingCarrier,
  ShippingService,
} from "@/lib/types/shipping.types";
import { logger } from "../shared/logger";

// Configuración de MiCorreo (token con Basic Auth → Bearer)
// Por defecto apunta al entorno test documentado
const CORREO_ARGENTINO_API_URL = process.env.CORREO_ARGENTINO_API_URL || "https://apitest.correoargentino.com.ar/micorreo/v1";
const CORREO_ARGENTINO_MICO_USER = process.env.CORREO_ARGENTINO_MICO_USER || process.env.CORREO_ARGENTINO_USERNAME || "";
const CORREO_ARGENTINO_MICO_PASSWORD = process.env.CORREO_ARGENTINO_MICO_PASSWORD || process.env.CORREO_ARGENTINO_PASSWORD || "";

// Código postal de origen (tu tienda/depósito)
const ORIGIN_ZIP_CODE = process.env.ORIGIN_ZIP_CODE || "1000"; // CABA por defecto

const TOKEN_SAFETY_WINDOW_MS = 60_000; // Renueva 1 minuto antes de expirar
const DEFAULT_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hora por defecto

let cachedToken: string | null = null;
let tokenExpiresAt: number | null = null;

const hasCredentials = () => Boolean(CORREO_ARGENTINO_MICO_USER && CORREO_ARGENTINO_MICO_PASSWORD);

const getCachedToken = () => {
  if (!cachedToken || !tokenExpiresAt) return null;
  const stillValid = Date.now() < tokenExpiresAt - TOKEN_SAFETY_WINDOW_MS;
  return stillValid ? cachedToken : null;
};

const parseExpiresToMs = (expires?: string | number | null) => {
  if (typeof expires === "number" && Number.isFinite(expires) && expires > 0) {
    return expires * 1000;
  }
  if (typeof expires === "string" && expires.trim().length > 0) {
    const parsed = Date.parse(expires.replace(" ", "T") + "Z"); // formato "YYYY-MM-DD HH:mm:ss"
    if (!Number.isNaN(parsed)) {
      const delta = parsed - Date.now();
      if (delta > 0) return delta;
    }
  }
  return DEFAULT_TOKEN_TTL_MS;
};

const cacheToken = (token: string, expiresInSeconds?: number, expiresAtText?: string) => {
  const ttlMs = parseExpiresToMs(expiresInSeconds ?? expiresAtText ?? null);
  cachedToken = token;
  tokenExpiresAt = Date.now() + ttlMs;
};

const fetchAuthToken = async (): Promise<string | null> => {
  if (!hasCredentials()) {
    logger.warn("Correo Argentino: faltan credenciales MiCorreo (user/pass)", {
      hasUser: !!CORREO_ARGENTINO_MICO_USER,
      hasPass: !!CORREO_ARGENTINO_MICO_PASSWORD,
      baseUrl: CORREO_ARGENTINO_API_URL,
    });
    return null;
  }

  const existing = getCachedToken();
  if (existing) return existing;

  try {
    const basic = Buffer.from(`${CORREO_ARGENTINO_MICO_USER}:${CORREO_ARGENTINO_MICO_PASSWORD}`).toString("base64");

    const tokenUrl = `${CORREO_ARGENTINO_API_URL}/token`;
    logger.info("Correo Argentino: solicitando token", {
      url: tokenUrl,
      user: CORREO_ARGENTINO_MICO_USER?.substring(0, 3) + "***",
    });

    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
      },
    });

    if (!response.ok) {
      let errorBody: unknown = null;
      try {
        errorBody = await response.text();
      } catch {
        errorBody = "<no-body>";
      }
      logger.error("Correo Argentino: no se pudo obtener token", {
        url: tokenUrl,
        status: response.status,
        statusText: response.statusText,
        body: errorBody,
      });
      return null;
    }

    const data = await response.json();
    const token = data?.token || data?.access_token || data?.accessToken;
    const expiresIn = Number(data?.expires_in ?? data?.expiresIn ?? data?.expiration ?? 0);
    const expiresText = data?.expires ?? data?.expiry ?? null;

    if (!token) {
      logger.error("Correo Argentino: respuesta de token inválida", { data });
      return null;
    }

    cacheToken(token, expiresIn, expiresText);
    logger.info("Correo Argentino: token obtenido exitosamente");
    return token;
  } catch (error) {
    logger.error("Correo Argentino: excepción durante solicitud de token", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      url: `${CORREO_ARGENTINO_API_URL}/token`,
    });
    return null;
  }
};

const withAuthHeaders = async (extra?: Record<string, string>): Promise<Record<string, string> | null> => {
  const token = await fetchAuthToken();
  if (!token) return null;

  return {
    Authorization: `Bearer ${token}`,
    ...(extra ?? {}),
  };
};

/**
 * Servicio para integración con API de Correo Argentino
 * Documentación oficial: https://www.correoargentino.com.ar/api
 */
export const CorreoArgentinoService = {
  /**
   * Genera un número de tracking simulado cuando no viene desde la API
   */
  generateTrackingNumber: (): string => {
    const prefix = "CA";
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomPart = Math.floor(Math.random() * 1_000_000).toString().padStart(6, "0");
    return `${prefix}${datePart}${randomPart}`;
  },

  /**
   * Crea un envío real en Correo Argentino (devuelve tracking). Si faltan credenciales o la API falla,
   * retorna un tracking simulado como fallback.
   */
  createShipment: async (payload: {
    orderId: string;
    recipient: {
      name: string;
      address: string;
      city: string;
      state?: string | null;
      zip: string;
      phone?: string | null;
    };
    service?: ShippingService | null;
    declaredValue?: number;
    weightGrams?: number;
  }): Promise<string> => {
    if (!hasCredentials()) {
      logger.warn("Correo Argentino: usando tracking simulado (faltan credenciales)");
      return CorreoArgentinoService.generateTrackingNumber();
    }

    try {
      const body = {
        pedidoId: payload.orderId,
        destinatario: {
          nombre: payload.recipient.name,
          direccion: payload.recipient.address,
          ciudad: payload.recipient.city,
          provincia: payload.recipient.state,
          codigoPostal: payload.recipient.zip,
          telefono: payload.recipient.phone,
        },
        servicio: payload.service ?? ShippingService.CLASICO,
        valorDeclarado: payload.declaredValue ?? 0,
        peso: payload.weightGrams ?? 1000,
        origenCodigoPostal: ORIGIN_ZIP_CODE,
      };

      const headers = await withAuthHeaders({ "Content-Type": "application/json" });
      if (!headers) {
        logger.warn("Correo Argentino: no hay token, usando tracking simulado");
        return CorreoArgentinoService.generateTrackingNumber();
      }

      const response = await fetch(`${CORREO_ARGENTINO_API_URL}/shipping`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        logger.error("Correo Argentino: error al crear envío", { status: response.status, statusText: response.statusText });
        return CorreoArgentinoService.generateTrackingNumber();
      }

      const data = await response.json();
      const tracking = data?.tracking || data?.codigoSeguimiento || data?.codigo_seguimiento;
      if (!tracking) {
        logger.warn("Correo Argentino: respuesta sin tracking, usando simulado", { data });
        return CorreoArgentinoService.generateTrackingNumber();
      }

      return tracking as string;
    } catch (error) {
      logger.error("Correo Argentino: excepción creando envío, fallback a tracking simulado", { error });
      return CorreoArgentinoService.generateTrackingNumber();
    }
  },
  /**
   * Obtiene cotizaciones de envío de Correo Argentino
   */
  getQuote: async (request: ShippingQuoteRequest): Promise<ShippingQuoteResponse[]> => {
    try {
      // Transformar la solicitud al formato de Correo Argentino
      const caRequest = {
        cpSender: request.originZipCode || ORIGIN_ZIP_CODE,
        cpReceiver: request.destinationZipCode,
        weight: request.weight,
        length: request.length,
        width: request.width,
        height: request.height,
        declaredValue: request.declaredValue,
      };

      logger.info("Solicitando cotización a Correo Argentino", { request: caRequest });

      // Hacer la petición a la API de Correo Argentino
      const headers = await withAuthHeaders({ "Content-Type": "application/json" });
      if (!headers) {
        logger.warn("Correo Argentino: sin token, devolviendo tarifas estimadas");
        return CorreoArgentinoService.getEstimatedRates(request);
      }

      const response = await fetch(`${CORREO_ARGENTINO_API_URL}/rates`, {
        method: "POST",
        headers,
        body: JSON.stringify(caRequest),
      });

      if (!response.ok) {
        logger.error("Error en respuesta de Correo Argentino", {
          status: response.status,
          statusText: response.statusText,
        });

        // Si la API no está disponible, devolver tarifas estimadas
        return CorreoArgentinoService.getEstimatedRates(request);
      }

      const data: CorreoArgentinoQuoteResponse = await response.json();

      if (data.status !== "success" || !data.tarifas || data.tarifas.length === 0) {
        logger.warn("No se obtuvieron tarifas de Correo Argentino", { data });
        return CorreoArgentinoService.getEstimatedRates(request);
      }

      // Transformar la respuesta al formato interno
      const quotes: ShippingQuoteResponse[] = data.tarifas.map(tarifa => {
        let service = ShippingService.CLASICO;

        if (tarifa.tipo_servicio.toLowerCase().includes("expreso")) {
          service = ShippingService.EXPRESO;
        } else if (tarifa.tipo_servicio.toLowerCase().includes("prioritario")) {
          service = ShippingService.PRIORITARIO;
        }

        const baseCost = tarifa.precio;
        const additionalCosts = (tarifa.adicionales?.seguro || 0) + (tarifa.adicionales?.embalaje || 0);
        const totalCost = baseCost + additionalCosts;

        return {
          carrier: ShippingCarrier.CORREO_ARGENTINO,
          service,
          serviceName: tarifa.nombre_servicio,
          cost: totalCost,
          estimatedDays: tarifa.dias_entrega,
          additionalInfo: tarifa.adicionales ? `Incluye seguro y embalaje` : undefined,
        };
      });

      logger.info("Cotización obtenida exitosamente", { quotes });
      return quotes;

    } catch (error) {
      logger.error("Error al obtener cotización de Correo Argentino", { error });

      // En caso de error, devolver tarifas estimadas
      return CorreoArgentinoService.getEstimatedRates(request);
    }
  },

  /**
   * Calcula tarifas estimadas cuando la API no está disponible
   * Basado en peso y distancia aproximada
   */
  getEstimatedRates: (request: ShippingQuoteRequest): ShippingQuoteResponse[] => {
    const { weight, declaredValue = 0 } = request;

    // Cálculo básico por peso (valores aproximados en ARS)
    const baseRatePerKg = 1500; // $1500 por kg
    const weightInKg = weight / 1000;
    const baseRate = Math.max(baseRatePerKg * weightInKg, 2000); // Mínimo $2000

    // Seguro opcional (1% del valor declarado)
    const insuranceCost = declaredValue > 0 ? declaredValue * 0.01 : 0;

    const quotes: ShippingQuoteResponse[] = [
      {
        carrier: ShippingCarrier.CORREO_ARGENTINO,
        service: ShippingService.CLASICO,
        serviceName: "Correo Argentino Clásico",
        cost: Math.round(baseRate + insuranceCost),
        estimatedDays: 7,
        additionalInfo: "Tarifa estimada",
      },
      {
        carrier: ShippingCarrier.CORREO_ARGENTINO,
        service: ShippingService.EXPRESO,
        serviceName: "Correo Argentino Expreso",
        cost: Math.round(baseRate * 1.5 + insuranceCost),
        estimatedDays: 3,
        additionalInfo: "Tarifa estimada",
      },
      {
        carrier: ShippingCarrier.CORREO_ARGENTINO,
        service: ShippingService.PRIORITARIO,
        serviceName: "Correo Argentino Prioritario",
        cost: Math.round(baseRate * 2 + insuranceCost),
        estimatedDays: 1,
        additionalInfo: "Tarifa estimada - Entrega al día siguiente",
      },
    ];

    return quotes;
  },

  /**
   * Verifica la disponibilidad de la API
   */
  checkApiAvailability: async (): Promise<boolean> => {
    try {
      const headers = await withAuthHeaders();
      if (!headers) return false;

      const response = await fetch(`${CORREO_ARGENTINO_API_URL}/api/v1/health`, {
        method: "GET",
        headers,
      });

      return response.ok;
    } catch (error) {
      logger.error("API de Correo Argentino no disponible", { error });
      return false;
    }
  },

  /**
   * Obtiene el estado del envío desde Correo Argentino usando el número de seguimiento
   */
  getShipmentStatus: async (tracking: string): Promise<{
    status: string;
    location?: string;
    lastUpdate?: string;
    estimatedDelivery?: string;
  }> => {
    if (!hasCredentials()) {
      // Retornar estado simulado cuando no hay credenciales
      return {
        status: "EN_TRANSITO",
        location: "Centro de Distribución Nacional",
        lastUpdate: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      };
    }

    try {
      const headers = await withAuthHeaders();
      if (!headers) {
        return {
          status: "PENDIENTE",
          location: "Desconocida",
        };
      }

      const response = await fetch(`${CORREO_ARGENTINO_API_URL}/shipping/tracking/${tracking}`, {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        logger.warn("No se pudo obtener estado de Correo Argentino", {
          tracking,
          status: response.status,
        });
        // Retornar estado por defecto si no se encuentra
        return {
          status: "PENDIENTE",
          location: "Desconocida",
        };
      }

      const data = await response.json();
      return {
        status: data.estado?.toUpperCase() || "DESCONOCIDO",
        location: data.ubicacion,
        lastUpdate: data.ultima_actualizacion,
        estimatedDelivery: data.fecha_entrega_estimada,
      };
    } catch (error) {
      logger.error("Error obteniendo estado de envío", { tracking, error });
      return {
        status: "ERROR",
        location: "No disponible",
      };
    }
  },

  /**
   * Genera etiqueta PDF para el envío
   * Si la API real no está configurada, devuelve un PDF mínimo generado en memoria
   */
  generateLabelPdf: async (payload: {
    orderId: string;
    shipmentId?: string | null;
    recipient: {
      name: string;
      address: string;
      city: string;
      state?: string | null;
      zip?: string | null;
      phone?: string | null;
    };
  }): Promise<string> => {
    // Si no hay credenciales, devolvemos PDF simulado
    if (!hasCredentials()) {
      const pdfContent = `%PDF-1.1\n1 0 obj<<>>endobj\n2 0 obj<< /Length 90 >>stream\nBT /F1 18 Tf 80 760 Td (Etiqueta Correo Argentino) Tj ET\nBT /F1 12 Tf 80 730 Td (Orden: ${payload.orderId}) Tj ET\nBT /F1 12 Tf 80 710 Td (Destinatario: ${payload.recipient.name}) Tj ET\nBT /F1 12 Tf 80 690 Td (Direccion: ${payload.recipient.address}) Tj ET\nBT /F1 12 Tf 80 670 Td (Ciudad: ${payload.recipient.city}) Tj ET\nBT /F1 12 Tf 80 650 Td (CP: ${payload.recipient.zip || ""}) Tj ET\nendstream\nendobj\n3 0 obj<< /Type /Catalog /Pages 4 0 R >>endobj\n4 0 obj<< /Type /Pages /Kids [5 0 R] /Count 1 >>endobj\n5 0 obj<< /Type /Page /Parent 4 0 R /MediaBox [0 0 595 842] /Contents 2 0 R /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> >> endobj\ntrailer<< /Root 3 0 R >>\n%%EOF`;
      return Buffer.from(pdfContent, "utf-8").toString("base64");
    }

    try {
      const headers = await withAuthHeaders({ "Content-Type": "application/json" });
      if (!headers) {
        throw new Error("Token no disponible");
      }

      const response = await fetch(`${CORREO_ARGENTINO_API_URL}/shipping/label`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          orderId: payload.orderId,
          shipmentId: payload.shipmentId,
          destinatario: {
            nombre: payload.recipient.name,
            direccion: payload.recipient.address,
            ciudad: payload.recipient.city,
            provincia: payload.recipient.state,
            cp: payload.recipient.zip,
            telefono: payload.recipient.phone,
          },
        }),
      });

      if (!response.ok) {
        logger.error("No se pudo generar etiqueta en Correo Argentino", {
          status: response.status,
          statusText: response.statusText,
        });
        throw new Error("Etiqueta no disponible");
      }

      const data = await response.json();
      if (data?.pdfBase64) {
        return data.pdfBase64 as string;
      }

      throw new Error("Respuesta de etiqueta inválida");
    } catch (error) {
      logger.error("Error generando etiqueta", { error });
      // Fallback a PDF simulado para no bloquear flujo
      const fallbackPdf = `%PDF-1.1\n1 0 obj<<>>endobj\n2 0 obj<< /Length 60 >>stream\nBT /F1 14 Tf 80 760 Td (Etiqueta temporal) Tj ET\nendstream\nendobj\n3 0 obj<< /Type /Catalog /Pages 4 0 R >>endobj\n4 0 obj<< /Type /Pages /Kids [5 0 R] /Count 1 >>endobj\n5 0 obj<< /Type /Page /Parent 4 0 R /MediaBox [0 0 595 842] /Contents 2 0 R /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> >> endobj\ntrailer<< /Root 3 0 R >>\n%%EOF`;
      return Buffer.from(fallbackPdf, "utf-8").toString("base64");
    }
  },
};
