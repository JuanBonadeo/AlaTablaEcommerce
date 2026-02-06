import { ProductsServer } from "./ProductsServer";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Productos',
  description: 'Explora nuestra colección completa de artesanías en madera. Tablas de cortar, utensilios de cocina, decoración y más productos artesanales hechos a mano.',
  keywords: ['productos', 'artesanías', 'madera', 'tablas de cortar', 'cocina', 'catálogo'],
  openGraph: {
    title: 'Productos - A la Tabla',
    description: 'Explora nuestra colección completa de artesanías en madera hechas a mano.',
  }
};

export default  function ProductosPage() {
   
    return (
        <ProductsServer />
    );
}