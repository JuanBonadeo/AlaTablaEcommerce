'use client';

import { useEffect, useState } from 'react';
import { AddressModal } from './AddressModal';
import { deleteAddressAction, getMyAddressesAction, updateAddressAction } from '@/lib/actions/address/address.actions';
import { Address } from '@/lib/types/address.types';
import { authClient } from '@/lib/auth/auth-client';
import { useRouter } from 'next/navigation';
import { useAddressStore } from '@/lib/store/address-store';
import { AddressClientSkeleton } from '@/components/ui/skeletons/AddressClientSkeleton';
import { Truck, Store, MapPin, Phone, Edit, ArrowRight } from 'lucide-react';

export const AddressClient = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id || '';
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(selectedAddress?.id || null);
  const [selectedOption, setSelectedOption] = useState<'delivery' | 'pickup'>('delivery');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMyAddressesAction(userId);

        const list: Address[] = data;

        setAddresses(list);
        const defaultAddr = list.find((a) => a.isDefault);
        setSelectedAddress(defaultAddr || list[0] || null);
      } catch (err) {
        console.error('Error fetching addresses:', err);
        setAddresses([]);
        setSelectedAddress(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [userId]);

  useEffect(() => {
    if (selectedAddress) {
      setSelectedAddressId(selectedAddress.id);
    }
  }, [selectedAddress]);

  const { setAddressId } = useAddressStore();
  const router = useRouter();

  const handleContinue = () => {
    // Permitir continuar sin dirección: si es retiro, forzar null; si es envío sin dirección, continuar igualmente
    const nextAddressId = selectedOption === 'pickup' ? null : (selectedAddressId || null);
    setAddressId(nextAddressId);

    // Si seleccionó envío a domicilio, ir a la página de shipping
    if (selectedOption === 'delivery' && nextAddressId) {
      router.push('/checkout/shipping');
    } else {
      // Si es retiro, ir directo a confirm
      router.push('/checkout/confirm');
    }
  }

  if (isLoading) {
    return <AddressClientSkeleton />;
  }

  return (
    <div className="flex flex-col items-center gap-6 sm:gap-8">
      {showModal && (
        <AddressModal
          addresses={addresses}
          selected={selectedAddress}
          onSelect={(addr) => setSelectedAddress(addr)}
          onClose={() => setShowModal(false)}
          onDelete={async (id) => {
            setAddresses((prev) => prev.filter((a) => a.id !== id));
            await deleteAddressAction(id);
          }}
          onSetDefault={
            async (id) => {
              setAddresses((prev) =>
                prev.map((a) => (a.id === id ? { ...a, isDefault: true } : { ...a, isDefault: false }))
              );
              await updateAddressAction(id, { isDefault: true });
            }
          }
          onCreate={(addr) => {
            if (!addr) return;
            setAddresses((prev) => [addr, ...prev]);
            setSelectedAddress(addr);
          }}
          userId={userId}
        />
      )}

      <div className="w-full flex flex-col gap-4 sm:gap-5">

        {/* Opción Envío a domicilio */}
        <div
          className={`rounded-2xl p-4 sm:p-6 transition-all cursor-pointer border-2 ${selectedOption === 'delivery'
              ? 'bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500 ring-2 ring-orange-500/20 shadow-xl shadow-orange-500/10'
              : 'bg-gradient-to-br from-[#171718] to-[#0f0f10] border-gray-800/50 hover:border-gray-700 hover:shadow-lg'
            }`}
          onClick={() => {
            setSelectedOption('delivery');
            // Si no hay dirección seleccionada, abrir modal para elegir/crear una
            if (!selectedAddressId) setShowModal(true);
          }}
        >
          <div className="flex justify-between items-start gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className={`p-2 sm:p-2.5 rounded-xl transition-all ${selectedOption === 'delivery' ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/50' : 'bg-gray-800 text-gray-400'}`}>
                  <Truck size={18} className="sm:w-5 sm:h-5" />
                </div>
                <h3 className={`font-bold text-base sm:text-lg ${selectedOption === 'delivery' ? 'text-orange-400' : 'text-gray-200'}`}>
                  Enviar a domicilio
                </h3>
              </div>

              {selectedAddress ? (
                <div className="ml-1 pl-3 sm:pl-4 border-l-2 border-gray-700/50 space-y-1 sm:space-y-1.5">
                  <p className="text-white font-semibold text-sm sm:text-base">
                    {selectedAddress.street}
                  </p>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    {selectedAddress.city}, {selectedAddress.state} - CP {selectedAddress.zip}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500 pt-2">
                    <span className="flex items-center gap-1"><MapPin size={12} /> {selectedAddress.firstName} {selectedAddress.lastName}</span>
                    <span className="hidden sm:block w-1 h-1 rounded-full bg-gray-700"></span>
                    <span className="flex items-center gap-1"><Phone size={12} /> {selectedAddress.phone}</span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-xs sm:text-sm ml-1 sm:ml-12">No hay dirección seleccionada.</p>
              )}

              <button
                onClick={(e) => { e.stopPropagation(); setShowModal(true); }}
                className="text-orange-400 hover:text-orange-300 text-xs sm:text-sm mt-3 sm:mt-4 font-medium flex items-center gap-1 ml-1 transition-colors"
              >
                <Edit size={12} className="sm:w-3.5 sm:h-3.5" />
                {selectedAddress ? 'Modificar domicilio o elegir otro' : 'Agregar o seleccionar domicilio'}
              </button>

              <input
                type="radio"
                name="address"
                className="sr-only"
                checked={selectedOption === 'delivery'}
                onChange={() => setSelectedOption('delivery')}
              />
            </div>
          </div>
        </div>

        {/* Opcion Retiro x Local */}
        <div
          className={`rounded-2xl p-4 sm:p-6 transition-all cursor-pointer border-2 ${selectedOption === 'pickup'
              ? 'bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500 ring-2 ring-orange-500/20 shadow-xl shadow-orange-500/10'
              : 'bg-gradient-to-br from-[#171718] to-[#0f0f10] border-gray-800/50 hover:border-gray-700 hover:shadow-lg'
            }`}
          onClick={() => setSelectedOption('pickup')}
        >
          <div className="flex justify-between items-start gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className={`p-2 sm:p-2.5 rounded-xl transition-all ${selectedOption === 'pickup' ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/50' : 'bg-gray-800 text-gray-400'}`}>
                  <Store size={18} className="sm:w-5 sm:h-5" />
                </div>
                <h3 className={`font-bold text-base sm:text-lg ${selectedOption === 'pickup' ? 'text-orange-400' : 'text-gray-200'}`}>
                  Retirar en Local
                </h3>
              </div>

              <div className="ml-1 pl-3 sm:pl-4 border-l-2 border-gray-700/50 space-y-1 sm:space-y-1.5">
                <p className="text-white font-semibold text-sm sm:text-base">
                  Garcia del Cossio 2198 biss Barrio Palos verdes
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  Lu a Vi: 9 a 18 hs. Sá: 10 a 14 hs.
                </p>
              </div>
            </div>

            <span className="font-bold text-green-400 text-xs sm:text-sm bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/30 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg shadow-sm flex-shrink-0">Gratis</span>

            <input
              type="radio"
              name="address"
              className="sr-only"
              checked={selectedOption === 'pickup'}
              onChange={() => setSelectedOption('pickup')}
            />
          </div>
        </div>

      </div>

      <button
        className="w-full py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] flex justify-center items-center gap-2 text-sm sm:text-base"
        onClick={handleContinue}
      >
        Continuar Compra
        <ArrowRight size={18} className="sm:w-5 sm:h-5" />
      </button>
    </div>
  );
};
