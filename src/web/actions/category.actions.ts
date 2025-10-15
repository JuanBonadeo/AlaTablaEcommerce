"use server"
import { CategoryService } from "@/core/categories/categories.service";

export async function createCategoryAction(name: string) {
    return await CategoryService.create(name);
}
export async function updateCategoryAction(id: string, name: string) {
    return await CategoryService.update(id, name);
}
export async function deleteCategoryAction(id: string) {
    return await CategoryService.delete(id);
}


export async function getAllCategories() {
  return await CategoryService.getAll();
}
    