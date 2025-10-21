
import Banner from "@/components/ui/Banner";
import CategoriesSection from "@/components/ui/Categories";
import { ProductsServer } from "./productos/ProductsServer";


export default function Home() {
  return (
    <div className="font-sans">
      
      <Banner />
      <CategoriesSection />
      <ProductsServer />
    </div>
  );
}
