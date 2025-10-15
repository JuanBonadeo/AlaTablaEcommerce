import { ProductService } from "@/core/products/products.service";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const products = await ProductService.getAll();

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error fetching products" }, { status: 500 });
  }
}
