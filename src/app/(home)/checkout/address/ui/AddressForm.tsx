'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createAddressAction } from '@/lib/actions/address/address.actions';
import { AnimatePresence, motion } from 'framer-motion';
import type { Address } from '@/lib/types/address.types';
import { Plus } from 'lucide-react';

interface Props {
  userId: string;
  onSuccess: (address?: Address) => void;
  onCancel?: () => void;
}

interface FormInputs {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  isDefault?: boolean;
}

export const AddressForm = ({ userId, onSuccess, onCancel, }: Props) => {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isValid },
  } = useForm<FormInputs>({
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      phone: '',
      isDefault: false,
    },
  });

  const onSubmit = async (data: FormInputs) => {
    setSubmitting(true);
    setErrorMsg(null);
    try {
      // createAddressAction returns { ok: boolean }
      const res = await createAddressAction({ ...data, isDefault: !!data.isDefault, userId });
      if (!res || !res.ok) {
        const msg = res?.message || 'Error al crear la dirección';
        setErrorMsg(msg + (res?.details ? `: ${res.details}` : ''));
        return;
      }

      // success - pass created address to parent so it can update the list and select it
      const createdAddress: Address | undefined = res.address;

      reset();
      setOpen(false);
      onSuccess(createdAddress);
    } catch (err) {
      console.error('Error creating address', err);
      setErrorMsg(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setSubmitting(false);
    }
  };


  const inputClass =
    'mt-1 appearance-none relative block w-full px-4 py-3 bg-[#0a0a0a] border border-gray-800 placeholder-gray-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 sm:text-sm transition-all';
  const labelClass = 'block text-xs font-semibold text-gray-400 mb-1 ml-1';

  return (
    <>
      {!open ? (
        <button
          type="button"
          className="text-sm font-medium text-orange-400 hover:text-orange-400 transition-colors flex items-center gap-1"
          onClick={() => {
            setOpen(true);
          }}
          aria-expanded={open}
        >
          <Plus size={16} />
          Nueva dirección
        </button>)
        : (
          <AnimatePresence>
            <div
              className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
            >
              <motion.div
                className="bg-[#171718] border border-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl p-6 relative"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
              >
                <h3 className="text-xl font-bold text-white mb-6">Agregar nueva dirección</h3>

                <form id="addressForm" onSubmit={handleSubmit(onSubmit)} className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {errorMsg && (
                    <div className="col-span-1 sm:col-span-2 bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl text-sm" role="alert" aria-live="assertive">
                      {errorMsg}
                    </div>
                  )}
                  <div className="flex flex-col text-left">
                    <label htmlFor="firstName" className={labelClass}>Nombre</label>
                    <input id="firstName" {...register('firstName', { required: 'El nombre es obligatorio' })} placeholder="Ej: Juan" aria-invalid={errors.firstName ? 'true' : 'false'} className={inputClass} />
                    {errors.firstName && <span className="text-xs text-red-500 mt-1 ml-1">{errors.firstName.message}</span>}
                  </div>

                  <div className="flex flex-col text-left">
                    <label htmlFor="lastName" className={labelClass}>Apellido</label>
                    <input id="lastName" {...register('lastName', { required: 'El apellido es obligatorio' })} placeholder="Ej: Pérez" aria-invalid={errors.lastName ? 'true' : 'false'} className={inputClass} />
                    {errors.lastName && <span className="text-xs text-red-500 mt-1 ml-1">{errors.lastName.message}</span>}
                  </div>

                  <div className="col-span-1 sm:col-span-2 flex flex-col text-left">
                    <label htmlFor="street" className={labelClass}>Calle y número</label>
                    <input id="street" {...register('street', { required: 'La calle y número son obligatorios' })} placeholder="Ej: Av. Libertador 1234, 5to A" aria-invalid={errors.street ? 'true' : 'false'} className={inputClass} />
                    {errors.street && <span className="text-xs text-red-500 mt-1 ml-1">{errors.street.message}</span>}
                  </div>

                  <div className="flex flex-col text-left">
                    <label htmlFor="city" className={labelClass}>Ciudad</label>
                    <input id="city" {...register('city', { required: 'La ciudad es obligatoria' })} placeholder="Ej: Ciudad Autónoma de Buenos Aires" aria-invalid={errors.city ? 'true' : 'false'} className={inputClass} />
                    {errors.city && <span className="text-xs text-red-500 mt-1 ml-1">{errors.city.message}</span>}
                  </div>

                  <div className="flex flex-col text-left">
                    <label htmlFor="state" className={labelClass}>Provincia</label>
                    <input id="state" {...register('state', { required: 'La provincia es obligatoria' })} placeholder="Ej: Buenos Aires" aria-invalid={errors.state ? 'true' : 'false'} className={inputClass} />
                    {errors.state && <span className="text-xs text-red-500 mt-1 ml-1">{errors.state.message}</span>}
                  </div>

                  <div className="flex flex-col text-left">
                    <label htmlFor="zip" className={labelClass}>Código Postal</label>
                    <input id="zip" {...register('zip', { required: 'El código postal es obligatorio' })} placeholder="Ej: 1425" aria-invalid={errors.zip ? 'true' : 'false'} className={inputClass} />
                    {errors.zip && <span className="text-xs text-red-500 mt-1 ml-1">{errors.zip.message}</span>}
                  </div>

                  <div className="flex flex-col text-left">
                    <label htmlFor="phone" className={labelClass}>Teléfono</label>
                    <input id="phone" {...register('phone', { required: 'El teléfono es obligatorio' })} placeholder="Ej: 11 1234 5678" aria-invalid={errors.phone ? 'true' : 'false'} className={inputClass} />
                    {errors.phone && <span className="text-xs text-red-500 mt-1 ml-1">{errors.phone.message}</span>}
                  </div>

                  <div className="col-span-1 sm:col-span-2 flex items-center gap-3 mt-2 mb-2">
                    <input id="isDefault" type="checkbox" {...register('isDefault')} className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 bg-gray-800 border-gray-600" />
                    <label htmlFor="isDefault" className="text-sm text-gray-300">Usar como dirección principal</label>
                  </div>

                  <div className="col-span-1 sm:col-span-2 mt-4 pt-4 border-t border-gray-800">
                    <div className="flex items-center gap-3">
                      <button
                        type="submit"
                        disabled={!isValid || submitting}
                        className="flex-1 py-3 px-4 bg-orange-400 hover:bg-orange-500 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitting ? 'Guardando...' : 'Guardar dirección'}
                      </button>

                      {onCancel && (
                        <button
                          type="button"
                          onClick={() => {
                            setOpen(false);
                            onCancel();
                          }}
                          className="px-6 py-3 border border-gray-700 hover:bg-gray-800 text-gray-300 rounded-xl transition-all font-medium"
                        >
                          Cancelar
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </motion.div>
            </div>
          </AnimatePresence>)}
    </>


  );
};
