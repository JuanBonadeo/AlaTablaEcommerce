import { NextRequest, NextResponse } from "next/server";
import { CartShippingCalculationSchema } from "@/lib/types/shipping.types";
import { ProductDAO } from "@/core/products/products.dao";
import { CorreoArgentinoService } from "@/core/shipments/correo-argentino.service";
import { ErrorHandler } from "@/core/shared/errorHandler";
import { ResponseHandler } from "@/core/shared/responseHandler";

/**
 * POST /api/shipping/calculate
 * Endpoint para calcular el costo de envío basado en el carrito
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar la solicitud
    const validatedData = CartShippingCalculationSchema.parse(body);
    
    // Calcular peso total y valor declarado del carrito
    let totalWeight = 0;
    let totalValue = 0;
    
    for (const item of validatedData.items) {
      const product = await ProductDAO.getById(item.productId);
      
      if (!product) {
        continue;
      }
      
      // Peso estimado por producto (500g por defecto si no tienes peso en el modelo)
      // TODO: Agregar campo 'weight' al modelo Product si es necesario
      const itemWeight = 500; // 500 gramos por producto
      totalWeight += itemWeight * item.quantity;
      
      // Calcular precio según variante o producto
      let itemPrice = product.price;
      if (item.variantId && product.variants) {
        const variant = product.variants.find((v: any) => v.id === item.variantId);
        if (variant && variant.price) {
          itemPrice = variant.price;
        }
      }
      
      totalValue += itemPrice * item.quantity;
    }
    
    // Si el carrito está vacío
    if (totalWeight === 0) {
      return NextResponse.json(ResponseHandler.success({
        quotes: [],
        message: "El carrito está vacío",
      }));
    }
    
    // Obtener cotizaciones
    const quotes = await CorreoArgentinoService.getQuote({
      originZipCode: process.env.ORIGIN_ZIP_CODE || "1000",
      destinationZipCode: validatedData.destinationZipCode,
      weight: totalWeight,
      declaredValue: totalValue,
    });
    
    return NextResponse.json(ResponseHandler.success({
      quotes,
      totalWeight,
      totalValue,
    }));
  } catch (error) {
    const formattedError = ErrorHandler.format(error);
    return NextResponse.json(formattedError, { 
      status: formattedError.status 
    });
  }
}
