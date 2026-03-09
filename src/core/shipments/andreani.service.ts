import {
    ShippingQuoteRequest,
    ShippingQuoteResponse,
    ShippingCarrier,
    ShippingService,
} from "@/lib/types/shipping.types";
import { logger } from "../shared/logger";

// Configuración de Andreani API
const ANDREANI_API_URL = process.env.ANDREANI_API_URL || "https://apisqa.andreani.com";
const ANDREANI_USERNAME = process.env.ANDREANI_USERNAME || "";
const ANDREANI_PASSWORD = process.env.ANDREANI_PASSWORD || "";

// Código postal de origen (tu tienda/depósito)
const ORIGIN_ZIP_CODE = process.env.ORIGIN_ZIP_CODE || "1000"; // CABA por defecto

const TOKEN_SAFETY_WINDOW_MS = 60_000; // Renueva 1 minuto antes de expirar
const DEFAULT_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 horas según documentación

let cachedToken: string | null = null;
let tokenExpiresAt: number | null = null;

const hasCredentials = () => Boolean(ANDREANI_USERNAME && ANDREANI_PASSWORD);

const getCachedToken = () => {
    if (!cachedToken || !tokenExpiresAt) return null;
    const stillValid = Date.now() < tokenExpiresAt - TOKEN_SAFETY_WINDOW_MS;
    return stillValid ? cachedToken : null;
};

const cacheToken = (token: string, ttlMs?: number) => {
    const ttl = ttlMs ?? DEFAULT_TOKEN_TTL_MS;
    cachedToken = token;
    tokenExpiresAt = Date.now() + ttl;
};

/**
 * Obtiene el token de autenticación de Andreani
 * Usa Basic Auth (username:password) para obtener token válido por 24 horas
 */
