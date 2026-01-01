"use client";

import { useShippingCalculator } from "@/lib/hooks/useShippingCalculator";
import { useState } from "react";
import { ShippingQuoteResponse } from "@/lib/types/shipping.types";

interface ShippingCalculatorAdvancedProps {
  cartItems: {
    productId: string;
    variantId?: string;
    quantity: number;
  }[];
  onQuoteSelected?: (quote: ShippingQuoteResponse) => void;
  defaultZipCode?: string;
}

export function ShippingCalculatorAdvanced({
  cartItems,
  onQuoteSelected,
  defaultZipCode = "",
}: ShippingCalculatorAdvancedProps) {
  const [zipCode, setZipCode] = useState(defaultZipCode);

  const {
    quotes,
    loading,
    error,
    selectedQuote,
    calculateShipping,
    selectQuote,
  } = useShippingCalculator({
    onSuccess: (quotes) => {
      console.log("Cotizaciones obtenidas:", quotes);
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });

  const handleCalculate = () => {
    calculateShipping(cartItems, zipCode);
  };

  const handleSelectQuote = (quote: ShippingQuoteResponse) => {
    selectQuote(quote);
    onQuoteSelected?.(quote);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  const getServiceIcon = (service: string) => {
    switch (service) {
      case "PRIORITARIO":
        return "⚡";
      case "EXPRESO":
        return "🚀";
      case "CLASICO":
        return "📦";
      default:
        return "📬";
    }
  };

  const isDisabled = loading || cartItems.length === 0;

  return (
    <div className="w-full space-y-4">
      {/* Input Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Calcular costo de envío
        </h3>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="zipCode"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Código Postal de Destino
            </label>
            <div className="flex gap-2">
              <input
                id="zipCode"
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="Ej: 1425"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                maxLength={8}
                disabled={loading}
              />
              <button
                onClick={handleCalculate}
                disabled={isDisabled}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  isDisabled
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
                }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Calculando
                  </span>
                ) : (
                  "Calcular"
                )}
              </button>
            </div>
          </div>

          {cartItems.length === 0 && (
            <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
              ⚠️ Agrega productos al carrito para calcular el envío
            </div>
          )}
        </div>
      </div>

      {/* Error Section */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-red-600 text-xl">❌</span>
            <div>
              <h4 className="font-medium text-red-900 mb-1">
                Error al calcular envío
              </h4>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Quotes Section */}
      {quotes.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">
            Opciones de envío disponibles
          </h3>

          <div className="grid gap-3">
            {quotes.map((quote, index) => {
              const isSelected =
                selectedQuote?.service === quote.service &&
                selectedQuote?.carrier === quote.carrier;

              return (
                <button
                  key={index}
                  onClick={() => handleSelectQuote(quote)}
                  className={`text-left p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">
                          {getServiceIcon(quote.service)}
                        </span>
                        <h4 className="font-semibold text-gray-900">
                          {quote.serviceName}
                        </h4>
                      </div>

                      <div className="space-y-1 text-sm">
                        <p className="text-gray-600 flex items-center gap-2">
                          <span>📅</span>
                          <span>
                            Llega en{" "}
                            <strong className="text-gray-900">
                              {quote.estimatedDays}{" "}
                              {quote.estimatedDays === 1
                                ? "día hábil"
                                : "días hábiles"}
                            </strong>
                          </span>
                        </p>

                        {quote.additionalInfo && (
                          <p className="text-gray-500 flex items-center gap-2">
                            <span>ℹ️</span>
                            <span>{quote.additionalInfo}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(quote.cost)}
                      </p>
                      {quote.estimatedDays === 1 && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                          Más rápido
                        </span>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <p className="text-sm text-blue-700 font-medium flex items-center gap-2">
                        <span>✓</span>
                        <span>Opción seleccionada</span>
                      </p>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Summary */}
          {selectedQuote && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 font-medium">
                    Costo de envío:
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    {selectedQuote.serviceName}
                  </p>
                </div>
                <p className="text-xl font-bold text-blue-900">
                  {formatCurrency(selectedQuote.cost)}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
