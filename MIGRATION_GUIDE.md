# Guía de Migración - Campos de Envío

Esta guía te ayudará a actualizar tu base de datos con los nuevos campos para el modelo Shipment.

## Cambios en el Schema

Se agregaron los siguientes campos al modelo `Shipment`:

- `service` (String?, opcional): Tipo de servicio (CLASICO, EXPRESO, PRIORITARIO)
- `serviceName` (String?, opcional): Nombre completo del servicio
- `cost` (Float?, opcional): Costo del envío
- `estimatedDays` (Int?, opcional): Días estimados de entrega
- `createdAt` (DateTime): Fecha de creación
- `updatedAt` (DateTime): Fecha de actualización

## Pasos para Migrar

### 1. Hacer backup de tu base de datos

Antes de cualquier migración, **SIEMPRE** haz un backup:

```bash
# PostgreSQL
pg_dump -U tu_usuario -d tu_base_de_datos > backup_antes_migracion.sql

# O desde Prisma Studio, exporta los datos importantes
npm run studio
```

### 2. Generar y aplicar la migración

```bash
# Generar el cliente de Prisma con los nuevos tipos
npm run generate

# Crear una nueva migración
npx prisma migrate dev --name add_shipping_fields --schema=src/db/schema.prisma

# O si estás en producción
npx prisma migrate deploy --schema=src/db/schema.prisma
```

### 3. Verificar la migración

```bash
# Abrir Prisma Studio para verificar que los campos existen
npm run studio
```

Deberías ver los nuevos campos en la tabla `Shipment`.

## Migración de Datos Existentes (Opcional)

Si ya tienes envíos en tu base de datos y quieres actualizar los valores por defecto:

```sql
-- Actualizar envíos existentes con valores por defecto
UPDATE "Shipment"
SET 
  "cost" = 3000,  -- $3000 por defecto
  "estimatedDays" = 7,  -- 7 días por defecto
  "service" = 'CLASICO',
  "serviceName" = 'Correo Argentino Clásico',
  "createdAt" = COALESCE("shippedAt", NOW()),
  "updatedAt" = NOW()
WHERE "cost" IS NULL;
```

## Problemas Comunes

### Error: "The migration cannot be applied cleanly"

Si recibes este error, tienes dos opciones:

**Opción 1: Reset de la base de datos (solo desarrollo)**
```bash
npx prisma migrate reset --schema=src/db/schema.prisma
npm run seed
```

**Opción 2: Resolver el conflicto manualmente**
```bash
npx prisma migrate resolve --rolled-back <migration_name> --schema=src/db/schema.prisma
npx prisma migrate dev --schema=src/db/schema.prisma
```

### Error: "Database is out of sync"

```bash
# Marcar la base de datos como sincronizada
npx prisma db push --schema=src/db/schema.prisma

# Luego generar el cliente
npm run generate
```

## Verificación Post-Migración

Después de la migración, verifica que todo funciona:

1. **Verificar el schema:**
   ```bash
   npx prisma db pull --schema=src/db/schema.prisma
   ```

2. **Probar la creación de un shipment:**
   ```typescript
   import { prisma } from '@/db/client';

   const shipment = await prisma.shipment.create({
     data: {
       orderId: 'order_id_existente',
       carrier: 'CORREO_ARGENTINO',
       service: 'EXPRESO',
       serviceName: 'Correo Argentino Expreso',
       cost: 4500,
       estimatedDays: 3,
       tracking: 'CA12345678',
       status: 'PENDING',
     },
   });

   console.log('Shipment creado:', shipment);
   ```

3. **Verificar que la API funciona:**
   ```bash
   # En una terminal
   npm run dev

   # En otra terminal o navegador, probar el endpoint
   curl -X POST http://localhost:3000/api/shipping/quote \
     -H "Content-Type: application/json" \
     -d '{
       "originZipCode": "1000",
       "destinationZipCode": "1425",
       "weight": 1000
     }'
   ```

## Rollback (Si algo sale mal)

Si necesitas revertir los cambios:

```bash
# Restaurar el backup
psql -U tu_usuario -d tu_base_de_datos < backup_antes_migracion.sql

# Revertir el schema.prisma a la versión anterior
git checkout HEAD~1 -- src/db/schema.prisma

# Generar el cliente con el schema anterior
npm run generate
```

## Notas Importantes

- ✅ Los nuevos campos son **opcionales** para mantener compatibilidad
- ✅ Los shipments existentes seguirán funcionando sin los nuevos campos
- ✅ Puedes actualizar los shipments existentes gradualmente
- ⚠️ **SIEMPRE** haz backup antes de migrar en producción
- ⚠️ Prueba la migración en un ambiente de staging primero

## Siguiente Paso

Una vez completada la migración, puedes empezar a usar las nuevas funcionalidades:

1. Calcular costos de envío con el componente `ShippingCalculator`
2. Guardar la información completa del envío al crear órdenes
3. Mostrar detalles del envío en el panel de administración

Para más información, consulta [CORREO_ARGENTINO_INTEGRATION.md](../CORREO_ARGENTINO_INTEGRATION.md)
