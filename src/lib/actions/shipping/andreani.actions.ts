'use server';

import { AndreaniService } from '@/core/shipments/andreani.service';
import { ShipmentService } from '@/core/shipments/shipment.service';
import { OrderDAO } from '@/core/orders/order.dao';
import { revalidatePath } from 'next/cache';
import { logger } from '@/core/shared/logger';

/**
 * Crea un envío con Andreani para una orden
 */
export const createAndreaniShipmentAction = async (orderId: string) => {
    try {
        // Obtener la orden con dirección
        const order = await OrderDAO.getById(orderId);

        if (!order) {
            return {
                ok: false,
                message: 'Orden no encontrada',
            };
        }

        if (!order.address) {
            return {
                ok: false,
                message: 'La orden no tiene dirección de envío',
            };
        }

        // Verificar si la orden ya tiene un envío
        const existingShipment = await ShipmentService.getByOrderId(orderId);
        if (existingShipment.success) {
            return {
                ok: false,
                message: 'Esta orden ya tiene un envío creado',
            };
        }

        // Calcular peso total aproximado (si no hay datos, usar 1kg por defecto)
        const totalWeightGrams = order.items?.reduce((acc, item) => {
            const productWeight = (item.product as any)?.weight || 500; // 500g por defecto
            return acc + (productWeight * item.quantity);
        }, 0) || 1000;

        // Crear envío en Andreani (Pre-envío)
        const tracking = await AndreaniService.createShipment({
            orderId: order.id,
            recipient: {
                name: `${order.address.firstName} ${order.address.lastName}`,
                address: order.address.street,
                city: order.address.city,
                state: order.address.state,
                zip: order.address.zip,
                phone: order.address.phone,
            },
            declaredValue: order.total,
            weightGrams: totalWeightGrams,
        });

        // Crear registro de envío en la base de datos
        const shipmentResult = await ShipmentService.create({
            orderId: order.id,
            carrier: 'ANDREANI',
            tracking,
            cost: 0, // El costo se puede actualizar después si es necesario
        });

        if (!shipmentResult.success) {
            return {
                ok: false,
                message: shipmentResult.message || 'No se pudo crear el registro de envío',
            };
        }

        // Revalidar páginas relevantes
        revalidatePath('/admin/orders');
        revalidatePath(`/admin/orders/${orderId}`);

        logger.info('Envío Andreani creado exitosamente', {
            orderId,
            tracking,
            shipmentId: shipmentResult.data?.id,
        });

        return {
            ok: true,
            tracking,
            shipmentId: shipmentResult.data?.id,
            message: 'Envío creado exitosamente con Andreani',
        };
    } catch (error) {
        logger.error('Error al crear envío con Andreani', {
            orderId,
            error: error instanceof Error ? error.message : String(error),
        });

        return {
            ok: false,
            message: error instanceof Error ? error.message : 'Error al crear el envío',
        };
    }
};

/**
 * Genera la etiqueta PDF para un envío de Andreani
 */
export const generateAndreaniLabelAction = async (tracking: string) => {
    try {
        if (!tracking) {
            return {
                ok: false,
                message: 'Número de tracking requerido',
            };
        }

        // Generar etiqueta (PDF en base64)
        const pdfBase64 = await AndreaniService.generateLabel(tracking);

        if (!pdfBase64) {
            return {
                ok: false,
                message: 'No se pudo generar la etiqueta',
            };
        }

        logger.info('Etiqueta Andreani generada', { tracking });

        return {
            ok: true,
            pdfBase64,
            message: 'Etiqueta generada exitosamente',
        };
    } catch (error) {
        logger.error('Error al generar etiqueta Andreani', {
            tracking,
            error: error instanceof Error ? error.message : String(error),
        });

        return {
            ok: false,
            message: error instanceof Error ? error.message : 'Error al generar la etiqueta',
        };
    }
};

/**
 * Obtiene el estado de un envío de Andreani
 */
export const getAndreaniShipmentStatusAction = async (tracking: string) => {
    try {
        if (!tracking) {
            return {
                ok: false,
                message: 'Número de tracking requerido',
            };
        }

        const status = await AndreaniService.getShipmentStatus(tracking);

        return {
            ok: true,
            status,
            message: 'Estado obtenido exitosamente',
        };
    } catch (error) {
        logger.error('Error al obtener estado de envío Andreani', {
            tracking,
            error: error instanceof Error ? error.message : String(error),
        });

        return {
            ok: false,
            message: error instanceof Error ? error.message : 'Error al obtener el estado',
        };
    }
};
