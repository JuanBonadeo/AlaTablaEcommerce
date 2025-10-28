"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AddressForm } from './AddressForm';
import type { Address } from '@/lib/types/address.types';
import { Trash2Icon, X } from 'lucide-react';

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
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg rounded-2xl shadow-xl w-full max-w-2xl p-6 relative"
          initial={{ scale: 0.9, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 40 }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-4  hover:scale-110 transition-all"
          >
            <X className='h-7 w-7 text-primary cursor-pointer' />
          </button>

          <h2 className="text-xl font-semibold mb-4">Elegí una dirección de envío</h2>

          {addresses.length === 0 || showOnlyForm ? (
            <div className="text-center text-gray-500 my-6">
              {addresses.length === 0 ? 'No tenés direcciones guardadas.' : null}
              <AddressForm
                userId={userId}
                onSuccess={onSucces}
                onCancel={() => setShowOnlyForm(false)}
              />
            </div>
          ) : (
            <>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {addresses.map((a) => (
                  <label
                    key={a.id}
                    className={`flex items-start justify-between border rounded-lg p-3 cursor-pointer transition ${
                      selected?.id === a.id ? 'border-orange-500 bg-stone-900' : 'hover:bg-gray-400'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="address"
                        className="sr-only"
                        checked={selected?.id === a.id}
                        onChange={() => onSelect(a)}
                      />

                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                          selected?.id === a.id ? 'bg-orange-500 border-orange-500' : 'bg-white border-gray-300'
                        }`}
                        aria-hidden
                      >
                        {selected?.id === a.id && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>

                      <div>
                        <p className="font-medium text-gray-800">
                          {a.firstName} {a.lastName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {a.street} - {a.city}, {a.state} ({a.zip})
                        </p>
                        <p className="text-xs text-gray-500">{a.phone}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {a.isDefault ? (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">Predeterminada</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onSetDefault?.(a.id)}
                          className="text-sm text-primary hover:underline"
                        >
                          Hacer predeterminada
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onDelete(a.id)}
                        className="text-sm text-red-500 cursor-pointer"
                      >
                        <Trash2Icon className="h-5 w-5"/> 
                      </button>
                    </div>
                  </label>
                ))}
              </div>

              <div className="mt-5 border-t pt-4 flex justify-between items-center">
                <AddressForm
                  userId={userId}
                  onSuccess={onSucces}
                  onCancel={() => setShowOnlyForm(false)}
                />
                <button
                  onClick={onClose}
                  className="btn-primary"
                >
                  Confirmar
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
