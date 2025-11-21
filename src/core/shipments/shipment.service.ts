import { ShipmentDAO } from "./shipment.dao";
import { OrderDAO } from "../orders/order.dao";
import {
  CreateShipmentInput,
  CreateShipmentSchema,
  UpdateShipmentInput,
  UpdateShipmentSchema,
  OrderStatus,
} from "@/lib/types/order.types";
import { ErrorHandler, NotFoundError } from "../shared/errorHandler";
import { ResponseHandler } from "../shared/responseHandler";

export const ShipmentService = {
  create: async (data: CreateShipmentInput) => {
    try {
      const validatedData = CreateShipmentSchema.parse(data);
      
      const order = await OrderDAO.getById(validatedData.orderId);
      if (!order) throw new NotFoundError("Orden no encontrada");

      const existingShipment = await ShipmentDAO.getByOrderId(validatedData.orderId);
      if (existingShipment) {
        throw new Error("Ya existe un envío para esta orden");
      }

      const shipment = await ShipmentDAO.create(validatedData);
      return ResponseHandler.created(shipment);
    } catch (error) {
      return ErrorHandler.format(error);
    }
  },

  getById: async (id: string) => {
    try {
      const shipment = await ShipmentDAO.getById(id);
      if (!shipment) throw new NotFoundError("Envío no encontrado");
      return ResponseHandler.success(shipment);
    } catch (error) {
      return ErrorHandler.format(error);
    }
  },

  getByOrderId: async (orderId: string) => {
    try {
      const shipment = await ShipmentDAO.getByOrderId(orderId);
      if (!shipment) throw new NotFoundError("Envío no encontrado");
      return ResponseHandler.success(shipment);
    } catch (error) {
      return ErrorHandler.format(error);
    }
  },

  update: async (id: string, data: UpdateShipmentInput) => {
    try {
      const validatedData = UpdateShipmentSchema.parse(data);
      const shipment = await ShipmentDAO.update(id, validatedData);
      
      if (validatedData.status) {
        const shipmentWithOrder = await ShipmentDAO.getByOrderId(shipment.orderId);
        if (shipmentWithOrder) {
          let orderStatus: OrderStatus | undefined;
          
          switch (validatedData.status) {
            case "SHIPPED":
              orderStatus = OrderStatus.SHIPPED;
              break;
            case "DELIVERED":
              orderStatus = OrderStatus.DELIVERED;
              break;
          }
          
          if (orderStatus) {
            await OrderDAO.update(shipment.orderId, { status: orderStatus });
          }
        }
      }

      return ResponseHandler.updated(shipment);
    } catch (error) {
      return ErrorHandler.format(error);
    }
  },

  list: async (page = 1, limit = 10) => {
    try {
      const result = await ShipmentDAO.list(page, limit);
      return ResponseHandler.success(result);
    } catch (error) {
      return ErrorHandler.format(error);
    }
  },
};
