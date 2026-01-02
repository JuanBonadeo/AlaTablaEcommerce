# Integración de Mercado Pago

## 📋 Descripción

Este proyecto integra Mercado Pago como método de pago utilizando el flujo de **Preferencias de Pago (Checkout Pro)**. Los usuarios son redirigidos a Mercado Pago para completar el pago de forma segura.

## 🚀 Instalación

El SDK de Mercado Pago ya está instalado:

```bash
npm install mercadopago
```

## 🔑 Configuración

### 1. Variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

#### Para pruebas (recomendado inicialmente):

```env
# Mercado Pago - Credenciales de Prueba
MERCADO_PAGO_ACCESS_TOKEN="TEST-XXXXXXX-XXXXXX-XXXXXX-XXXXXXX"
NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY="TEST-XXXXXXX-XXXXXX-XXXXXX-XXXXXXX"
```

#### Para producción:

```env
# Mercado Pago - Credenciales de Producción
MERCADO_PAGO_ACCESS_TOKEN="APP_USR-b1f0314a-626d-4d79-a294-85bc5f5c9a65"
NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY="APP_USR-XXXXX-XXXXXX"
```

### 2. Obtener credenciales de prueba

1. Ingresa a tu cuenta de Mercado Pago
2. Ve a [Tus integraciones](https://www.mercadopago.com.ar/developers/panel)
3. Selecciona "Credenciales de prueba"
4. Copia el **Access Token** y el **Public Key**
5. Pégalos en tu archivo `.env.local`

### 3. Obtener credenciales de producción

1. Ve a "Credenciales de producción" en el panel de desarrolladores
2. Copia el **Access Token** y el **Public Key**
3. Actualiza tu archivo `.env.local` cuando estés listo para producción

## 📁 Estructura de archivos creados

```
src/
├── core/
│   └── payments/
│       └── mercadopago.service.ts      # Servicio para interactuar con Mercado Pago
├── app/
│   ├── api/
│   │   └── mercadopago/
│   │       ├── create-preference/
│   │       │   └── route.ts            # Endpoint para crear preferencias de pago
│   │       └── webhook/
│   │           └── route.ts            # Webhook para recibir notificaciones
│   └── (home)/
│       └── order/
│           ├── success/
│           │   └── page.tsx            # Página de pago exitoso
│           ├── failure/
│           │   └── page.tsx            # Página de pago rechazado
│           └── pending/
│               └── page.tsx            # Página de pago pendiente
```

## 🔄 Flujo de pago

1. **Usuario completa el checkout**: Selecciona productos, dirección y opciones de envío
2. **Se crea la orden**: El sistema crea una orden en la base de datos
3. **Se crea la preferencia de pago**: Se llama a `/api/mercadopago/create-preference`
4. **Redirección a Mercado Pago**: El usuario es redirigido para completar el pago
5. **Pago completado**: Mercado Pago redirige según el resultado:
   - ✅ `/order/success` - Pago aprobado
   - ❌ `/order/failure` - Pago rechazado
   - ⏳ `/order/pending` - Pago pendiente
6. **Webhook procesa notificación**: Mercado Pago envía notificaciones a `/api/mercadopago/webhook`

## 🧪 Probar con tarjetas de prueba

Para probar pagos en el entorno de pruebas, usa estas tarjetas:

### Tarjeta aprobada
- **Número**: 5031 7557 3453 0604
- **CVV**: 123
- **Fecha**: Cualquier fecha futura
- **Titular**: APRO

### Tarjeta rechazada
- **Número**: 5031 7557 3453 0604
- **CVV**: 123
- **Fecha**: Cualquier fecha futura
- **Titular**: OCHO

Más tarjetas de prueba en: https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/additional-content/test-cards

## 📡 Webhooks (Notificaciones)

### URL del webhook
```
https://tu-dominio.com/api/mercadopago/webhook
```

### Configurar webhook en Mercado Pago

1. Ve a [Tus integraciones](https://www.mercadopago.com.ar/developers/panel)
2. Selecciona tu aplicación
3. Ve a "Webhooks" o "Notificaciones"
4. Agrega la URL: `https://tu-dominio.com/api/mercadopago/webhook`
5. Selecciona los eventos: `payment` (pagos)

### Probar webhook localmente con ngrok

```bash
# Instalar ngrok
npm install -g ngrok

# Exponer puerto 3000
ngrok http 3000

# Usa la URL generada para configurar el webhook
# Ejemplo: https://xxxx-xx-xx-xx-xx.ngrok.io/api/mercadopago/webhook
```

## ⚙️ Personalización

### Cambiar el nombre en el resumen de pago

Edita el `statement_descriptor` en [mercadopago.service.ts](src/core/payments/mercadopago.service.ts):

```typescript
statement_descriptor: 'TU NOMBRE COMERCIAL',
```

### Cambiar las URLs de retorno

Las URLs de retorno se configuran automáticamente en el servicio. Si necesitas cambiarlas, edita:

```typescript
back_urls: {
  success: `${process.env.BETTER_AUTH_URL}/order/success`,
  failure: `${process.env.BETTER_AUTH_URL}/order/failure`,
  pending: `${process.env.BETTER_AUTH_URL}/order/pending`,
}
```

## 🔐 Seguridad

- ✅ El Access Token **nunca** se expone al cliente
- ✅ Solo el Public Key es visible en el frontend (es seguro)
- ✅ Todas las operaciones sensibles se hacen en el servidor
- ✅ Se valida la autenticación del usuario antes de crear preferencias

## 📝 TODO: Implementaciones pendientes

### 1. Completar el webhook

El webhook actual solo registra las notificaciones. Debes implementar:

```typescript
// En src/app/api/mercadopago/webhook/route.ts
// TODO: Consultar el estado del pago usando el SDK
const payment = await mercadopago.payment.get(paymentId);

// TODO: Actualizar el estado de la orden según el resultado
```

### 2. Enviar emails de confirmación

Después de un pago exitoso, enviar email al usuario con los detalles de la orden.

### 3. Agregar más métodos de pago

Si lo deseas, puedes implementar otros métodos de pago además de Mercado Pago.

## 🐛 Debugging

### Ver logs del servidor
```bash
npm run dev
```

### Ver logs de Mercado Pago
Revisa la consola del servidor para ver las respuestas de la API.

### Verificar credenciales
```bash
# Verifica que las variables de entorno estén cargadas
echo $MERCADO_PAGO_ACCESS_TOKEN
```

## 📚 Documentación oficial

- [Mercado Pago - Documentación](https://www.mercadopago.com.ar/developers/es/docs)
- [Checkout Pro](https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/landing)
- [SDK Node.js](https://github.com/mercadopago/sdk-nodejs)
- [Webhooks](https://www.mercadopago.com.ar/developers/es/docs/your-integrations/notifications/webhooks)

## 🆘 Soporte

Si tienes problemas con la integración:

1. Verifica que las credenciales sean correctas
2. Revisa los logs del servidor
3. Consulta la documentación oficial
4. Contacta al soporte de Mercado Pago

---

**¡Listo! Ya puedes comenzar a recibir pagos con Mercado Pago.** 🎉
