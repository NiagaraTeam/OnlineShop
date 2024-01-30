import { observer } from "mobx-react-lite"
import { useStore } from "../../../../app/stores/store";
import { LoginPage } from "../LoginPage";
import { Link } from "react-router-dom";
import { CartPageItems } from "./CartPageItems";
import { CartPageTotalValue } from "./CartPageTotalValue";
import { CartPageSelectShipping } from "./CartPageSelectShipping";
import { CartPageSelectPayment } from "./CartPageSelectPayment";
import { CartPagePlaceOrder } from "./CartPagePlaceOrder";
import { Helmet } from "react-helmet-async";
import Dialog from "../../../common/Dialog";
import { useState } from "react";
import { router } from "../../../../app/router/Routes";

export const CartPage = observer(() => {
  const {cartStore, userStore: {isNetValue, handleVauleWithTaxCheckBox}} = useStore();
  const {showLoginForm, cartItems, resetCart, showDialog, createOrder, setShowDialog, removeUnavailableItems} = cartStore;

  const [reloadKey, setReloadKey] = useState(0);
  
  const handlePlaceOrder = () => {
    createOrder().then(() => {
      setShowDialog(false);
      router.navigate('/account');
  });
  }

  const handleRemoveUnavailableItems = () => {
    removeUnavailableItems();
    setReloadKey(prevKey => prevKey + 1);
  }

  if (showLoginForm) return <LoginPage redirectTo="/cart"/>

  return (
    <div className="container">
      <Helmet>
        <title>Cart - OnlineShop</title>
      </Helmet>
      {showDialog && 
        <Dialog 
            label="Some products are unavailable"
            description={
            <p>
              We regret to inform you that some of the products in your cart are currently unavailable in our inventory. Please choose one of the following options:
              <br /><br />
              1. <strong>Place Order:</strong> Continue with your order, and we will fulfill the available products. The out-of-stock items will be backordered and shipped once they become available.
              <br /><br />
              2. <strong>Remove Unavailable Products:</strong> Remove the out-of-stock items from your cart.
            </p>
            }
            confirmButtonText={"Place Order"}
            cancelButtonText={"Remove Unavailable Products"}
            onConfirm={handlePlaceOrder}
            onCancel={handleRemoveUnavailableItems}
        />
        }
      <div className="row">
        {cartItems.length > 0 &&
        <>
          <div className="col-lg-8">
            <CartPageItems key={reloadKey} cartItems={cartItems} resetCart={resetCart}/>
            <div className="form-check mt-3 mx-3">
              <input className="form-check-input" 
                  type="checkbox" 
                  id="netValueCheckBox" 
                  checked={isNetValue} 
                  onChange={handleVauleWithTaxCheckBox}/>
              <label className="form-check-label" htmlFor="netValueCheckBox">
                  Use net prices
              </label>
          </div>
          </div>
      
          <div className="col-lg-4" style={{marginTop: "53px"}}>
            <div className="border rounded py-3 px-3">
              <div className="mt-2">
                <CartPageSelectShipping />
              </div>

              <div className="mt-4">
                <CartPageSelectPayment />
              </div>

              <div className="mt-5 pt-4">
                <CartPageTotalValue />
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

