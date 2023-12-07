import { observer } from "mobx-react-lite"
import { CartList } from "../features/CartList"
import { useStore } from "../../../app/stores/store";
import SelectOptions from "../../common/SelectOptions";

export const CartPage = observer(() => {
  const {cartStore, shippingPaymentStore} = useStore();
  const {cartItems, resetCart, totalValue, totalValueWithTax,
    shippingMethodId, paymentMethodId, setPaymentMethod, setShippingMethod} = cartStore;
  const {shippingMethodsAsOptions, paymentMethodsAsOptions} = shippingPaymentStore;

  return (
    <div className="container">
      <div className="row">

        <div className="col-lg-8">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="mb-3">Cart ({cartItems.length})</h3>
            {cartItems.length > 0 && 
            <div>
              <button className="btn btn-danger mb-3"
                  onClick={() => resetCart()}>Clear items</button>
            </div>}
          </div>
          <CartList items={cartItems}/>
        </div>

        {cartItems.length > 0 &&
        <div className="col-lg-4">
          <div className="mt-5">
            <h4>Shipping method</h4>
            <SelectOptions 
              value={shippingMethodId} 
              options={shippingMethodsAsOptions} 
              onChange={setShippingMethod}/>
          </div>
          <div className="mt-5">
            <h4>Payment method</h4>
            <SelectOptions 
              value={paymentMethodId} 
              options={paymentMethodsAsOptions} 
              onChange={setPaymentMethod}/>
          </div>
          <div className="mt-5">
            <div className="mb-4">
              <h4>Total: {Math.floor(totalValue * 100) / 100} zł</h4>
              <h5 className="text-muted">Total with Tax: {Math.floor(totalValueWithTax * 100) / 100} zł</h5>
            </div>
            <button className="btn btn-primary">Place order</button>
          </div>
        </div>}

      </div>
    </div>
  )
})

