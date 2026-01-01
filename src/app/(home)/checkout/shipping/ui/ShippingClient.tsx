"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/cart-stores";
import { useAddressStore } from "@/lib/store/address-store";
import { ShippingQuoteResponse, ShippingCarrier, ShippingService } from "@/lib/types/shipping.types";
import { getAddressByIdAction } from "@/lib/actions/address/address.actions";
import { calculateCartShipping } from "@/lib/actions/shipping/shipping-actions";
import { Address } from "@/lib/types/address.types";

export const ShippingClient = () => {
  const router = useRouter();
  const cart = useCartStore((state) => state.cart);
  const addressId = useAddressStore((state) => state.addressId);
  const shippingQuote = useCartStore((state) => state.shippingQuote);
  const setShippingQuote = useCartStore((state) => state.setShippingQuote);
  
  const [address, setAddress] = useState<Address | null>(null);
  const [quotes, setQuotes] = useState<ShippingQuoteResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState<ShippingQuoteResponse | null>(shippingQuote || null);

  useEffect(() => {
    const loadAddressAndQuotes = async () => {
      if (!addressId) {
        setLoading(false);
        return;
      }

      try {
        // Cargar dirección
        const addr = await getAddressByIdAction(addressId);
        setAddress(addr);

        const isRosario =
          addr?.city?.toLowerCase().includes("rosario") || addr?.zip?.startsWith("2000");

        // Calcular envíos con el zip code de la dirección
        if (cart.length > 0 && addr?.zip) {
          const cartItems = cart.map((item) => ({
            productId: item.productId,
            variantId: item.variantId || undefined,
            quantity: item.quantity,
          }));

          const result = await calculateCartShipping({
            items: cartItems,
            destinationZipCode: addr.zip,
          });
          
          if (result && "data" in result && result.data && "quotes" in result.data) {
            let nextQuotes = result.data.quotes || [];

            // Agregar opción local Rosario si aplica
            if (isRosario) {
              const rosarioQuote: ShippingQuoteResponse = {
                carrier: ShippingCarrier.ENTREGA_LOCAL,
                service: ShippingService.ROSARIO_LOCAL,
                serviceName: "Envío Local Rosario",
                cost: 7500,
                estimatedDays: 1,
              };

              const exists = nextQuotes.some(
                (q) => q.service === rosarioQuote.service && q.carrier === rosarioQuote.carrier
              );
              if (!exists) {
                nextQuotes = [...nextQuotes, rosarioQuote];
              }
            }

            setQuotes(nextQuotes);
          } else if (isRosario) {
            // Sin cotizaciones externas, pero habilitamos envío local
            setQuotes([
              {
                carrier: ShippingCarrier.ENTREGA_LOCAL,
                service: ShippingService.ROSARIO_LOCAL,
                serviceName: "Envío Local Rosario",
                cost: 7500,
                estimatedDays: 1,
              },
            ]);
          } else {
            setQuotes([]);
          }
        } else if (isRosario) {
          // No hay carrito o zip, pero dirección indica Rosario: mostrar opción local
          setQuotes([
            {
              carrier: ShippingCarrier.ENTREGA_LOCAL,
              service: ShippingService.ROSARIO_LOCAL,
              serviceName: "Envío Local Rosario",
              cost: 7500,
              estimatedDays: 1,
            },
          ]);
        } else {
          setQuotes([]);
        }
      } catch (error) {
        console.error("Error cargando dirección y envíos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAddressAndQuotes();
  }, [addressId, cart]);

  const handleSelectQuote = (quote: ShippingQuoteResponse) => {
    setSelectedQuote(quote);
    setShippingQuote(quote);
  };

  const handleContinue = () => {
    if (!selectedQuote) {
      alert("Por favor selecciona una opción de envío");
      return;
    }
    router.push("/checkout/confirm");
  };

  const handleBack = () => {
    router.push("/checkout/address");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  const getServiceIcon = (service: string) => {
    const icons: Record<string, string> = {
      PRIORITARIO: "⚡",
      EXPRESO: "🚀",
      CLASICO: "📦",
      ROSARIO_LOCAL: "🛵",
    };
    return icons[service] || "📬";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!addressId) {
    return (
      <div className="flex flex-col items-center gap-6 py-10">
        <div className="bg border border-gray-700 rounded-lg p-6 max-w-md">
          <h3 className="text-lg font-semibold text-gray-200 mb-2">
            ⚠️ Dirección requerida
          </h3>
          <p className="text-gray-400 mb-4">
            Debes seleccionar una dirección de entrega antes de calcular el envío.
          </p>
          <button
            onClick={() => router.push("/checkout/address")}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Seleccionar dirección
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 py-10">
        <div className="bg border border-gray-700 rounded-lg p-6 max-w-md">
          <h3 className="text-lg font-semibold text-gray-200 mb-2">
            Tu carrito está vacío
          </h3>
          <p className="text-gray-400 mb-4">
            Agrega productos para continuar con el checkout.
          </p>
          <button
            onClick={() => router.push("/productos")}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Ver productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-6">
      {/* Información de la dirección */}
      {address && (
        <div className="bg rounded-lg shadow-sm border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-200 mb-3">
            Dirección de entrega
          </h3>
          <div className="text-sm text-gray-400 space-y-1">
            <p className="font-medium text-gray-300">
              {address.firstName} {address.lastName}
            </p>
            <p>{address.street}</p>
            <p>
              {address.city}, {address.state} - CP: {address.zip}
            </p>
            <p>Tel: {address.phone}</p>
          </div>
        </div>
      )}

      {/* Opciones de envío */}
      <div className="bg rounded-lg shadow-sm border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-200 mb-4">
          Selecciona tu opción de envío
        </h3>

        {quotes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No hay opciones de envío disponibles para esta zona.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {quotes.map((quote) => (
              <div
                key={`${quote.carrier}-${quote.service}`}
                onClick={() => handleSelectQuote(quote)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedQuote?.service === quote.service && selectedQuote?.carrier === quote.carrier
                    ? "border-blue-600 bg-blue-600 bg-opacity-10"
                    : "border-gray-700 hover:border-gray-600"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-2xl mt-1">{getServiceIcon(quote.service)}</span>
                    <div className="flex-1">
                      <h4 className="text-gray-200 font-semibold">
                        {quote.serviceName}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {quote.carrier} • {quote.estimatedDays} {quote.estimatedDays === 1 ? "día" : "días"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-400">
                      {formatCurrency(quote.cost)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">costo de envío</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botones de navegación */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={handleBack}
          className="flex-1 px-6 py-3 border-2 border-gray-600 text-gray-300 rounded-lg hover:border-gray-500 hover:bg-gray-800 transition-all font-medium"
        >
          ← Volver a dirección
        </button>
        <button
          onClick={handleContinue}
          disabled={!selectedQuote}
          className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
            selectedQuote
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-600 text-gray-400 cursor-not-allowed"
          }`}
        >
          Continuar al resumen →
        </button>
      </div>
    </div>
  );
};