const fetchAuthToken = async (): Promise<string | null> => {
    if (!hasCredentials()) {
        logger.warn("Andreani: faltan credenciales (username/password)", {
            hasUser: !!ANDREANI_USERNAME,
            hasPass: !!ANDREANI_PASSWORD,
            baseUrl: ANDREANI_API_URL,
        });
        return null;
    }

    const existing = getCachedToken();
    if (existing) return existing;

    try {
        const basic = Buffer.from(`${ANDREANI_USERNAME}:${ANDREANI_PASSWORD}`).toString("base64");
        const loginUrl = `${ANDREANI_API_URL}/login`;

        logger.info("Andreani: solicitando token", {
            url: loginUrl,
            user: ANDREANI_USERNAME?.substring(0, 3) + "***",
        });

        const response = await fetch(loginUrl, {
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
            logger.error("Andreani: no se pudo obtener token", {
                url: loginUrl,
                status: response.status,
                statusText: response.statusText,
                body: errorBody,
            });
            return null;
        }

        const data = await response.json();
        const token = data?.token || data?.access_token || data?.accessToken;

        if (!token) {
            logger.error("Andreani: respuesta de token inválida", { data });
            return null;
        }

        cacheToken(token, DEFAULT_TOKEN_TTL_MS);
        logger.info("Andreani: token obtenido exitosamente");
        return token;
    } catch (error) {
        logger.error("Andreani: excepción durante solicitud de token", {
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            url: `${ANDREANI_API_URL}/login`,
        });
        return null;
    }
};

const withAuthHeaders = async (extra?: Record<string, string>): Promise<Record<string, string> | null> => {
    const token = await fetchAuthToken();
    if (!token) return null;

    return {
        "x-authorization-token": token,
        ...(extra ?? {}),
    };
};

/**
 * Servicio para integración con API de Andreani
 * Documentación oficial: https://developers.andreani.com/document
 */
export const AndreaniService = {
    /**
     * Genera un número de tracking simulado cuando no viene desde la API
     */
    generateTrackingNumber: (): string => {
        const prefix = "AN";
        const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
        const randomPart = Math.floor(Math.random() * 1_000_000).toString().padStart(6, "0");
        return `${prefix}${datePart}${randomPart}`;
    },

    /**
     * Crea un envío (Pre-envío) en Andreani
     * Retorna el número de tracking/orden
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
            logger.warn("Andreani: usando tracking simulado (faltan credenciales)");
            return AndreaniService.generateTrackingNumber();
        }

        try {
            // Estructura del payload según API de Andreani
            const body = {
                contrato: ANDREANI_USERNAME, // Número de contrato
                origen: {
                    postal: {
                        codigoPostal: ORIGIN_ZIP_CODE,
                    },
                },
                destino: {
                    postal: {
                        nombreApellido: payload.recipient.name,
                        calle: payload.recipient.address,
                        localidad: payload.recipient.city,
                        provincia: payload.recipient.state || "",
                        codigoPostal: payload.recipient.zip,
                        telefono: payload.recipient.phone || "",
                    },
                },
                bultos: [
                    {
                        kilos: (payload.weightGrams || 1000) / 1000, // Convertir gramos a kilos
                        valorDeclaradoSinImpuestos: payload.declaredValue || 0,
                    },
                ],
                numeroDeDocumento: payload.orderId, // Referencia externa
            };

            const headers = await withAuthHeaders({ "Content-Type": "application/json" });
            if (!headers) {
                logger.warn("Andreani: no hay token, usando tracking simulado");
                return AndreaniService.generateTrackingNumber();
            }

            // Endpoint de Pre-envío (orden de envío)
            const response = await fetch(`${ANDREANI_API_URL}/v1/envios`, {
                method: "POST",
                headers,
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const errorText = await response.text();
                logger.error("Andreani: error al crear envío", {
                    status: response.status,
                    statusText: response.statusText,
                    body: errorText,
                });
                return AndreaniService.generateTrackingNumber();
            }

            const data = await response.json();
            const tracking = data?.numeroAndreani || data?.numeroEnvio || data?.tracking;

            if (!tracking) {
                logger.warn("Andreani: respuesta sin tracking, usando simulado", { data });
                return AndreaniService.generateTrackingNumber();
            }

            logger.info("Andreani: envío creado exitosamente", { tracking });
            return tracking as string;
        } catch (error) {
            logger.error("Andreani: excepción creando envío, fallback a tracking simulado", { error });
            return AndreaniService.generateTrackingNumber();
        }
    },

    /**
     * Genera etiqueta PDF para el envío
     * @param tracking Número de tracking/orden de Andreani
     */
    generateLabel: async (tracking: string): Promise<string> => {
        if (!hasCredentials()) {
            logger.warn("Andreani: generando PDF simulado (faltan credenciales)");
            return AndreaniService.generateFallbackPdf(tracking);
        }

        try {
            const headers = await withAuthHeaders();
            if (!headers) {
                return AndreaniService.generateFallbackPdf(tracking);
            }

            // Endpoint para obtener etiqueta
            const response = await fetch(`${ANDREANI_API_URL}/v1/envios/${tracking}/etiquetas`, {
                method: "GET",
                headers,
            });

            if (!response.ok) {
                logger.error("Andreani: error al obtener etiqueta", {
                    tracking,
                    status: response.status,
                    statusText: response.statusText,
                });
                return AndreaniService.generateFallbackPdf(tracking);
            }

            // La API puede devolver PDF directamente o un JSON con el PDF en base64
            const contentType = response.headers.get("content-type");

            if (contentType?.includes("application/pdf")) {
                // Si es PDF directo, convertir a base64
                const buffer = await response.arrayBuffer();
                return Buffer.from(buffer).toString("base64");
            } else {
                // Si es JSON con el PDF
                const data = await response.json();
                const pdfBase64 = data?.pdf || data?.etiqueta || data?.label;

                if (!pdfBase64) {
                    logger.warn("Andreani: respuesta sin PDF, usando fallback", { data });
                    return AndreaniService.generateFallbackPdf(tracking);
                }

                return pdfBase64 as string;
            }
        } catch (error) {
            logger.error("Andreani: error generando etiqueta", { tracking, error });
            return AndreaniService.generateFallbackPdf(tracking);
        }
    },

    /**
     * Genera un PDF básico de fallback cuando la API no está disponible
     */
    generateFallbackPdf: (tracking: string): string => {
        const pdfContent = `%PDF-1.1
1 0 obj<<>>endobj
2 0 obj<< /Length 150 >>stream
BT /F1 18 Tf 80 760 Td (Etiqueta Andreani) Tj ET
BT /F1 12 Tf 80 730 Td (Numero de Envio: ${tracking}) Tj ET
BT /F1 10 Tf 80 710 Td (Esta es una etiqueta temporal) Tj ET
BT /F1 10 Tf 80 690 Td (Generar etiqueta oficial desde Andreani) Tj ET
endstream
endobj
3 0 obj<< /Type /Catalog /Pages 4 0 R >>endobj
4 0 obj<< /Type /Pages /Kids [5 0 R] /Count 1 >>endobj
5 0 obj<< /Type /Page /Parent 4 0 R /MediaBox [0 0 595 842] /Contents 2 0 R /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> >> endobj
trailer<< /Root 3 0 R >>
%%EOF`;
        return Buffer.from(pdfContent, "utf-8").toString("base64");
    },

    /**
     * Obtiene cotizaciones de envío de Andreani (si está disponible)
     */
    getQuote: async (request: ShippingQuoteRequest): Promise<ShippingQuoteResponse[]> => {
        // Por ahora retornar estimados ya que la API de cotización requiere más investigación
        logger.info("Andreani: usando cotizaciones estimadas", { request });
        return AndreaniService.getEstimatedRates(request);
    },

    /**
     * Calcula tarifas estimadas cuando la API no está disponible
     */
    getEstimatedRates: (request: ShippingQuoteRequest): ShippingQuoteResponse[] => {
        const { destinationZipCode } = request;

        // Tarifa especial para entrega local en Rosario (código postal 2000)
        if (destinationZipCode === "2000") {
            return [
                {
                    carrier: ShippingCarrier.ENTREGA_LOCAL,
                    service: ShippingService.CLASICO,
                    serviceName: "Envío Local Rosario",
                    cost: 0,
                    estimatedDays: 5,
                    additionalInfo: "Entrega en 5 días gratuita",
                },
            ];
        }

        // Para el resto del país: tarifa fija de $7500
        // El envío será manejado manualmente
        return [
            {
                carrier: ShippingCarrier.ENTREGA_LOCAL,
                service: ShippingService.CLASICO,
                serviceName: "Envío a Domicilio",
                cost: 7500,
                estimatedDays: 7,
                additionalInfo: "Envío a todo el país",
            },
        ];
    },

    /**
     * Obtiene el estado del envío desde Andreani
     */
    getShipmentStatus: async (tracking: string): Promise<{
        status: string;
        location?: string;
        lastUpdate?: string;
        estimatedDelivery?: string;
    }> => {
        if (!hasCredentials()) {
            return {
                status: "EN_TRANSITO",
                location: "Centro de Distribución Andreani",
                lastUpdate: new Date().toISOString(),
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

            const response = await fetch(`${ANDREANI_API_URL}/v1/envios/${tracking}/trazas`, {
                method: "GET",
                headers,
            });

            if (!response.ok) {
                logger.warn("Andreani: no se pudo obtener estado", {
                    tracking,
                    status: response.status,
                });
                return {
                    status: "PENDIENTE",
                    location: "Desconocida",
                };
            }

            const data = await response.json();
            const ultimaTraza = data?.trazas?.[0]; // La primera traza es la más reciente

            return {
                status: ultimaTraza?.estado?.toUpperCase() || "DESCONOCIDO",
                location: ultimaTraza?.sucursal || "En tránsito",
                lastUpdate: ultimaTraza?.fecha,
            };
        } catch (error) {
            logger.error("Andreani: error obteniendo estado de envío", { tracking, error });
            return {
                status: "ERROR",
                location: "No disponible",
            };
        }
    },
};
