"use client";

import { useState } from "react";
import { calculateCartShipping } from "@/lib/actions/shipping/shipping-actions";
import { ShippingQuoteResponse } from "@/lib/types/shipping.types";

interface UseShippingCalculatorOptions {
  onSuccess?: (quotes: ShippingQuoteResponse[]) => void;
  onError?: (error: string) => void;
}

export function useShippingCalculator(options?: UseShippingCalculatorOptions) {
  const [quotes, setQuotes] = useState<ShippingQuoteResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<ShippingQuoteResponse | null>(null);

  const calculateShipping = async (
    items: { productId: string; variantId?: string; quantity: number }[],
    destinationZipCode: string
  ) => {
    if (!destinationZipCode || destinationZipCode.length < 4) {
      const errorMsg = "Código postal inválido";
      setError(errorMsg);
      options?.onError?.(errorMsg);
      return;
    }

    if (!items || items.length === 0) {
      const errorMsg = "El carrito está vacío";
      setError(errorMsg);
      options?.onError?.(errorMsg);
      return;
    }

    setLoading(true);
    setError(null);
    setQuotes([]);
    setSelectedQuote(null);

    try {
      const result = await calculateCartShipping({
        items,
        destinationZipCode,
      });

      if (!result.success) {
        const errorMsg = result.message || "Error al calcular el envío";
        setError(errorMsg);
        options?.onError?.(errorMsg);
        return;
      }

      const fetchedQuotes = (result.data?.quotes) || [];
      setQuotes(fetchedQuotes);

      if (fetchedQuotes.length === 0) {
        const errorMsg = "No hay opciones de envío disponibles";
        setError(errorMsg);
        options?.onError?.(errorMsg);
      } else {
        options?.onSuccess?.(fetchedQuotes);
      }
    } catch (err) {
      const errorMsg = "Error al calcular el envío";
      setError(errorMsg);
      options?.onError?.(errorMsg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectQuote = (quote: ShippingQuoteResponse) => {
    setSelectedQuote(quote);
  };

  const clearQuotes = () => {
    setQuotes([]);
    setSelectedQuote(null);
    setError(null);
  };

  const reset = () => {
    setQuotes([]);
    setSelectedQuote(null);
    setError(null);
    setLoading(false);
  };

  return {
    quotes,
    loading,
    error,
    selectedQuote,
    calculateShipping,
    selectQuote,
    clearQuotes,
    reset,
  };
}
