// app/api/products/slug/[slug]/route.ts
import { ProductService } from "@/core/products/products.service";
import { NextResponse } from "next/server";


interface Params {
  params: Promise<{ slug: string }>;
}

export async function GET(_: Request, { params }: Params) {
  const { slug } = await params;
  const result = await ProductService.getBySlug(slug);
  return NextResponse.json(result, { status: result.success ? 200 : 404 });
}
