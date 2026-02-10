import { cuidIdSchema } from "@/lib/types/shared.types";
import { ErrorHandler, NotFoundError } from "../shared/errorHandler";
import { ResponseHandler } from "../shared/responseHandler";
import { CategoriesDAO } from "./categories.dao";
import { CategoryDTO } from "@/lib/types/categories.types";


export const CategoryService = {
    getAll: async () => {
        try {
            const categories = await CategoriesDAO.getAll();
            return ResponseHandler.success(categories);
        } catch (error) {
            return ErrorHandler.format(error);
        }
    },

    getById: async (id: string) => {
        try {
            const category = await CategoriesDAO.getById(id);
            if (!category) {
                throw new NotFoundError();
            }
            return ResponseHandler.success(category);
        } catch (error) {
            throw ErrorHandler.format(error);
        }
    },

    create: async (name: string) => {
        try {
            const newCategory = CategoryDTO.parse({ name });
            const result = await CategoriesDAO.create(newCategory.name);
            return ResponseHandler.created(result);
        } catch (error) {
            return ErrorHandler.format(error);
        }
    },

    update: async (id: string, name: string) => {
        try {
            cuidIdSchema.parse(id);
            const updatedCategory = CategoryDTO.parse({ name });
            const result = await CategoriesDAO.update(id, updatedCategory.name.trim());
            return ResponseHandler.updated(result);
        } catch (error) {
            return ErrorHandler.format(error);
        }
    },

    delete: async (id: string) => {
        try {
            cuidIdSchema.parse(id);
            
            // Verificar si la categoría existe y tiene productos
            const category = await CategoriesDAO.getById(id);
            if (!category) {
                throw new NotFoundError("Categoría no encontrada");
            }
            
            // @ts-expect-error - products existe en la consulta getById
            if (category.products && category.products.length > 0) {
                return ResponseHandler.error(
                    "No se puede eliminar la categoría porque tiene productos asociados",
                    400
                );
            }
            
            await CategoriesDAO.delete(id);
            return ResponseHandler.deleted();
        } catch (error) {
            return ErrorHandler.format(error);
        }
    },

}
