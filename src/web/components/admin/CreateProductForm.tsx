"use client";

import { useState } from "react";
import { createProductAction, updateProductAction } from "@/web/actions/product.actions";
import React from "react";
import { useRouter } from "next/navigation.js";

type Props = {
  categories: { id: string; name: string }[];
  initialData?: {
    id: string;
    name: string;
    price: number;
    stock: number;
    categoryId: string;
    description?: string;
  };
};

export default function CreateProductForm({ categories, initialData }: Props) {
  const [message, setMessage] = useState<string | null>(null);
  const formRef = React.useRef<HTMLFormElement>(null);
  const router = useRouter();
  async function handleSubmit(formData: FormData) {
    let result;

    if (initialData) {
      // Update
      result = await updateProductAction(initialData.id, formData);
      router.push('/admin/products');
    } else {
      // Create
      result = await createProductAction(formData);
    }

    if (!result.ok) {
      setMessage(result.message ?? "Error guardando producto");
      return;
    }

    setMessage(initialData ? "Producto actualizado ✅" : "Producto creado ✅");
   
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-200">
          Nombre
        </label>
        <input
          type="text"
          name="name"
          defaultValue={initialData?.name}
          required
          className="w-full px-3 py-2 rounded-md bg-neutral-800 text-white border border-neutral-600"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200">
          Precio
        </label>
        <input
          type="number"
          step="0.01"
          name="price"
          defaultValue={initialData?.price}
          required
          className="w-full px-3 py-2 rounded-md bg-neutral-800 text-white border border-neutral-600"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200">
          Stock
        </label>
        <input
          type="number"
          name="stock"
          defaultValue={initialData?.stock}
          required
          className="w-full px-3 py-2 rounded-md bg-neutral-800 text-white border border-neutral-600"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200">
          Categoría
        </label>
        <select
          name="categoryId"
          defaultValue={initialData?.categoryId}
          required
          className="w-full px-3 py-2 rounded-md bg-neutral-800 text-white border border-neutral-600"
        >
          <option value="">Seleccionar...</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200">
          Descripción
        </label>
        <textarea
          name="description"
          defaultValue={initialData?.description}
          className="w-full px-3 py-2 rounded-md bg-neutral-800 text-white border border-neutral-600"
        />
      </div>

      <button
        type="submit"
        className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-4 py-2 rounded-md"
      >
        {initialData ? "Actualizar Producto" : "Crear Producto"}
      </button>

      {message && (
        <p className="text-sm mt-2 text-center text-gray-300">{message}</p>
      )}
    </form>
  );
}
