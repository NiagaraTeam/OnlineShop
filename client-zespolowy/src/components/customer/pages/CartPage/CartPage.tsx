import { observer } from "mobx-react-lite"
import { useStore } from "../../../../app/stores/store";
import { LoginPage } from "../LoginPage";
import { Link } from "react-router-dom";
import { CartPageItems } from "./CartPageItems";
import { CartPageTotalValue } from "./CartPageTotalValue";
import { CartPageSelectShipping } from "./CartPageSelectShipping";
import { CartPageSelectPayment } from "./CartPageSelectPayment";
import { CartPagePlaceOrder } from "./CartPagePlaceOrder";
import { Helmet } from "react-helmet";

export const CartPage = observer(() => {
  const {cartStore} = useStore();
  const {showLoginForm, cartItems, resetCart} = cartStore;

  if (showLoginForm) return <LoginPage redirectTo="/cart"/>

  return (
    <div className="container">
      <Helmet>
        <title>Cart - OnlineShop</title>
      </Helmet>
      <div className="row">
        {cartItems.length > 0 &&
        <>
          <div className="col-lg-8">
            <CartPageItems cartItems={cartItems} resetCart={resetCart}/>
          </div>
      
          <div className="col-lg-4 border rounded py-3 px-3"
            style={{marginTop: "53px"}}>

              <div className="mt-2">
                <CartPageSelectShipping />
              </div>

              <div className="mt-4">
                <CartPageSelectPayment />
              </div>

              <div className="mt-5 pt-4">
                <CartPageTotalValue />
                <div className="d-grid">
                  <CartPagePlaceOrder/>
                </div>
              </div>

            </div>
        </>}

        {cartItems.length === 0 &&
        <div className="text-center">
          <h2>Your cart is empty</h2>
          <Link to={"/products"} className="btn btn-primary mt-4">Browse products</Link>
        </div>
        }

      </div>
    </div>
  )
})

