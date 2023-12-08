import { observer } from "mobx-react-lite"
import { CartList } from "../features/CartList"
import { useStore } from "../../../app/stores/store";
import SelectOptions from "../../common/SelectOptions";
import { LoginPage } from "./LoginPage";

export const CartPage = observer(() => {
  const {cartStore, shippingPaymentStore, userStore} = useStore();
  const {showLoginForm, setShowLoginForm, cartItems, resetCart, calculateTotalValues,
    shippingMethodId, paymentMethodId, setPaymentMethod, setShippingMethod, subbmiting, createOrder} = cartStore;
  const {shippingMethodsAsOptions, paymentMethodsAsOptions} = shippingPaymentStore;
  const {accountDetails, hasDiscount, isLoggedIn, isAdmin, userDiscount} = userStore;

  const { total, discountedTotal, 
    totalWithTax, discountedTotalWithTax } = calculateTotalValues(userDiscount);

  if (showLoginForm) return <LoginPage redirectTo="/cart"/>

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
            {hasDiscount && 
            <div className="text-success my-4">
                ({Math.floor(
                  accountDetails!.discountValue * 100
                )} % discount applied)
            </div>}
            <div className="mb-4">
              <h4>
                Total:{" "}
                {hasDiscount ? (
                  <>
                    <del>{total} zł</del>{" "}
                    {discountedTotal} zł
                  </>
                ) : (
                  <>{total} zł</>
                )}
              </h4>
              <h5 className="text-muted">
                Total with Tax:{" "}
                {hasDiscount ? (
                  <>
                    <del>{totalWithTax} zł</del>{" "}
                    {discountedTotalWithTax} zł
                  </>
                ) : (
                  <>{totalWithTax} zł</>
                )}
                </h5>
            </div>
            {(isLoggedIn && !isAdmin) 
            ? 
              <button className="btn btn-primary" disabled={subbmiting} onClick={() => createOrder()}>Place order</button>
            :
              <button className="btn btn-primary" onClick={() => setShowLoginForm(true)}>Login to place order</button>
            }
            
          </div>
        </div>} 

      </div>
    </div>
  )
})

