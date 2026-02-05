"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/cart-stores";
import { useAddressStore } from "@/lib/store/address-store";
import { ShippingQuoteResponse, ShippingCarrier, ShippingService } from "@/lib/types/shipping.types";
import { getAddressByIdAction } from "@/lib/actions/address/address.actions";
import { calculateCartShipping } from "@/lib/actions/shipping/shipping-actions";
import { Address } from "@/lib/types/address.types";
import { Zap, Rocket, Package, Truck, Mail, AlertTriangle, ArrowLeft, ArrowRight, Loader2, Calendar, MapPin } from "lucide-react";
import { ShippingClientSkeleton } from "@/components/ui/skeletons/ShippingClientSkeleton";

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
            // Usar directamente las cotizaciones que vienen del servicio
            // El AndreaniService ya maneja la lógica de zip code 2000
            setQuotes(result.data.quotes || []);
          } else {
            setQuotes([]);
          }
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
    return <ShippingClientSkeleton />;
  }

  if (!addressId) {
    return (
      <div className="flex flex-col items-center gap-6 py-10">
        <div className="bg-gradient-to-br from-[#171718] to-[#0f0f10] border border-gray-800/50 rounded-2xl p-5 sm:p-6 max-w-md w-full shadow-xl">
          <div className="flex items-center gap-3 mb-4 text-yellow-500">
            <AlertTriangle size={24} />
            <h3 className="text-base sm:text-lg font-bold">Dirección requerida</h3>
          </div>

          <p className="text-gray-400 mb-6 text-sm sm:text-base">
            Debes seleccionar una dirección de entrega antes de calcular el envío.
          </p>
          <button
            onClick={() => router.push("/checkout/address")}
            className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl transition-all font-medium flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 text-sm sm:text-base"
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
        <div className="bg-gradient-to-br from-[#171718] to-[#0f0f10] border border-gray-800/50 rounded-2xl p-5 sm:p-6 max-w-md w-full shadow-xl">
          <div className="flex items-center gap-3 mb-4 text-gray-200">
            <Package size={24} className="text-orange-400" />
            <h3 className="text-base sm:text-lg font-bold">Tu carrito está vacío</h3>
          </div>

          <p className="text-gray-400 mb-6 text-sm sm:text-base">
            Agrega productos para continuar con el checkout.
          </p>
          <button
            onClick={() => router.push("/productos")}
            className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl transition-all font-medium flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 text-sm sm:text-base"
          >
            Ver productos
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {/* Información de la dirección */}
      {address && (
        <div className="bg-gradient-to-br from-[#171718] to-[#0f0f10] rounded-2xl shadow-xl border border-gray-800/50 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-bold text-white mb-3 flex items-center gap-2">
            <MapPin className="text-orange-400" size={18} />
            Dirección de entrega
          </h3>
          <div className="text-xs sm:text-sm text-gray-400 space-y-1 pl-3 sm:pl-4 border-l-2 border-gray-700/50">
            <p className="font-medium text-white text-sm sm:text-base">
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
      <div className="bg-gradient-to-br from-[#171718] to-[#0f0f10] rounded-2xl shadow-xl border border-gray-800/50 p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4 sm:mb-5">
          <div className="h-1 w-8 bg-orange-500 rounded-full"></div>
          <h3 className="text-base sm:text-lg font-bold text-white">
            Selecciona tu opción de envío
          </h3>
        </div>

        {quotes.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-800 rounded-xl">
            <p className="text-gray-400 text-sm sm:text-base">No hay opciones de envío disponibles para esta zona.</p>
          </div>
        ) : (
          <div className="space-y-3">{quotes.map((quote) => (
              <div
                key={`${quote.carrier}-${quote.service}`}
                onClick={() => handleSelectQuote(quote)}
                className={`p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedQuote?.service === quote.service && selectedQuote?.carrier === quote.carrier
                  ? "border-orange-500 bg-gradient-to-br from-orange-500/10 to-orange-600/5 shadow-xl ring-2 ring-orange-500/20"
                  : "border-gray-800/50 bg-[#0a0a0a] hover:border-gray-700 hover:shadow-lg"
                  }`}
              >
                <div className="flex items-start justify-between gap-3 sm:gap-4">
                  <div className="flex items-start gap-2 sm:gap-4 flex-1 min-w-0">
                    <span className="p-2 bg-[#171718] rounded-lg border border-gray-800 flex-shrink-0">
                      {getServiceIcon(quote.service)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-bold text-sm sm:text-base">
                        {quote.serviceName}
                      </h4>
                      <div className="flex items-center gap-2 sm:gap-3 mt-1.5 text-xs sm:text-sm text-gray-500 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Truck size={12} className="sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                          <span className="truncate">{quote.carrier}</span>
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-700 hidden xs:block"></span>
                        <span className="flex items-center gap-1 text-gray-400">
                          <Calendar size={12} className="sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                          {quote.estimatedDays} {quote.estimatedDays === 1 ? "día" : "días"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-base sm:text-xl font-bold text-white">
                      {formatCurrency(quote.cost)}
                    </p>
                    {quote.estimatedDays === 1 && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] sm:text-xs font-medium rounded-md">
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
      <div className="flex gap-3 sm:gap-4 mt-2">
        <button
          onClick={handleBack}
          className="flex-1 px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-800 text-gray-300 rounded-xl hover:border-gray-700 hover:bg-gray-800/50 transition-all font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <ArrowLeft size={16} className="sm:w-4.5 sm:h-4.5" />
          <span className="hidden xs:inline">Volver</span>
        </button>
        <button
          onClick={handleContinue}
          disabled={!selectedQuote}
          className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm sm:text-base ${selectedQuote
            ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-orange-500/25"
            : "bg-gray-800 text-gray-500 cursor-not-allowed"
            }`}
        >
          Continuar
          <ArrowRight size={16} className="sm:w-4.5 sm:h-4.5" />
        </button>
      </div>
    </div>
  );
};
