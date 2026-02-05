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
    <div className="flex flex-col items-center p-5 gap-10">
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

      <div className="w-full max-w-2xl flex flex-col gap-6">

        {/* Opción Envío a domicilio */}
        <div
          className={`rounded-xl p-6 transition-all cursor-pointer border ${selectedOption === 'delivery'
              ? 'bg-orange-500/5 border-orange-500 ring-1 ring-orange-500/20 shadow-lg shadow-orange-900/10'
              : 'bg-[#171718] border-gray-800 hover:border-gray-700 hover:bg-[#1f1f20]'
            }`}
          onClick={() => {
            setSelectedOption('delivery');
            // Si no hay dirección seleccionada, abrir modal para elegir/crear una
            if (!selectedAddressId) setShowModal(true);
          }}
        >
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${selectedOption === 'delivery' ? 'bg-orange-400 text-white' : 'bg-gray-800 text-gray-400'}`}>
                  <Truck size={20} />
                </div>
                <h3 className={`font-bold text-lg ${selectedOption === 'delivery' ? 'text-orange-400' : 'text-gray-200'}`}>
                  Enviar a domicilio
                </h3>
              </div>

              {selectedAddress ? (
                <div className="ml-1 pl-4 border-l-2 border-gray-800 mt-4 space-y-1">
                  <p className="text-gray-200 font-medium">
                    {selectedAddress.street}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {selectedAddress.city}, {selectedAddress.state} - CP {selectedAddress.zip}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-2 mt-2">
                    <span className="flex items-center gap-1"><MapPin size={14} /> {selectedAddress.firstName} {selectedAddress.lastName}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                    <span className="flex items-center gap-1"><Phone size={14} /> {selectedAddress.phone}</span>
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 mt-2 text-sm ml-12">No hay dirección seleccionada.</p>
              )}

              <button
                onClick={(e) => { e.stopPropagation(); setShowModal(true); }}
                className="text-primary text-sm mt-4 font-medium hover:underline flex items-center gap-1 ml-1"
              >
                <Edit size={14} />
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
            {/* <p className="font-semibold text-gray-500 text-sm bg-gray-800/50 px-3 py-1 rounded">~$7500</p> */}
          </div>
        </div>

        {/* Opcion Retiro x Local */}
        <div
          className={`rounded-xl p-6 transition-all cursor-pointer border ${selectedOption === 'pickup'
              ? 'bg-orange-500/5 border-orange-500 ring-1 ring-orange-500/20 shadow-lg shadow-orange-900/10'
              : 'bg-[#171718] border-gray-800 hover:border-gray-700 hover:bg-[#1f1f20]'
            }`}
          onClick={() => setSelectedOption('pickup')}
        >
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${selectedOption === 'pickup' ? 'bg-orange-400 text-white' : 'bg-gray-800 text-gray-400'}`}>
                  <Store size={20} />
                </div>
                <h3 className={`font-bold text-lg ${selectedOption === 'pickup' ? 'text-orange-400' : 'text-gray-200'}`}>
                  Retirar en Local
                </h3>
              </div>

              <div className="ml-1 pl-4 border-l-2 border-gray-800 mt-4 space-y-1">
                <p className="text-gray-200 font-medium">
                  Av. La Plata 1234 - Buenos Aires
                </p>
                <p className="text-sm text-gray-500">
                  Lu a Vi: 9 a 18 hs. Sá: 10 a 14 hs.
                </p>
              </div>
            </div>

            <span className="font-bold text-green-500 text-sm bg-green-500/10 border border-green-500/20 px-3 py-1 rounded">Gratis</span>

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
        className="w-full max-w-2xl py-4 btn-primary rounded-xl font-bold transition-all shadow-lg shadow-orange-900/20 flex justify-center items-center gap-2"
        onClick={handleContinue}
      >
        Continuar Compra
        <ArrowRight size={20} />
      </button>
    </div>
  );
};
