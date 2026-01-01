import { NextRequest, NextResponse } from "next/server";
import { ShippingQuoteRequestSchema } from "@/lib/types/shipping.types";
import { CorreoArgentinoService } from "@/core/shipments/correo-argentino.service";
import { ErrorHandler } from "@/core/shared/errorHandler";
import { ResponseHandler } from "@/core/shared/responseHandler";

/**
 * POST /api/shipping/quote
 * Endpoint para obtener cotizaciones de envío
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar la solicitud
    const validatedData = ShippingQuoteRequestSchema.parse(body);
    
    // Obtener cotizaciones de Correo Argentino
    const quotes = await CorreoArgentinoService.getQuote(validatedData);
    
    return NextResponse.json(ResponseHandler.success(quotes));
  } catch (error) {
    const formattedError = ErrorHandler.format(error);
    return NextResponse.json(formattedError, { 
      status: formattedError.status 
    });
  }
}

/**
 * GET /api/shipping/quote/health
 * Verifica si la API de Correo Argentino está disponible
 */
export async function GET() {
  try {
    const isAvailable = await CorreoArgentinoService.checkApiAvailability();
    
    return NextResponse.json(ResponseHandler.success({
      available: isAvailable,
      carrier: "CORREO_ARGENTINO",
      message: isAvailable 
        ? "API de Correo Argentino disponible" 
        : "API no disponible - usando tarifas estimadas",
    }));
  } catch (error) {
    const formattedError = ErrorHandler.format(error);
    return NextResponse.json(formattedError, { 
      status: formattedError.status 
    });
  }
}
