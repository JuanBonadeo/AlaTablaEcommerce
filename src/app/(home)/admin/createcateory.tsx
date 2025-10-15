
import { createCategoryAction } from '@/web/actions/category.actions.js'
import React from 'react'

export const createCategory = () => {
    return (
        <form action={createCategoryAction}>
            <input type="text" name="name" placeholder="Nombre de la categoría" />
            <button type="submit">Crear categoría</button>
        </form>
    )
}
