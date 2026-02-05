export interface CartItem {
    // Producto (coincide con Product.id en Prisma)
    productId: string;
    // Permanece slug para enlaces a la página del producto
    slug: string;
    // Nombre del producto (coincide con Product.name)
    name: string;
    // Precio unitario (puede venir desde Product.price o ProductVariant.price)
    price: number;
    // Variante seleccionada: id de ProductVariant (opcional)
    variantId?: string;
    // Etiqueta de la variante (ej. "M", "L", o descripción). Opcional.
    variantName?: string;
    quantity: number;
    // Imagen principal para mostrar en el carrito
    image: string;
    // Oferta activa del producto
    offer?: {
        id: string;
        descuento: number;
        descripcion: string | null;
        desde: Date | string;
        hasta: Date | string;
    } | null;
}