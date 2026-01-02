# 🔑 Configurar Mercado Pago - Guía Paso a Paso

## ⚠️ Error: Credenciales inválidas

Si estás viendo el error `PA_UNAUTHORIZED_RESULT_FROM_POLICIES`, significa que:
- El Access Token no es válido
- El Access Token es de **producción** pero deberías usar uno de **prueba**
- Falta configurar las variables de entorno

---

## ✅ Solución rápida

### 1. Obtener credenciales de PRUEBA (Sandbox)

1. **Ingresa a tu cuenta** en https://www.mercadopago.com.ar
2. Ve a [Panel de Desarrolladores](https://www.mercadopago.com.ar/developers/panel)
3. En el menú superior, busca **"Credenciales"**
4. Selecciona **"Credenciales de prueba"** (no de producción)

   ![Credenciales de prueba en Mercado Pago](https://imgur.com/xxx.png)

5. Copia el **Access Token** (empieza con `TEST-`)
   - Ejemplo: `TEST-1234567890abcdefghij...`
6. Copia el **Public Key** (también empieza con `TEST-`)
   - Ejemplo: `TEST-abcdefgh123456...`

---

### 2. Configurar el archivo `.env`

En la raíz de tu proyecto, edita o crea el archivo `.env` y reemplaza las credenciales:

```env
MERCADO_PAGO_ACCESS_TOKEN="TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY="TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

**Reemplaza los `x` con tus credenciales reales de PRUEBA.**

---

### 3. Reinicia el servidor

```bash
# Detén el servidor (Ctrl + C)
# Reinicia el servidor
npm run dev
```

---

## 🧪 Probar con tarjetas de prueba

Una vez configurado, prueba con estas tarjetas:

### ✅ Tarjeta APROBADA
- **Número**: `5031755734530604`
- **Expiración**: Cualquiera futura (ej: 11/25)
- **CVV**: `123`
- **Titular**: `APRO`

### ❌ Tarjeta RECHAZADA
- **Número**: `5031755734530604`
- **Expiración**: Cualquiera futura
- **CVV**: `123`
- **Titular**: `OCHO`

**Más tarjetas de prueba**: https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/additional-content/test-cards

---

## 🔄 Para pasar a PRODUCCIÓN

Una vez que todo funcione con credenciales de prueba:

1. Ve a https://www.mercadopago.com.ar/developers/panel
2. Selecciona **"Credenciales de producción"**
3. Copia el **Access Token** (empieza con `APP_USR-`)
4. Copia el **Public Key** (empieza con `APP_USR-`)
5. Actualiza tu `.env`:

```env
MERCADO_PAGO_ACCESS_TOKEN="APP_USR-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY="APP_USR-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

6. Reinicia el servidor

---

## 📋 Checklist de verificación

- [ ] Accedí a https://www.mercadopago.com.ar/developers/panel
- [ ] Seleccioné **Credenciales de PRUEBA**
- [ ] Copié el Access Token (empieza con `TEST-`)
- [ ] Copié el Public Key (empieza con `TEST-`)
- [ ] Actualicé el archivo `.env` correctamente
- [ ] Reinicié el servidor
- [ ] Probé con la tarjeta `5031755734530604` / `APRO`

---

## 🆘 Si aún no funciona

### Verifica que:

1. **Las variables de entorno están en `.env`** (no en `.env.example`)
   ```bash
   # Esto debería mostrar tu token
   echo $MERCADO_PAGO_ACCESS_TOKEN
   ```

2. **El token empieza con `TEST-`** (para prueba) o `APP_USR-` (para producción)

3. **No hay espacios extras** en el token

4. **Reiniciaste el servidor** después de cambiar `.env`

5. **Estás usando credenciales de PRUEBA** (no producción)

---

## 💡 Diferencia entre PRUEBA y PRODUCCIÓN

| Aspecto | PRUEBA (Sandbox) | PRODUCCIÓN |
|--------|-----------------|-----------|
| **Prefijo del token** | `TEST-` | `APP_USR-` |
| **Dinero real** | ❌ No | ✅ Sí |
| **Tarjetas simuladas** | ✅ Sí | ❌ No |
| **Para desarrollo** | ✅ Sí | ❌ No |
| **Para clientes reales** | ❌ No | ✅ Sí |

---

## 📞 Soporte

Si tienes problemas:
1. Verifica que el token sea de **PRUEBA** (`TEST-...`)
2. Revisa los logs del servidor: `npm run dev`
3. Contacta a soporte de Mercado Pago

---

**¡Listo! Con esto deberías poder integrar Mercado Pago en tu ecommerce.** 🚀
