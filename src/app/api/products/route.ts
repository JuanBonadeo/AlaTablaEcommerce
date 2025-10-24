import { ProductService } from "@/core/products/products.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await ProductService.getAll();

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json(result, { 
      status: 200,
    });
  } catch (error) {
    console.error('Error in GET /api/products:', error);
    return NextResponse.json(
      { success: false, message: "Error fetching products" },
      { status: 500 }
    );
  }
}