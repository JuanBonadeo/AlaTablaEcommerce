import { NextResponse } from "next/server";
import { logger } from "@/core/shared/logger";
import { ProductDAO } from "@/core/products/products.dao";
import { AndreaniService } from "@/core/shipments/andreani.service";

type ShippingCalculateRequest = {
  items: {
    productId: string;
    quantity: number;
  }[];
  destinationZipCode: string;
};

export async function POST(request: Request) {
  try {
    const body: ShippingCalculateRequest = await request.json();

    // Validar datos de entrada
    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, message: "No hay productos en el carrito" },
        { status: 400 }
      );
    }

    if (!body.destinationZipCode || body.destinationZipCode.trim().length < 4) {
      return NextResponse.json(
        { success: false, message: "Código postal de destino inválido" },
        { status: 400 }
      );
    }

    // Calcular peso y valor total
    let totalWeight = 0;
    let totalValue = 0;

    for (const item of body.items) {
      const product = await ProductDAO.getById(item.productId);

      if (!product) {
        logger.warn("Product not found in shipping calculation", {
          productId: item.productId,
        });
        continue;
      }

      const itemWeight = product.weight || 500;
      totalWeight += itemWeight * item.quantity;

      totalValue += product.price * item.quantity;
    }

    if (totalWeight === 0) {
      return NextResponse.json({
        success: true,
        data: {
          quotes: [],
          totalWeight: 0,
          totalValue: 0,
          message: "No hay productos válidos en el carrito",
        },
      });
    }

    logger.info("Calculating shipping for cart", {
      totalWeight,
      totalValue,
      destinationZipCode: body.destinationZipCode,
    });

    // Obtener cotización de Andreani
    const quotes = await AndreaniService.getQuote({
      originZipCode: process.env.ORIGIN_ZIP_CODE || "2000",
      destinationZipCode: body.destinationZipCode,
      weight: totalWeight,
      declaredValue: totalValue,
    });

    return NextResponse.json({
      success: true,
      data: {
        quotes,
        totalWeight,
        totalValue,
      },
    });
  } catch (error) {
    logger.error("Error calculating shipping", { error });

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Error al calcular envío",
      },
      { status: 500 }
    );
  }
}
