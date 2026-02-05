"use client";

import { useState } from "react";
import { calculateCartShipping } from "@/lib/actions/shipping/shipping-actions";
import { ShippingQuoteResponse } from "@/lib/types/shipping.types";

interface ShippingCalculatorProps {
  cartItems: {
    productId: string;
    variantId?: string;
    quantity: number;
  }[];
}

export function ShippingCalculator({ cartItems }: ShippingCalculatorProps) {
  const [zipCode, setZipCode] = useState("");
  const [quotes, setQuotes] = useState<ShippingQuoteResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<string | null>(null);

  const handleCalculate = async () => {
    if (!zipCode || zipCode.length < 4) {
      setError("Ingresa un código postal válido");
      return;
    }

    setLoading(true);
    setError(null);
    setQuotes([]);

    try {
      const result = await calculateCartShipping({
        items: cartItems,
        destinationZipCode: zipCode,
      });

      if (!result.success) {
        setError(result.message || "Error al calcular el envío");
        return;
      }

      const quotes = result.data?.quotes || [];
      setQuotes(quotes);

      if (quotes.length === 0) {
        setError("No se encontraron opciones de envío disponibles");
      }
    } catch (err) {
      setError("Error al calcular el envío. Intenta nuevamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Calcular Envío</h2>

      <div className="mb-4">
        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
          Código Postal de Destino
        </label>
        <div className="flex gap-2">
          <input
            id="zipCode"
            type="text"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            placeholder="ej: 1425"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            maxLength={8}
          />
          <button
            onClick={handleCalculate}
            disabled={loading || cartItems.length === 0}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Calculando..." : "Calcular"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {quotes.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Opciones de Envío:</h3>
          {quotes.map((quote, index) => (
            <div
              key={index}
              onClick={() => setSelectedQuote(quote.service)}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedQuote === quote.service
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
                }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {quote.serviceName}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Entrega estimada: {quote.estimatedDays}{" "}
                    {quote.estimatedDays === 1 ? "día" : "días"}
                  </p>
                  {quote.additionalInfo && (
                    <p className="text-xs text-gray-500 mt-1">
                      {quote.additionalInfo}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-gray-900">
                    {formatCurrency(quote.cost)}
                  </p>
                </div>
              </div>
              {selectedQuote === quote.service && (
                <div className="mt-2 pt-2 border-t border-blue-200">
                  <p className="text-sm text-blue-600 font-medium">
                    ✓ Opción seleccionada
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {cartItems.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Agrega productos al carrito para calcular el envío</p>
        </div>
      )}
    </div>
  );
}
