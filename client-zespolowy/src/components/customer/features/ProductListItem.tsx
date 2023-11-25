import { observer } from "mobx-react-lite";
import Image from "./img/telefon.png";

interface Props {
    name: string;
    price: number;
    discount?: number;
}

export const ProductListItem: React.FC<Props> = observer(({ name, price, discount}) => {
    const discountedPrice = discount ? price - discount : price;
    return (
      <div className="card w-10 m-2">
        <img src={Image} className="card-img-top" alt={name} />
        <div className="card-body">
            <h6 className="card-title">{name}</h6>
            {discount ? (
            <div>
                <p className="original-price">
                    Price: <del>{price} zł</del> <b>{discountedPrice} zł</b>
                </p>
            </div>
            ) : (
                <p className="normal-price">Price: {price} zł</p>
            )}
        </div>
      </div>
    );
});