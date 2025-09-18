import { NextRequest, NextResponse } from "next/server";
import { ProductsController } from '@/core/products/products.controller';


export async function GET(req: NextRequest) {
  return ProductsController.get(req);
}

export async function POST(req: NextRequest) {
  return ProductsController.post(req);
}

export async function PUT(req: NextRequest) {
  return ProductsController.put(req);
}

export async function DELETE(req: NextRequest) {
  return ProductsController.delete(req);
}
