import { ProductListItem } from "./ProductListItem";
import { Product } from "../../../app/models/onlineshop/Product";

interface Props {
  products: Product[];
  label: string;
}

export const ProductsSection = ({products, label}: Props) => {

    if (products.length == 0) return <></>

    return (
        <div className="m-3 p-3">
            <h5>{label}</h5>
            <div className="row row-cols-2 row-cols-md-5 g-2">
            {products.map((product) => (
                <div className="col" key={product.id}>
                <ProductListItem product={product}/>
                </div>
            ))}
            </div>
        </div>
    );
};