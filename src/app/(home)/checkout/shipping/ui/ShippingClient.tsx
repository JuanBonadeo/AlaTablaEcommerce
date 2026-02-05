"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/cart-stores";
import { useAddressStore } from "@/lib/store/address-store";
import { ShippingQuoteResponse, ShippingCarrier, ShippingService } from "@/lib/types/shipping.types";
import { getAddressByIdAction } from "@/lib/actions/address/address.actions";
import { calculateCartShipping } from "@/lib/actions/shipping/shipping-actions";
import { Address } from "@/lib/types/address.types";
import { Zap, Rocket, Package, Truck, Mail, AlertTriangle, ArrowLeft, ArrowRight, Loader2, Calendar } from "lucide-react";

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
    switch (service) {
      case "PRIORITARIO": return <Zap className="text-orange-400" size={24} />;
      case "EXPRESO": return <Rocket className="text-orange-400" size={24} />;
      case "CLASICO": return <Package className="text-orange-400" size={24} />;
      case "ROSARIO_LOCAL": return <Truck className="text-orange-400" size={24} />;
      default: return <Mail className="text-orange-400" size={24} />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-orange-400" size={40} />
      </div>
    );
  }

  if (!addressId) {
    return (
      <div className="flex flex-col items-center gap-6 py-10">
        <div className="bg-[#171718] border border-gray-800 rounded-xl p-6 max-w-md w-full">
          <div className="flex items-center gap-3 mb-4 text-yellow-500">
            <AlertTriangle size={24} />
            <h3 className="text-lg font-bold">Dirección requerida</h3>
          </div>

          <p className="text-gray-400 mb-6">
            Debes seleccionar una dirección de entrega antes de calcular el envío.
          </p>
          <button
            onClick={() => router.push("/checkout/address")}
            className="w-full px-4 py-3 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors font-medium flex items-center justify-center gap-2"
          >
            Seleccionar dirección
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 py-10">
        <div className="bg-[#171718] border border-gray-800 rounded-xl p-6 max-w-md w-full">
          <div className="flex items-center gap-3 mb-4 text-gray-200">
            <Package size={24} className="text-orange-400" />
            <h3 className="text-lg font-bold">Tu carrito está vacío</h3>
          </div>

          <p className="text-gray-400 mb-6">
            Agrega productos para continuar con el checkout.
          </p>
          <button
            onClick={() => router.push("/productos")}
            className="w-full px-4 py-3 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors font-medium flex items-center justify-center gap-2"
          >
            Ver productos
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-6">
      {/* Información de la dirección */}
      {address && (
        <div className="bg-[#171718] rounded-xl shadow-sm border border-gray-800 p-6">
          <h3 className="text-lg font-bold text-white mb-3">
            Dirección de entrega
          </h3>
          <div className="text-sm text-gray-400 space-y-1 pl-4 border-l-2 border-gray-800">
            <p className="font-medium text-gray-200">
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
      <div className="bg-[#171718] rounded-xl shadow-sm border border-gray-800 p-6">
        <h3 className="text-lg font-bold text-white mb-4">
          Selecciona tu opción de envío
        </h3>

        {quotes.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-800 rounded-xl">
            <p className="text-gray-400">No hay opciones de envío disponibles para esta zona.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {quotes.map((quote) => (
              <div
                key={`${quote.carrier}-${quote.service}`}
                onClick={() => handleSelectQuote(quote)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedQuote?.service === quote.service && selectedQuote?.carrier === quote.carrier
                  ? "border-orange-400 bg-orange-400/5 shadow-md ring-1 ring-orange-400/20"
                  : "border-gray-800 bg-[#0a0a0a] hover:border-gray-700 hover:bg-[#1a1a1c]"
                  }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <span className="p-2 bg-[#171718] rounded-lg border border-gray-800 mt-1">
                      {getServiceIcon(quote.service)}
                    </span>
                    <div className="flex-1">
                      <h4 className="text-white font-bold text-base">
                        {quote.serviceName}
                      </h4>
                      <div className="flex items-center gap-3 mt-1.5 text-sm text-gray-500">
                        <span className="flex items-center gap-1.5 ">
                          <Truck size={14} />
                          {quote.carrier}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                        <span className="flex items-center gap-1.5 text-gray-400">
                          <Calendar size={14} />
                          {quote.estimatedDays} {quote.estimatedDays === 1 ? "día" : "días"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-white">
                      {formatCurrency(quote.cost)}
                    </p>
                    {quote.estimatedDays === 1 && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium rounded-md">
                        Rápido
                      </span>
                    )}
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
          className="flex-1 px-6 py-4 border border-gray-800 text-gray-300 rounded-xl hover:border-gray-700 hover:bg-gray-800/50 transition-all font-medium flex items-center justify-center gap-2"
        >
          <ArrowLeft size={18} />
          Volver
        </button>
        <button
          onClick={handleContinue}
          disabled={!selectedQuote}
          className={`flex-1 px-6 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${selectedQuote
            ? "bg-orange-400 text-white hover:bg-orange-500 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-orange-900/20"
            : "bg-gray-800 text-gray-500 cursor-not-allowed"
            }`}
        >
          Continuar al Resumen
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
