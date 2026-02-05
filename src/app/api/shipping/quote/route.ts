import { NextResponse } from "next/server";

import { AndreaniService } from "@/core/shipments/andreani.service";
import {
  ShippingQuoteRequest,
  ShippingQuoteRequestSchema,
} from "@/lib/types/shipping.types";
import { logger } from "@/core/shared/logger";

export async function POST(request: Request) {
  try {
    const body: ShippingQuoteRequest = await request.json();

    // Validar datos de entrada
    const validatedData = ShippingQuoteRequestSchema.parse(body);

    logger.info("Shipping quote request", { data: validatedData });

    // Obtener cotización
    const quotes = await AndreaniService.getQuote(validatedData);

    return NextResponse.json({
      success: true,
      data: quotes,
    });
  } catch (error) {
    logger.error("Error getting shipping quote", { error });

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Error al obtener cotización",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // No longer checking API availability, always return estimated rates
    return NextResponse.json({
      success: true,
      data: {
        available: true,
        carrier: "ANDREANI",
        message: "Usando tarifas de Andreani",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error checking API availability",
      },
      { status: 500 }
    );
  }
}
