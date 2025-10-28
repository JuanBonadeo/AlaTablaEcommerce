'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createAddressAction } from '@/lib/actions/address/address.actions';
import { AnimatePresence, motion } from 'framer-motion';
import type { Address } from '@/lib/types/address.types';

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
      const res: any = await createAddressAction({ ...data, isDefault: !!data.isDefault, userId });
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
      setErrorMsg((err as any)?.message || 'Error inesperado');
    } finally {
      setSubmitting(false);
    }
  };


  const inputClass =
    'mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm';

  return (
    <>
      {!open ? (
        <button
          type="button"
          className="text-sm text-primary hover:underline"
          onClick={() => {
            setOpen(true);
          }}
          aria-expanded={open}
        >
          + Nueva dirección
        </button>)
        : (
          <AnimatePresence>
            <div
              className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <motion.div
                className="bg rounded-3xl shadow-xl w-full max-w-2xl p-6 relative"
                initial={{ scale: 0.9, opacity: 0}}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >

                <form id="addressForm" onSubmit={handleSubmit(onSubmit)} className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {errorMsg && (
                    <div className="col-span-1 sm:col-span-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded" role="alert" aria-live="assertive">
                      {errorMsg}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <label htmlFor="firstName" className="label text-left text-white">Nombre</label>
                    <input id="firstName" {...register('firstName', { required: 'El nombre es obligatorio' })} placeholder="Nombre" aria-invalid={errors.firstName ? 'true' : 'false'} className={inputClass} />
                    {errors.firstName && <span className="text-sm text-red-600 text-left mt-1">{errors.firstName.message}</span>}
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="lastName" className="label text-left text-white">Apellido</label>
                    <input id="lastName" {...register('lastName', { required: 'El apellido es obligatorio' })} placeholder="Apellido" aria-invalid={errors.lastName ? 'true' : 'false'} className={inputClass} />
                    {errors.lastName && <span className="text-sm text-red-600 text-left mt-1">{errors.lastName.message}</span>}
                  </div>

                  <div className="col-span-1 sm:col-span-2 flex flex-col">
                    <label htmlFor="street" className="label text-left text-white">Calle y número</label>
                    <input id="street" {...register('street', { required: 'La calle y número son obligatorios' })} placeholder="Calle y número" aria-invalid={errors.street ? 'true' : 'false'} className={inputClass} />
                    {errors.street && <span className="text-sm text-red-600 text-left mt-1">{errors.street.message}</span>}
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="city" className="label text-left text-white">Ciudad</label>
                    <input id="city" {...register('city', { required: 'La ciudad es obligatoria' })} placeholder="Ciudad" aria-invalid={errors.city ? 'true' : 'false'} className={inputClass} />
                    {errors.city && <span className="text-sm text-red-600 text-left mt-1">{errors.city.message}</span>}
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="state" className="label text-left text-white">Provincia</label>
                    <input id="state" {...register('state', { required: 'La provincia es obligatoria' })} placeholder="Provincia" aria-invalid={errors.state ? 'true' : 'false'} className={inputClass} />
                    {errors.state && <span className="text-sm text-red-600 text-left mt-1">{errors.state.message}</span>}
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="zip" className="label text-left text-white">CP</label>
                    <input id="zip" {...register('zip', { required: 'El código postal es obligatorio' })} placeholder="CP" aria-invalid={errors.zip ? 'true' : 'false'} className={inputClass} />
                    {errors.zip && <span className="text-sm text-red-600 text-left mt-1">{errors.zip.message}</span>}
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="phone" className="label text-left text-white">Teléfono</label>
                    <input id="phone" {...register('phone', { required: 'El teléfono es obligatorio' })} placeholder="Teléfono" aria-invalid={errors.phone ? 'true' : 'false'} className={inputClass} />
                    {errors.phone && <span className="text-sm text-red-600 text-left mt-1">{errors.phone.message}</span>}
                  </div>

                  <div className="col-span-1 sm:col-span-2 flex items-center gap-3 mt-1">
                    <input id="isDefault" type="checkbox" {...register('isDefault')} className="w-4 h-4" />
                    <label htmlFor="isDefault" className="text-sm">Usar como dirección principal</label>
                  </div>

                  <div className="col-span-1 sm:col-span-2">
                    <div className="flex items-center gap-3">
                      <button
                        type="submit"
                        disabled={!isValid || submitting}
                        className="btn-primary w-full sm:w-1/2"
                      >
                        {submitting ? 'Guardando...' : 'Guardar'}
                      </button>

                      {onCancel && (
                        <button
                          type="button"
                          onClick={() => {
                            setOpen(false);
                            onCancel();
                          }}
                          className="text-sm text-gray-600 hover:underline"
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
