import { observer } from "mobx-react-lite";
import { Product } from "../../../app/models/onlineshop/Product";

interface Props {
    name: string;
    price: number;
    discount?: number;
    product: Product
}

export const ProductListItem: React.FC<Props> = observer(({ name, price, discount}) => {
    const discountedPrice = discount ? price - discount : price;
    return (
      <div className="card w-10 m-2">
        <img src={'assets/telefon.png'} className="card-img-top mt-3" alt={name} />
        <div className="card-body">
            <h6 className="card-title">{name}</h6>
            {discount ? 
                <p>
                    Price: <del>{price} zł</del> <b>{discountedPrice} zł</b>
                </p>
            : 
                <p >Price: {price} zł</p>
            }
        </div>
      </div>
    );
});