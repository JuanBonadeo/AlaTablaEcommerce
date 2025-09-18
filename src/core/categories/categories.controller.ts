import { NextRequest, NextResponse } from "next/server";
import { CategoryService } from "./categories.service";

export const CategoriesController = {
  get: async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    try {
      if (id) {
        const category = await CategoryService.getById(id);
        return NextResponse.json(category, { status: 200 });
      }
      const categories = await CategoryService.getAll();
      return NextResponse.json(categories, { status: 200 });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
  },

  post: async (req: NextRequest) => {
    try {
      const { name } = await req.json();
      const category = await CategoryService.create(name);
      return NextResponse.json(category, { status: 201 });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
  },

  put: async (req: NextRequest) => {
    try {
      const { id, name } = await req.json();
      const updated = await CategoryService.update(id, name);
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
      await CategoryService.delete(id);
      return NextResponse.json({}, { status: 204 });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
  },
};
