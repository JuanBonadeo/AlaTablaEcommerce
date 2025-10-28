'use client';

import { useEffect, useState } from 'react';
import { AddressModal } from './AddressModal';
import { deleteAddressAction, getMyAddressesAction, updateAddressAction } from '@/lib/actions/address/address.actions';
import { Address } from '@/lib/types/address.types';
import { authClient } from '@/lib/auth/auth-client';
import { useRouter } from 'next/navigation';
import { useAddressStore } from '@/lib/store/address-store';




export const AddressClient = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id || '';
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(selectedAddress?.id || null);
  const [selectedOption, setSelectedOption] = useState<'delivery' | 'pickup'>('delivery');

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
    if (selectedOption === 'delivery' && !selectedAddressId) {
      alert('Seleccioná una dirección de envío.');
      return;
    }
    setAddressId(selectedAddressId || null);
    router.push('/checkout/payment');
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
          className={`rounded-xl p-5 mb-4 transition bg ${selectedOption === 'delivery' ? 'ring-2 ring-orange-400' : ''}`}
          onClick={() => {
            setSelectedOption('delivery');
            // Si no hay dirección seleccionada, abrir modal para elegir/crear una
            if (!selectedAddressId) setShowModal(true);
          }}
        >
          <div className="flex justify-between items-start ">
            <div >
              <h3 className="font-semibold text-lg">Enviar a domicilio</h3>
              {selectedAddress ? (
                <>
                  <p className="text-gray-700 mt-1">
                    {selectedAddress.street} - {selectedAddress.city}, {selectedAddress.state} - CP {selectedAddress.zip}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedAddress.firstName} {selectedAddress.lastName} • {selectedAddress.phone}
                  </p>
                </>
              ) : (
                <p className="text-gray-500 mt-2">No hay dirección seleccionada.</p>
              )}

              <button
                onClick={(e) => { e.stopPropagation(); setShowModal(true); }}
                className="text-primary text-sm mt-3 hover:underline"
              >
                Modificar domicilio o elegir otro
              </button>
              <input
                type="radio"
                name="address"
                className="sr-only"
                checked={selectedOption === 'delivery'}
                onChange={() => setSelectedOption('delivery')}
              />
            </div>
            <p className="font-semibold text-gray-500">$7500 aprox</p>
          </div>
        </div>

        {/* Opcion Retiro x Local */}
        <div
          className={` rounded-xl p-5 transition bg ${selectedOption === 'pickup' ? 'ring-2 ring-orange-400' : ''}`}
          onClick={() => setSelectedOption('pickup')}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">Retirar en Local</h3>
              <p className="text-gray-700 mt-1">
                Av. La Plata 1234 - Buenos Aires
              </p>
              <p className="text-sm text-gray-500">
                Lu a Vi: 9 a 18 hs. Sá: 10 a 14 hs.
              </p>
              <button className="text-primary text-sm mt-3 hover:underline">
                Ver punto en el mapa
              </button>
            </div>
            <p className="font-semibold text-gray-500">$0</p>
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



      <button className="btn-primary w-3xs" onClick={handleContinue}>
        Continuar Compra
      </button>
    </div>
  );
};
