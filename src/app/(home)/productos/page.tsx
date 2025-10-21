import { ProductGrid } from "@/components/products/product-grid/ProductGrid";
import { getAllProductsAction } from "@/lib/actions/product.actions";
import { ProductsServer } from "./ProductsServer";


export default  function ProductosPage() {
   
    return (
        <ProductsServer />
    );
}