import { CartListItem } from "./CartListItem";
import { CartItem } from "../../../app/models/onlineshop/Cart";

interface Props {
    items: CartItem[];
}
export const CartList = ({items}: Props) => {

    return (
        <ul className="list-group">
        {items.map((item) => 
            <li key={item.productId} className="list-group-item">
                <CartListItem item={item}/>
            </li>
        )}
        </ul>
    );
};