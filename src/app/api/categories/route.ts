import { NextRequest, NextResponse } from "next/server";
import { CategoriesController } from "src/core/categories/categories.controller";



export async function GET(req: NextRequest) {
  return CategoriesController.get(req);
}

export async function POST(req: NextRequest) {
  return CategoriesController.post(req);
}

export async function PUT(req: NextRequest) {
  return CategoriesController.put(req);
}

export async function DELETE(req: NextRequest) {
  return CategoriesController.delete(req);
}
