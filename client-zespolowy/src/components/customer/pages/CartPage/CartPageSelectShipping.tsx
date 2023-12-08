import { observer } from "mobx-react-lite";
import { useStore } from "../../../../app/stores/store";
import SelectOptions from "../../../common/SelectOptions";

export const CartPageSelectShipping = observer(() => {
  const {cartStore, shippingPaymentStore} = useStore();
  const {shippingMethodId, setShippingMethod} = cartStore;
  const {shippingMethodsAsOptions} = shippingPaymentStore;
  
    return (
        <>
          <h4>Shipping method</h4>
              <SelectOptions 
                value={shippingMethodId} 
                options={shippingMethodsAsOptions} 
                onChange={setShippingMethod}/>
        </>
    );
});