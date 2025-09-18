import { ProductGrid } from "src/components/products/product-grid/ProductGrid";
import Banner from "src/components/ui/Banner";
import CategoriesSection from "src/components/ui/Categories";
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
