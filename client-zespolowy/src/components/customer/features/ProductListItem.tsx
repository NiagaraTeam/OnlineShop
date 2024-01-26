import { Link } from "react-router-dom";
import { Product } from "../../../app/models/onlineshop/Product";
import { FavouriteCheckBox } from "./FavouriteCheckBox";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";

interface Props {
    product: Product;
}

export const ProductListItem = observer(({ product }: Props) => {
    const {userStore} = useStore();
    const {isNetValue} = userStore;

    const renderPrice = () => {
        if (isNetValue)
            return renderNetPrice();
        else 
            return renderGrossPrice();
    }


    const renderNetPrice = () => {
        return(
            Product.isOnSale(product) ? 
            <p>
                <del>{product.price} zł</del> <b>{Product.getDiscountedPrice(product)} zł</b>
            </p>
        : 
            <p>{product.price} zł</p>
        )
    }

    const renderGrossPrice = () => {
        return(
        Product.isOnSale(product) ? 
            <p>
                <del>{Product.getPriceWithTax(product)} zł</del> <b>{Product.getDiscountedPriceWithTax(product)} zł</b>
            </p>
        : 
            <p>{Product.getPriceWithTax(product)} zł</p>
        )
    }

    return (
      <div className="card w-10 m-2">
        <Link className="text-decoration-none text-black" to={`/product/${product.id}`}>
        <img src={product.photo ? product.photo.urlSmall : '/assets/product.jpg'} className="card-img-top p-3" alt={product.name} />
            <div className="card-body">
                <h6 className="card-title">{product.name} </h6>
                {renderPrice()}
            </div>
        </Link>
        <span className="position-absolute top-0 end-0 m-2">
            <FavouriteCheckBox size={30} productId={product.id} color={"grey"}/>
        </span>
      </div>
    );
});