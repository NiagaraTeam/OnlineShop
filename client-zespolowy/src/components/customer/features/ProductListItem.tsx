import { observer } from "mobx-react-lite";
import Image from "./img/telefon.png";

interface Props {
    name: string;
    price: number;
    discount?: number;
    new?: boolean;
}

export const ProductListItem: React.FC<Props> = observer(({ name, price, discount, new: isNew}) => {
    const discountedPrice = discount ? price - discount : price;
    return (
      <div className="card w-10 m-2">
        {isNew ? <h4 className="text-success"><p>New</p></h4> : null}
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