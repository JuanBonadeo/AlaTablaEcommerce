"use server";

import {
  ShippingQuoteRequest,
  ShippingQuoteRequestSchema,
  CartShippingCalculation,
  CartShippingCalculationSchema,
} from "@/lib/types/shipping.types";
import { CorreoArgentinoService } from "@/core/shipments/correo-argentino.service";
import { ProductDAO } from "@/core/products/products.dao";
import { ErrorHandler } from "@/core/shared/errorHandler";
import { ResponseHandler } from "@/core/shared/responseHandler";

/**
 * Obtiene cotizaciones de envío basadas en peso y destino
 */
export async function getShippingQuote(data: ShippingQuoteRequest) {
  try {
    const validatedData = ShippingQuoteRequestSchema.parse(data);
    const quotes = await CorreoArgentinoService.getQuote(validatedData);
    
    return ResponseHandler.success(quotes);
  } catch (error) {
    return ErrorHandler.format(error);
  }
}

/**
 * Calcula el costo de envío para el carrito completo
 */
export async function calculateCartShipping(data: CartShippingCalculation) {
  try {
    const validatedData = CartShippingCalculationSchema.parse(data);
    
    // Calcular peso total y valor declarado del carrito
    let totalWeight = 0;
    let totalValue = 0;
    
    for (const item of validatedData.items) {
      const product = await ProductDAO.getById(item.productId);
      
      if (!product) {
        continue;
      }
      
      // Peso estimado por producto (500g por defecto)
      // TODO: Agregar campo 'weight' al modelo Product si necesitas mayor precisión
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
      return ResponseHandler.success({
        quotes: [],
        totalWeight: 0,
        totalValue: 0,
        message: "El carrito está vacío",
      });
    }
    
    // Obtener cotizaciones
    const quotes = await CorreoArgentinoService.getQuote({
      originZipCode: process.env.ORIGIN_ZIP_CODE || "1000",
      destinationZipCode: validatedData.destinationZipCode,
      weight: totalWeight,
      declaredValue: totalValue,
    });
    
    return ResponseHandler.success({
      quotes,
      totalWeight,
      totalValue,
    });
  } catch (error) {
    return ErrorHandler.format(error);
  }
}

/**
 * Verifica la disponibilidad de la API de Correo Argentino
 */
export async function checkShippingApiAvailability() {
  try {
    const isAvailable = await CorreoArgentinoService.checkApiAvailability();
    
    return ResponseHandler.success({
      available: isAvailable,
      carrier: "CORREO_ARGENTINO",
      message: isAvailable 
        ? "API de Correo Argentino disponible" 
        : "API no disponible - usando tarifas estimadas",
    });
  } catch (error) {
    return ErrorHandler.format(error);
  }
}
