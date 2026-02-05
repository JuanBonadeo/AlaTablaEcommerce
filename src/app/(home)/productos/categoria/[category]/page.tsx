import { ProductsByCategoryServer } from "./ProductsByCategoryServer";

interface Props {
  params: Promise<{
    category: string;
  }>;
}

export default async function ProductsByCategoryPage({ params }: Props) {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8 capitalize">
        {decodedCategory}
      </h1>
      <ProductsByCategoryServer categoryName={decodedCategory} />
    </div>
  );
}
