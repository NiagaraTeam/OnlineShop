import { CartItem } from "../../../../app/models/onlineshop/Cart";
import { CartList } from "./CartList";

interface Props {
    cartItems: CartItem[];
    resetCart: () => void;
}

export const CartPageItems = ({cartItems, resetCart}: Props) => {
    return (
        <>
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="mb-3">Cart ({cartItems.length})</h3>
            {cartItems.length > 0 && 
            <button className="btn btn-danger mb-3"
                onClick={() => resetCart()}>Clear items</button>
            }
          </div>
          <CartList items={cartItems}/>
        </>
    );
};