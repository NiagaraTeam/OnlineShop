import { CartListItem } from "./CartListItem";
import { CartItem } from "../../../app/models/onlineshop/Cart";

interface Props {
    items: CartItem[];
}
export const CartList = ({items}: Props) => {

    return (
        <div>
        {items.map((item) => 
            <CartListItem item={item}/>
        )}
        </div>
    );
};