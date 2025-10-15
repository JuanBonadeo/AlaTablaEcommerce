import { Product } from "@/lib/types/product.types";

export async function getAllProducts(): Promise<Product[] | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      // 👇 mismo criterio de revalidación ISR (7 días)
      next: { revalidate: 604800 },
    });

    if (!res.ok) return null;

    const result = await res.json();

    if (!result.success) return null;

    return result.data as Product[];
  } catch (error) {
    console.error("Error fetching all products:", error);
    return null;
  }
}
