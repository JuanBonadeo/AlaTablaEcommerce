import { NextRequest, NextResponse } from "next/server";
import { ProductService } from "./products.service";

export const ProductsController = {
  get: async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    try {
      if (id) {
        const product = await ProductService.getById(id);
        return NextResponse.json(product, { status: 200 });
      }
      const products = await ProductService.getAll();
      return NextResponse.json(products, { status: 200 });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
  },

  post: async (req: NextRequest) => {
    try {
      const data = await req.json();
      const product = await ProductService.create(data);
      return NextResponse.json(product, { status: 201 });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
  },

  put: async (req: NextRequest) => {
    try {
      const { id, ...data } = await req.json();
      const updated = await ProductService.update(id, data);
      return NextResponse.json(updated, { status: 200 });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
  },

  delete: async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    try {
      if (!id) {
        return NextResponse.json({ error: "Falta el id" }, { status: 400 });
      }
      await ProductService.delete(id);
      return NextResponse.json({}, { status: 204 });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
  },
};
