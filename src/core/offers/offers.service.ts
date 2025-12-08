import { CreateOfferInput, CreateOfferSchema, UpdateOfferInput, UpdateOfferSchema } from "@/lib/types/offer.types";
import { OfferDAO } from "./offers.dao";
import { ErrorHandler, NotFoundError } from "../shared/errorHandler";
import { ResponseHandler } from "../shared/responseHandler";

export const OfferService = {
  create: async (data: CreateOfferInput) => {
    try {
      const validatedData = CreateOfferSchema.parse(data);
      const offer = await OfferDAO.create(validatedData);
      return ResponseHandler.created(offer);
    } catch (error) {
      return ErrorHandler.format(error);
    }
  },

  getById: async (id: string) => {
    try {
      const offer = await OfferDAO.getById(id);
      if (!offer) throw new NotFoundError("Oferta no encontrada");
      return ResponseHandler.success(offer);
    } catch (error) {
      return ErrorHandler.format(error);
    }
  },

  getAll: async () => {
    try {
      const offers = await OfferDAO.getAll();
      return ResponseHandler.success(offers);
    } catch (error) {
      return ErrorHandler.format(error);
    }
  },

  getByProductId: async (productId: string) => {
    try {
      const offer = await OfferDAO.getByProductId(productId);
      return ResponseHandler.success(offer);
    } catch (error) {
      return ErrorHandler.format(error);
    }
  },

  getActiveOffers: async () => {
    try {
      const offers = await OfferDAO.getActiveOffers();
      return ResponseHandler.success(offers);
    } catch (error) {
      return ErrorHandler.format(error);
    }
  },

  update: async (id: string, data: UpdateOfferInput) => {
    try {
      const validatedData = UpdateOfferSchema.parse(data);
      
      const existing = await OfferDAO.getById(id);
      if (!existing) throw new NotFoundError("Oferta no encontrada");

      const offer = await OfferDAO.update(id, validatedData);
      return ResponseHandler.updated(offer);
    } catch (error) {
      return ErrorHandler.format(error);
    }
  },

  delete: async (id: string) => {
    try {
      const existing = await OfferDAO.getById(id);
      if (!existing) throw new NotFoundError("Oferta no encontrada");

      await OfferDAO.delete(id);
      return ResponseHandler.deleted();
    } catch (error) {
      return ErrorHandler.format(error);
    }
  },
};

