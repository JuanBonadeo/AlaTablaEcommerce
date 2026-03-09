"use client";

import { useEffect, useState } from "react"
import { createOrderAction } from "@/lib/actions/order/order.actions"
import { useAddressStore } from "@/lib/store/address-store"
import { useCartStore } from "@/lib/store/cart-stores"
import { currencyFormat } from "@/lib/helpers/currencyFormat"
import clsx from "clsx"
import { PlaceOrderSkeleton } from "@/components/ui/skeletons/PlaceOrderSkeleton";
import { getAddressByIdAction } from "@/lib/actions/address/address.actions";
import { Address } from "@/lib/types/address.types";
import { ShippingQuoteResponse } from "@/lib/types/shipping.types";
import { calculatePrice } from "@/lib/utils/pricing";

export const PlaceOrder = () => {
    const [loaded, setLoaded] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [address, setAddress] = useState<Address | null>(null);


    const addressId = useAddressStore(state => state.addressId)
    const { itemsIn, subTotal, total } = useCartStore(state => state.getSummaryInfo())
    const cart = useCartStore(state => state.cart)
    const clearCart = useCartStore(state => state.clearCart)
    const shippingQuote = useCartStore(state => state.getShippingQuote())
    const setShippingQuote = useCartStore(state => state.setShippingQuote)
    const clearShippingQuote = useCartStore(state => state.clearShippingQuote)

    const [shippingOptions, setShippingOptions] = useState<ShippingQuoteResponse[]>([])
    const [isLoadingShipping, setIsLoadingShipping] = useState(false)

    useEffect(() => {
        const loadAddress = async () => {
            setLoaded(true);
            setErrorMessage('');

            if (addressId) {
                try {
                    const addr = await getAddressByIdAction(addressId);
                    setAddress(addr);

                    // Cargar opciones de envío para esta dirección
                    if (addr?.zip) {
                        loadShippingOptions(addr.zip, addr.city);
                    }
                } catch (error) {
                    console.error('Error cargando dirección:', error);
                    setErrorMessage('No se pudo cargar la dirección seleccionada');
                }
            } else {
                // Si la dirección es null (Retiro en tienda), limpiamos envíos
                clearShippingQuote();
                setShippingOptions([]);
            }
        };

        loadAddress();
    }, [addressId])

    const loadShippingOptions = async (zip: string, city: string) => {
        try {
            setIsLoadingShipping(true);
            const response = await fetch('/api/shipping/quote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ zip, city }),
            });

            const data = await response.json();
            if (data.success && Array.isArray(data.data)) {
                setShippingOptions(data.data);
                // Seleccionar automáticamente la primera opción
                if (data.data.length > 0 && !shippingQuote) {
                    setShippingQuote(data.data[0]);
                }
            }
        } catch (error) {
            console.error('Error cargando opciones de envío:', error);
        } finally {
            setIsLoadingShipping(false);
        }
    }

    const onPlaceOrder = async () => {
        if (isPlacingOrder) return;

        setIsPlacingOrder(true);
        setErrorMessage('');

        try {
            const productsToOrder = cart.map(product => {
                const priceInfo = calculatePrice(product.price, product.offer);
                return {
                    productId: product.productId,
                    quantity: product.quantity,
                    price: priceInfo.finalPrice,
                    variantId: product.variantId,
                };
            });

            // Crear la orden con información de envío
            const resp = await createOrderAction({
                items: productsToOrder,
                addressId: addressId || undefined,
                total: total,
                userId: '', // Será seteado por el servidor desde la sesión
                shipping: shippingQuote ? {
                    carrier: shippingQuote.carrier,
                    service: shippingQuote.service,
                    serviceName: shippingQuote.serviceName,
                    cost: shippingQuote.cost,
                    estimatedDays: shippingQuote.estimatedDays,
                } : undefined,
            });

            if (!resp.success) {
                setErrorMessage(resp.message || 'Error al crear la orden');
                setIsPlacingOrder(false);
                return;
            }

            // Crear preferencia de pago en Mercado Pago
            const preferenceResponse = await fetch('/api/mercadopago/create-preference', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: resp.data?.id }),
            });

            const preferenceData = await preferenceResponse.json();

            if (!preferenceData.success) {
                setErrorMessage(preferenceData.message || 'Error al crear preferencia de pago');
                setIsPlacingOrder(false);
                return;
            }

            // Limpiar carrito antes de redirigir
            clearCart();

            // Redirigir a Mercado Pago para el pago
            // En pruebas usa sandbox_init_point, en producción usa init_point
            const paymentUrl = preferenceData.data.sandbox_init_point || preferenceData.data.init_point;
            window.location.href = paymentUrl;

        } catch (error) {
            console.error('Error al crear la orden:', error);
            setErrorMessage('Ocurrió un error al procesar tu pedido. Por favor intenta de nuevo.');
            setIsPlacingOrder(false);
        }
    }

    if (!loaded) {
        return <PlaceOrderSkeleton />
    }

    return (
        <div className="bg rounded-lg shadow-sm border border-gray-700 p-6">
            {/* Dirección */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Dirección de entrega</h2>
                {address ? (
                    <div className="text-sm text-gray-300 space-y-1">
                        <p className="font-medium text-gray-200">
                            {address.firstName} {address.lastName}
                        </p>
                        <p>{address.street}</p>
                        <p>
                            {address.city}, {address.state} - CP: {address.zip}
                        </p>
                        <p>Tel: {address.phone}</p>
                    </div>
                ) : addressId ? (
                    <p className="text-sm text-gray-400">Cargando dirección...</p>
                ) : (
                    <p className="text-sm text-gray-400">Retiro en tienda</p>
                )}
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-gray-700 mb-8" />

            {/* Opciones de Envío */}
            {address && (
                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4">Opciones de envío</h2>
                    {isLoadingShipping ? (
                        <p className="text-gray-400 text-sm">Cargando opciones de envío...</p>
                    ) : shippingOptions.length > 0 ? (
                        <div className="space-y-2">
                            {shippingOptions.map((option, idx) => (
                                <div
                                    key={idx}
                                    className={clsx(
                                        'p-3 rounded-lg border cursor-pointer transition-all',
                                        shippingQuote?.service === option.service
                                            ? 'bg-blue-500/20 border-blue-500 text-white'
                                            : 'bg-gray-800 border-gray-700 hover:border-blue-400'
                                    )}
                                    onClick={() => setShippingQuote(option)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">{option.serviceName}</p>
                                            <p className="text-xs text-gray-400">
                                                Llega en {option.estimatedDays} {option.estimatedDays === 1 ? 'día' : 'días'}
                                            </p>
                                        </div>
                                        <p className="text-green-400 font-bold">{currencyFormat(option.cost)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm">No hay opciones de envío disponibles para esta dirección</p>
                    )}
                </div>
            )}

            {/* Divider */}
            <div className="w-full h-px bg-gray-700 mb-8" />

            {/* Resumen de orden */}
            <div className="mb-8">
                <h2 className="text-xl font-bold mb-6">Resumen de orden</h2>

                <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-400">Nro. Productos:</span>
                        <span className="text-gray-200 font-medium">
                            {itemsIn === 1 ? '1 artículo' : `${itemsIn} artículos`}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-400">Subtotal:</span>
                        <span className="text-gray-200 font-medium">{currencyFormat(subTotal)}</span>
                    </div>

                    {/* Mostrar información de envío */}
                    {shippingQuote ? (
                        <>
                            <div className="flex justify-between text-blue-400">
                                <span>Envío:</span>
                                <span className="font-medium">{currencyFormat(shippingQuote.cost)}</span>
                            </div>
                            <div className="text-xs text-gray-500 bg-gray-800 rounded px-3 py-2 col-span-2">
                                {shippingQuote.serviceName} • Llega en {shippingQuote.estimatedDays} {shippingQuote.estimatedDays === 1 ? 'día' : 'días'}
                            </div>
                        </>
                    ) : (
                        <div className="flex justify-between text-gray-500">
                            <span>Envío:</span>
                            <span>No calculado</span>
                        </div>
                    )}

                    <div className="w-full h-px bg-gray-700 my-3" />

                    <div className="flex justify-between text-xl font-bold">
                        <span className="text-gray-200">Total:</span>
                        <span className="text-blue-400">{currencyFormat(total)}</span>
                    </div>
                </div>
            </div>

            {/* Terms and error */}
            <div className="mb-6">
                <p className="mb-4 text-xs text-gray-500">
                    Al hacer clic en Colocar orden, aceptas nuestros{' '}
                    <a href="#" className="text-blue-400 underline hover:text-blue-300">
                        términos y condiciones
                    </a>{' '}
                    y{' '}
                    <a href="#" className="text-blue-400 underline hover:text-blue-300">
                        política de privacidad
                    </a>
                </p>

                {errorMessage && (
                    <p className="text-red-400 text-sm mb-4">{errorMessage}</p>
                )}
            </div>

            {/* Button */}
            <button
                onClick={onPlaceOrder}
                disabled={isPlacingOrder}
                className={clsx(
                    'w-full px-6 py-3 rounded-lg font-semibold transition-all',
                    {
                        'bg-blue-600 text-white hover:bg-blue-700 active:scale-95': !isPlacingOrder,
                        'bg-gray-600 text-gray-400 cursor-not-allowed': isPlacingOrder,
                    }
                )}
            >
                {isPlacingOrder ? 'Procesando...' : 'Pagar con Mercado Pago'}
            </button>

            <p className="text-xs text-gray-500 text-center mt-3">
                Serás redirigido a Mercado Pago para completar tu pago de forma segura
            </p>
        </div>
    )
}
