import { CategoriesDAO } from "./categories.dao";
import { CategoryDTO } from './categories.dtos';

export const CategoryService = {
    getAll: async () => {
        return CategoriesDAO.getAll();
    },

    getById: async (id: string) => {
        const category = await CategoriesDAO.getById(id);
        if (!category) {
            throw new Error("Categoría no encontrada");
        }
        return category;
    },

    create: async (name: string) => {
        const newCategory = CategoryDTO.parse({ name });
        const result = await CategoriesDAO.create(newCategory.name.trim());
        return result;
    },

    update: async (id: string, name: string) => {
        const updatedCategory = CategoryDTO.parse({ name });
        const result = await CategoriesDAO.update(id, updatedCategory.name.trim());
        return result;
    },

    delete: async (id: string) => {
        return CategoriesDAO.delete(id);
    },

}
