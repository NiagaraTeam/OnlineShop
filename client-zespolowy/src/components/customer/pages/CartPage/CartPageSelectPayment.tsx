import { observer } from "mobx-react-lite";
import { useStore } from "../../../../app/stores/store";
import SelectOptions from "../../../common/SelectOptions";

export const CartPageSelectPayment = observer(() => {
  const {cartStore, shippingPaymentStore} = useStore();
  const {paymentMethodId, setPaymentMethod} = cartStore;
  const {paymentMethodsAsOptions} = shippingPaymentStore;
  
    return (
        <>
          <h4>Payment method</h4>
              <SelectOptions 
                value={paymentMethodId} 
                options={paymentMethodsAsOptions} 
                onChange={setPaymentMethod}/>
        </>
    );
});