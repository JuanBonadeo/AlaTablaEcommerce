import { ProductGrid } from "src/components/products/product-grid/ProductGrid";
import { Product } from "src/shared/types/types.js";



export const products: Product[] = [
    {
        id: "1",
        name: "Product 1",
        slug: "product-1",
        description: "Description for Product 1",
        price: 29.99,
        stock: 100,
        categoryId: "1",
        images: [
            {
                id: "1",
                url: "image.png",
                productId: "1",
            },
            {
                id: "2",
                url: "image.png",
                productId: "1",
            },
        ],
    },
    {
        id: "2",
        name: "Product 2",
        slug: "product-2",
        description: "Description for Product 2",
        price: 39.99,
        stock: 200,
        categoryId: "2",
        images: [
            {
                id: "1",
                url: "image.png",
                productId: "2",
            },
            {
                id: "2",
                url: "image.png",
                productId: "2",
            },
        ],
    },
    {
        id: "3",
        name: "Product 3",
        slug: "product-3",
        description: "Description for Product 3",
        price: 49.99,
        stock: 150,
        categoryId: "1",
        images: [
            {
                id: "1",
                url: "image.png",
                productId: "3",
            },
            {
                id: "2",
                url: "image.png",
                productId: "3",
            },
        ],
    },

];

export default function ProductosPage() {
  return (
    <>
      <ProductGrid products={ products } />
    </>
  );
}