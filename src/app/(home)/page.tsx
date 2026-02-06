
import Banner from "@/components/ui/Banner";
import CategoriesSection from "@/components/ui/Categories";
import { ProductsServer } from "./productos/ProductsServer";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Inicio',
  description: 'Bienvenido a A la Tabla. Descubre nuestra colección de artesanías en madera hechas a mano. Tablas de cortar, utensilios de cocina y decoración artesanal.',
  openGraph: {
    title: 'A la Tabla - Artesanías en Madera',
    description: 'Bienvenido a A la Tabla. Descubre nuestra colección de artesanías en madera hechas a mano.',
  }
};

export default function Home() {
  return (
    <div className="font-sans">
      
      <Banner />
      <CategoriesSection />
      <ProductsServer />
    </div>
  );
}
