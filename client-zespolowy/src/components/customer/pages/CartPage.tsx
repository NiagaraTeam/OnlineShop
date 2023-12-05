import { observer } from "mobx-react-lite"
import { CartList } from "../features/CartList"
import { useStore } from "../../../app/stores/store";

export const CartPage = observer(() => {
  const {cartStore} = useStore();
  const {cartItems} = cartStore;

  return (
    <div>
      <p>Cart</p>
      <CartList items={cartItems}/>
    </div>
  )
})

