// web/data/products.ts

import { Product } from "@/lib/types/product.types.js";




export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${slug}`, {
      // 👇 revalidación ISR (ya pusiste 7 días en la página)
      next: { revalidate: 604800 },
    });

    if (!res.ok) return null;

    const result = await res.json();

    if (!result.success) return null;

    return result.data 
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
}
