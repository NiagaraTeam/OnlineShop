import { Product } from "../../../app/models/onlineshop/Product";

interface Props {
    product: Product;
}

export const ProductListItem = ({ product }: Props) => {
    return (
      <div className="card w-10 m-2">
        <img src={product.photo ? product.photo.urlSmall : 'assets/telefon.png'} className="card-img-top p-3" alt={product.name} />
        <div className="card-body">
            <h6 className="card-title">{product.name}</h6>
            {Product.isOnSale(product) ? 
                <p>
                    Price: <del>{product.price} zł</del> <b>{Product.getDiscountedPrice(product)} zł</b>
                </p>
            : 
                <p >Price: {product.price} zł</p>
            }
        </div>
      </div>
    );
};