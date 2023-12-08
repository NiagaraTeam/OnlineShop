import { observer } from "mobx-react-lite";
import { useStore } from "../../../../app/stores/store";
import { router } from "../../../../app/router/Routes";

export const CartPagePlaceOrder = observer(() => {
    const {cartStore, userStore} = useStore();
    const {setShowLoginForm, subbmiting, 
        createOrder} = cartStore;
    const {isLoggedIn, isAdmin} = userStore;
  
    return (
        <>
          {(isLoggedIn && !isAdmin) 
              ? 
                <button 
                  className="btn btn-primary" 
                  disabled={subbmiting} 
                  onClick={() => createOrder().then(() => router.navigate('/account'))}>
                    Place order
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