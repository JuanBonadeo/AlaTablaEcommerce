/**
 * Utilidades para cálculo de precios con ofertas
 */

export interface OfferData {
  id: string;
  descuento: number;
  descripcion: string | null;
  desde: Date | string;
  hasta: Date | string;
}

export interface PriceInfo {
  originalPrice: number;
  finalPrice: number;
  hasOffer: boolean;
  discount?: number;
  savings?: number;
}

/**
 * Calcula el precio final considerando la oferta activa
 */
export const calculatePrice = (
  basePrice: number,
  offer?: OfferData | null
): PriceInfo => {
  if (!offer) {
    return {
      originalPrice: basePrice,
      finalPrice: basePrice,
      hasOffer: false,
    };
  }

  const discount = offer.descuento;
  const finalPrice = basePrice * (1 - discount / 100);
  const savings = basePrice - finalPrice;

  return {
    originalPrice: basePrice,
    finalPrice,
    hasOffer: true,
    discount,
    savings,
  };
};

/**
 * Formatea un precio para mostrar
 */
export const formatPrice = (price: number): string => {
  return price.toFixed(2);
};

/**
 * Calcula el total del carrito considerando ofertas
 */
export const calculateCartTotal = (
  items: Array<{
    price: number;
    quantity: number;
    offer?: OfferData | null;
  }>
): { subtotal: number; total: number; savings: number } => {
  let subtotal = 0;
  let total = 0;

  items.forEach((item) => {
    const priceInfo = calculatePrice(item.price, item.offer);
    subtotal += priceInfo.originalPrice * item.quantity;
    total += priceInfo.finalPrice * item.quantity;
  });

  return {
    subtotal,
    total,
    savings: subtotal - total,
  };
};
