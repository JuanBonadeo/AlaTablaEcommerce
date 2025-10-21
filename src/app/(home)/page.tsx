
import { ProductGrid } from "@/components/products/product-grid/ProductGrid";
import Banner from "@/components/ui/Banner";
import CategoriesSection from "@/components/ui/Categories";
import { products } from "./productos/page";


export default function Home() {
  return (
    <div className="font-sans">
      
      <Banner />
      <CategoriesSection />
      <ProductGrid products={ products } />
    </div>
  );
}
