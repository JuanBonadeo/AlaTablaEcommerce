import { CreateOfferInput, UpdateOfferInput } from "@/lib/types/offer.types";
import { OfferDAO } from "./offers.dao";

export class OfferService {
  static async create(data: CreateOfferInput) {
    try {
      const offer = await OfferDAO.create(data);
      return {
        success: true,
        data: offer,
        message: "Oferta creada exitosamente",
      };
    } catch (error) {
      console.error("Error creating offer:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error al crear la oferta",
      };
    }
  }

  static async getById(id: string) {
    try {
      const offer = await OfferDAO.getById(id);
      if (!offer) {
        return {
          success: false,
          message: "Oferta no encontrada",
        };
      }
      return {
        success: true,
        data: offer,
      };
    } catch (error) {
      console.error("Error getting offer:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error al obtener la oferta",
      };
    }
  }

  static async getAll() {
    try {
      const offers = await OfferDAO.getAll();
      return {
        success: true,
        data: offers,
      };
    } catch (error) {
      console.error("Error getting offers:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error al obtener las ofertas",
      };
    }
  }

  static async getByProductId(productId: string) {
    try {
      const offer = await OfferDAO.getByProductId(productId);
      return {
        success: true,
        data: offer,
      };
    } catch (error) {
      console.error("Error getting offer by product:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error al obtener la oferta del producto",
      };
    }
  }

  static async getActiveOffers() {
    try {
      const offers = await OfferDAO.getActiveOffers();
      return {
        success: true,
        data: offers,
      };
    } catch (error) {
      console.error("Error getting active offers:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error al obtener las ofertas activas",
      };
    }
  }

  static async update(id: string, data: UpdateOfferInput) {
    try {
      const offer = await OfferDAO.update(id, data);
      return {
        success: true,
        data: offer,
        message: "Oferta actualizada exitosamente",
      };
    } catch (error) {
      console.error("Error updating offer:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error al actualizar la oferta",
      };
    }
  }

  static async delete(id: string) {
    try {
      await OfferDAO.delete(id);
      return {
        success: true,
        message: "Oferta eliminada exitosamente",
      };
    } catch (error) {
      console.error("Error deleting offer:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error al eliminar la oferta",
      };
    }
  }
}
