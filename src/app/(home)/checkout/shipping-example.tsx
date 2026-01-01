// EJEMPLO DE INTEGRACIÓN EN CHECKOUT
// Este archivo muestra cómo integrar el calculador de envío en tu flujo de checkout

"use client";

import { ShippingCalculatorAdvanced } from "@/components/ui/ShippingCalculatorAdvanced";
import { ShippingQuoteResponse } from "@/lib/types/shipping.types";
import { useState } from "react";

// Este es un ejemplo de cómo podrías usar el calculador en tu página de checkout
export default function CheckoutShippingExample() {
  // Supongamos que tienes el carrito en un estado o store
  const cartItems = [
    { productId: "prod_123", quantity: 2 },
    { productId: "prod_456", variantId: "var_789", quantity: 1 },
  ];

  // Estado para almacenar la opción de envío seleccionada
  const [selectedShipping, setSelectedShipping] = useState<ShippingQuoteResponse | null>(null);
  
  // Supongamos que tienes el código postal del usuario
  const userZipCode = "1425"; // Esto vendría de la dirección del usuario

  // Calcular el total del carrito (esto lo tendrías en tu lógica)
  const cartTotal = 25000;

  // Calcular el total incluyendo envío
  const totalWithShipping = cartTotal + (selectedShipping?.cost || 0);

  const handleShippingSelected = (quote: ShippingQuoteResponse) => {
    console.log("Opción de envío seleccionada:", quote);
    setSelectedShipping(quote);
    
    // Aquí podrías actualizar tu store de Zustand o estado global
    // Por ejemplo:
    // useCartStore.getState().setShippingCost(quote.cost);
    // useCartStore.getState().setShippingService(quote.service);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Checkout - Envío</h1>

      {/* Resumen del carrito */}
      <div className="bg rounded-lg shadow-sm border border-gray-700 p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Resumen del pedido</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-white">Subtotal productos:</span>
            <span className="font-medium">${cartTotal.toLocaleString()}</span>
          </div>
          
          {selectedShipping && (
            <>
              <div className="flex justify-between text-blue-600">
                <span>Envío ({selectedShipping.serviceName}):</span>
                <span className="font-medium">
                  ${selectedShipping.cost.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>Llegada estimada:</span>
                <span>
                  {selectedShipping.estimatedDays}{" "}
                  {selectedShipping.estimatedDays === 1 ? "día" : "días"}
                </span>
              </div>
            </>
          )}

          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>${totalWithShipping.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Calculador de envío */}
      <ShippingCalculatorAdvanced
        cartItems={cartItems}
        defaultZipCode={userZipCode}
        onQuoteSelected={handleShippingSelected}
      />

      {/* Botón de continuar */}
      <div className="mt-8">
        <button
          disabled={!selectedShipping}
          className={`w-full py-4 rounded-lg font-semibold text-lg transition-all ${
            selectedShipping
              ? "bg-green-600 text-white hover:bg-green-700 active:scale-95"
              : "bg-gray-700 text-gray-400 cursor-not-allowed"
          }`}
        >
          {selectedShipping
            ? "Continuar al pago"
            : "Selecciona una opción de envío"}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// INTEGRACIÓN CON ZUSTAND STORE
// ============================================================

/*
Si estás usando Zustand para manejar el estado del carrito, podrías agregar
estas propiedades y métodos a tu store:

// cart-store.ts
import { create } from 'zustand';
import { ShippingQuoteResponse } from '@/lib/types/shipping.types';

interface CartStore {
  // ... tus propiedades existentes
  
  // Propiedades de envío
  shippingQuote: ShippingQuoteResponse | null;
  shippingCost: number;
  
  // Métodos de envío
  setShippingQuote: (quote: ShippingQuoteResponse) => void;
  clearShippingQuote: () => void;
  getTotalWithShipping: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  // ... tu estado existente
  
  shippingQuote: null,
  shippingCost: 0,
  
  setShippingQuote: (quote) => set({
    shippingQuote: quote,
    shippingCost: quote.cost
  }),
  
  clearShippingQuote: () => set({
    shippingQuote: null,
    shippingCost: 0
  }),
  
  getTotalWithShipping: () => {
    const state = get();
    const cartTotal = state.getTotal(); // tu método existente
    return cartTotal + state.shippingCost;
  }
}));

// Luego en tu componente:
const { shippingQuote, setShippingQuote } = useCartStore();

<ShippingCalculatorAdvanced
  cartItems={cartItems}
  onQuoteSelected={(quote) => setShippingQuote(quote)}
/>
*/

// ============================================================
// GUARDAR EN LA ORDEN
// ============================================================

/*
Cuando el usuario confirme la compra, deberás guardar la información
del envío en la orden. Podrías hacer algo como:

async function createOrder() {
  const shippingQuote = useCartStore.getState().shippingQuote;
  
  if (!shippingQuote) {
    alert("Selecciona una opción de envío");
    return;
  }
  
  // Crear la orden con la información de envío
  const orderData = {
    userId: user.id,
    addressId: selectedAddress.id,
    items: cartItems,
    total: getTotalWithShipping(),
    // Información de envío para crear el Shipment
    shipping: {
      carrier: shippingQuote.carrier,
      serviceName: shippingQuote.serviceName,
      cost: shippingQuote.cost,
      estimatedDays: shippingQuote.estimatedDays,
    }
  };
  
  const result = await createOrderAction(orderData);
  // ... manejar respuesta
}
*/
