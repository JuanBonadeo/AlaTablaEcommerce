# Integración con API de Correo Argentino

Esta guía documenta la integración con la API de Correo Argentino para calcular costos de envío en tu e-commerce.

## 📋 Características

- ✅ Cotización de envíos en tiempo real
- ✅ Múltiples opciones de servicio (Clásico, Expreso, Prioritario)
- ✅ Cálculo automático basado en el carrito
- ✅ Tarifas estimadas como fallback cuando la API no está disponible
- ✅ Soporte para valor declarado (seguro)
- ✅ Server Actions y API Routes

## 🚀 Configuración Rápida


### 2. Obtener Credenciales

Para obtener las credenciales de la API de Correo Argentino:

1. Registrate en: https://www.correoargentino.com.ar/empresas
2. Solicita acceso a la API de cotizador
3. Te proporcionarán API_KEY, USERNAME y PASSWORD

**Nota:** Si aún no tienes credenciales, el sistema funcionará usando tarifas estimadas.

## 📁 Estructura de Archivos

```
src/
├── core/
│   └── shipments/
│       ├── correo-argentino.service.ts  # Servicio principal de la API
│       ├── shipment.service.ts          # Servicio de envíos general
│       └── shipment.dao.ts              # Data Access Object
├── app/
│   └── api/
│       └── shipping/
│           ├── quote/route.ts           # Endpoint para cotizaciones
│           └── calculate/route.ts       # Endpoint para cálculo de carrito
├── lib/
│   ├── actions/
│   │   └── shipping/
│   │       └── shipping-actions.ts      # Server Actions
│   └── types/
│       └── shipping.types.ts            # Tipos de TypeScript
└── components/
    └── ui/
        └── ShippingCalculator.tsx       # Componente de ejemplo
```

## 💡 Uso

### Desde un Server Component o Server Action

```typescript
import { calculateCartShipping } from "@/lib/actions/shipping/shipping-actions";

// Calcular envío para el carrito
const result = await calculateCartShipping({
  items: [
    { productId: "prod_123", quantity: 2 },
    { productId: "prod_456", variantId: "var_789", quantity: 1 },
  ],
  destinationZipCode: "1425",
});

if (result.success) {
  console.log("Opciones de envío:", result.data.quotes);
  console.log("Peso total:", result.data.totalWeight, "gramos");
  console.log("Valor total:", result.data.totalValue);
}
```

### Desde un Client Component

```tsx
"use client";

import { ShippingCalculator } from "@/components/ui/ShippingCalculator";

export default function CartPage() {
  const cartItems = [
    { productId: "prod_123", quantity: 2 },
    { productId: "prod_456", quantity: 1 },
  ];

  return (
    <div>
      <h1>Tu Carrito</h1>
      {/* ... items del carrito ... */}
      
      <ShippingCalculator cartItems={cartItems} />
    </div>
  );
}
```

### Usando la API directamente

```typescript
// Obtener cotización específica
const response = await fetch("/api/shipping/quote", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    originZipCode: "1000",
    destinationZipCode: "1425",
    weight: 1500, // gramos
    declaredValue: 50000, // valor en pesos
  }),
});

const data = await response.json();
console.log(data.data); // Array de cotizaciones
```

## 📊 Tipos de Servicio

El sistema soporta tres tipos de envío de Correo Argentino:

| Servicio | Días Estimados | Descripción |
|----------|----------------|-------------|
| **CLASICO** | 7 días | Envío estándar, más económico |
| **EXPRESO** | 3 días | Envío acelerado |
| **PRIORITARIO** | 1 día | Entrega al día siguiente hábil |

## 🔧 Personalización

### Agregar Campo de Peso al Modelo Product

Para mejorar la precisión del cálculo de envíos, puedes agregar un campo `weight` a tu modelo de productos:

```prisma
model Product {
  id          String   @id @default(cuid())
  // ... otros campos ...
  weight      Int?     @default(500) // peso en gramos
}
```

Luego actualiza el cálculo en [shipping-actions.ts](src/lib/actions/shipping/shipping-actions.ts):

```typescript
// Reemplaza esto:
const itemWeight = 500; // peso fijo

// Por esto:
const itemWeight = product.weight || 500; // usa peso del producto o 500g por defecto
```

### Modificar Tarifas Estimadas

Si la API no está disponible, se usan tarifas estimadas. Puedes modificarlas en [correo-argentino.service.ts](src/core/shipments/correo-argentino.service.ts):

```typescript
const baseRatePerKg = 1500; // $1500 por kg
```

## 🧪 Testing

### Verificar disponibilidad de la API

```typescript
import { checkShippingApiAvailability } from "@/lib/actions/shipping/shipping-actions";

const result = await checkShippingApiAvailability();
console.log(result.data.available); // true o false
```

### Obtener cotización de prueba

```typescript
import { getShippingQuote } from "@/lib/actions/shipping/shipping-actions";

const result = await getShippingQuote({
  originZipCode: "1000",
  destinationZipCode: "1425",
  weight: 1000, // 1kg
});

console.log(result.data); // Array de cotizaciones
```

## 📦 Respuesta de Cotización

Estructura de respuesta de una cotización:

```typescript
{
  carrier: "CORREO_ARGENTINO",
  service: "EXPRESO",
  serviceName: "Correo Argentino Expreso",
  cost: 4500,                    // en pesos
  estimatedDays: 3,              // días hábiles
  additionalInfo?: "Incluye seguro y embalaje"
}
```

## 🔍 Monitoreo y Logs

El servicio incluye logging automático usando Winston. Los logs se guardan en:

- Desarrollo: `logs/app-combined.log`
- Producción: Configurable en [logger.ts](src/core/shared/logger.ts)

## 🚨 Manejo de Errores

El sistema maneja errores automáticamente y devuelve respuestas consistentes:

```typescript
{
  success: false,
  message: "Mensaje de error descriptivo",
  status: 400, // código HTTP
  errors: [...] // detalles adicionales si aplica
}
```

## 📌 Próximos Pasos

- [ ] Integrar el calculador de envío en el checkout
- [ ] Guardar la opción de envío seleccionada en la orden
- [ ] Actualizar el campo `carrier` del modelo Shipment con la opción elegida
- [ ] Implementar generación real de tracking numbers con la API
- [ ] Agregar campo `weight` al modelo Product para mayor precisión

## 🤝 Soporte

Para problemas con la API de Correo Argentino:
- Documentación oficial: https://www.correoargentino.com.ar/api
- Soporte: soporte-api@correoargentino.com.ar
- Teléfono: 0800-XXX-XXXX

## 📝 Notas Adicionales

- Las tarifas estimadas son aproximadas y deben ajustarse según tus necesidades
- El sistema de fallback garantiza que siempre puedas mostrar opciones de envío
- Los códigos postales deben tener al menos 4 dígitos
- El peso se calcula en gramos
- Los precios se manejan en pesos argentinos (ARS)
