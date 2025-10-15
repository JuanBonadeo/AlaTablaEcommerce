
import { ProductGrid } from "@/web/components/products/product-grid/ProductGrid";
import Banner from "@/web/components/ui/Banner";
import CategoriesSection from "@/web/components/ui/Categories";
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
