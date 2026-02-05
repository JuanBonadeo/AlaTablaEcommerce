"use client";

import { useShippingCalculator } from "@/lib/hooks/useShippingCalculator";
import { useState } from "react";
import { ShippingQuoteResponse } from "@/lib/types/shipping.types";
import { Zap, Rocket, Package, Mail, Calendar, Info, XCircle, AlertTriangle, Loader2, Check } from "lucide-react";

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
        return <Zap className="text-orange-500" size={24} />;
      case "EXPRESO":
        return <Rocket className="text-orange-500" size={24} />;
      case "CLASICO":
        return <Package className="text-orange-500" size={24} />;
      default:
        return <Mail className="text-orange-500" size={24} />;
    }
  };

  const isDisabled = loading || cartItems.length === 0;

  return (
    <div className="w-full space-y-4">
      {/* Input Section */}
      <div className="bg-[#171718] rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-bold text-white mb-4">
          Calcular costo de envío
        </h3>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="zipCode"
              className="block text-sm font-medium text-gray-400 mb-2"
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
                className="flex-1 bg-[#0a0a0a] px-4 py-2 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                maxLength={8}
                disabled={loading}
              />
              <button
                onClick={handleCalculate}
                disabled={isDisabled}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${isDisabled
                    ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                    : "bg-orange-600 text-white hover:bg-orange-700 active:scale-95"
                  }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={18} />
                    Calculando
                  </span>
                ) : (
                  "Calcular"
                )}
              </button>
            </div>
          </div>

          {cartItems.length === 0 && (
            <div className="flex items-center gap-2 text-sm text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
              <AlertTriangle size={18} />
              Agrega productos al carrito para calcular el envío
            </div>
          )}
        </div>
      </div>

      {/* Error Section */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <XCircle className="text-red-500" size={24} />
            <div>
              <h4 className="font-medium text-red-400 mb-1">
                Error al calcular envío
              </h4>
              <p className="text-sm text-red-300/80">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Quotes Section */}
      {quotes.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-white">
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
                  className={`text-left p-4 rounded-xl border transition-all ${isSelected
                      ? "border-orange-500 bg-orange-500/5 shadow-md"
                      : "border-gray-800 bg-[#171718] hover:border-gray-700 hover:bg-[#202022]"
                    }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-[#0a0a0a] p-2 rounded-lg border border-gray-800">
                          {getServiceIcon(quote.service)}
                        </span>
                        <h4 className="font-bold text-white">
                          {quote.serviceName}
                        </h4>
                      </div>

                      <div className="space-y-1 text-sm pl-12">
                        <p className="text-gray-400 flex items-center gap-2">
                          <Calendar size={14} />
                          <span>
                            Llega en{" "}
                            <strong className="text-gray-200">
                              {quote.estimatedDays}{" "}
                              {quote.estimatedDays === 1
                                ? "día hábil"
                                : "días hábiles"}
                            </strong>
                          </span>
                        </p>

                        {quote.additionalInfo && (
                          <p className="text-gray-500 flex items-center gap-2">
                            <Info size={14} />
                            <span>{quote.additionalInfo}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-bold text-white">
                        {formatCurrency(quote.cost)}
                      </p>
                      {quote.estimatedDays === 1 && (
                        <span className="inline-block mt-2 px-2 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium rounded-md">
                          Más rápido
                        </span>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-orange-500/20 pl-12">
                      <p className="text-sm text-orange-400 font-medium flex items-center gap-2">
                        <Check size={16} />
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
            <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-400 font-medium">
                    Costo de envío:
                  </p>
                  <p className="text-xs text-orange-500/80 mt-1">
                    {selectedQuote.serviceName}
                  </p>
                </div>
                <p className="text-xl font-bold text-white">
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
