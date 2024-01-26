import { observer } from "mobx-react-lite";
import { useStore } from "../../../../app/stores/store";

export const CartPagePlaceOrder = observer(() => {
    const {cartStore, userStore} = useStore();
    const {setShowLoginForm, subbmiting, tryCreateOrder} = cartStore;
    const {isLoggedIn, isAdmin} = userStore;
  
    return (
        <>
          {(isLoggedIn && !isAdmin) 
              ? 
                <button 
                  className="btn btn-primary" 
                  disabled={subbmiting} 
                  onClick={() => tryCreateOrder()}>
                    Place Order
                </button>
              :
                <button 
                  className="btn btn-primary" 
                  onClick={() => setShowLoginForm(true)}>
                    Login to place order
                </button>
              }
        </>
    );
});