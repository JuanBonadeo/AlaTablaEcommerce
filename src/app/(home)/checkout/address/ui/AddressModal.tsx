"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AddressForm } from './AddressForm';
import type { Address } from '@/lib/types/address.types';
import { Trash2Icon, X, MapPin, Check } from 'lucide-react';

interface Props {
  addresses: Address[];
  selected: Address | null;
  onSelect: (a: Address) => void;
  onClose: () => void;
  onDelete: (id: string) => void;
  onSetDefault?: (id: string) => void;
  onCreate?: (a: Address) => void;
  userId: string;
}

export const AddressModal = ({ addresses, selected, onSelect, onClose, userId, onDelete, onSetDefault, onCreate }: Props) => {
  const [showOnlyForm, setShowOnlyForm] = useState(false);
  const onSucces = (addr?: Address) => {
    // After successful creation: hide the form and show the list
    setShowOnlyForm(false);
    if (addr && typeof onCreate === 'function') {
      onCreate(addr);
    }
  };
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-[#171718] border border-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 40 }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X className='h-6 w-6' />
          </button>

          <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
            <MapPin className="text-orange-400" size={24} />
            Elegí una dirección de envío
          </h2>

          {addresses.length === 0 || showOnlyForm ? (
            <div className="text-center text-gray-400 my-6">
              {addresses.length === 0 ? <p className="mb-4">No tenés direcciones guardadas.</p> : null}
              <AddressForm
                userId={userId}
                onSuccess={onSucces}
                onCancel={() => setShowOnlyForm(false)}
              />
            </div>
          ) : (
            <>
              <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                {addresses.map((a) => (
                  <label
                    key={a.id}
                    className={`flex items-start justify-between border rounded-xl p-4 cursor-pointer transition-all ${selected?.id === a.id
                      ? 'border-orange-400 bg-orange-400/5 ring-1 ring-orange-400/20'
                      : 'border-gray-800 hover:border-gray-700 hover:bg-gray-800/50'
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <input
                          type="radio"
                          name="address"
                          className="sr-only"
                          checked={selected?.id === a.id}
                          onChange={() => onSelect(a)}
                        />

                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all ${selected?.id === a.id ? 'bg-orange-400 border-orange-400' : 'bg-transparent border-gray-600'
                            }`}
                          aria-hidden
                        >
                          {selected?.id === a.id && (
                            <Check size={12} className="text-white" strokeWidth={3} />
                          )}
                        </div>
                      </div>

                      <div>
                        <p className={`font-medium ${selected?.id === a.id ? 'text-white' : 'text-gray-300'}`}>
                          {a.firstName} {a.lastName}
                        </p>
                        <p className="text-sm text-gray-400 mt-0.5">
                          {a.street} - {a.city}, {a.state} ({a.zip})
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{a.phone}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      {a.isDefault ? (
                        <span className="text-xs bg-orange-400/10 text-orange-400 border border-orange-400/20 px-2 py-0.5 rounded font-medium">Predeterminada</span>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            onSetDefault?.(a.id);
                          }}
                          className="text-xs text-gray-500 hover:text-orange-400 transition-colors"
                        >
                          Hacer predeterminada
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          onDelete(a.id);
                        }}
                        className="text-gray-600 hover:text-red-500 transition-colors p-1"
                        title="Eliminar dirección"
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </button>
                    </div>
                  </label>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                <AddressForm
                  userId={userId}
                  onSuccess={onSucces}
                  onCancel={() => setShowOnlyForm(false)}
                />
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-2 bg-orange-400 hover:bg-orange-500 text-white rounded-lg font-bold transition-colors shadow-lg shadow-orange-900/20"
                >
                  Confirmar selección
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
