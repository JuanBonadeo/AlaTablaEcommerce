import { prisma } from "./client.js";

async function main() {
  console.log("🌱 Seeding database...");

  // Crear una categoría base
  const category = await prisma.category.upsert({
    where: { id: "cat-1" },
    update: {},
    create: {
      id: "cat-1",
      name: "Parrilla",
    },
  });

  // Producto de ejemplo
  const product = await prisma.product.upsert({
    where: { slug: "tabla-parrillera" },
    update: {},
    create: {
      slug: "tabla-parrillera",
      name: "Tabla Parrillera",
      description: "Tabla artesanal de madera para asado",
      price: 4500,
      stock: 15,
      categoryId: category.id,
      images: {
        create: [
          { url: "image.png" },
          { url: "image.png" },
        ],
      },
      variants: {
        create: [
          { name: "Grande", slug: "grande", price: 5000, stock: 5 },
          { name: "Chica", slug: "chica", price: 4000, stock: 10 },
        ],
      },
    },
  });

  console.log("✅ Producto creado:", product.name);
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
