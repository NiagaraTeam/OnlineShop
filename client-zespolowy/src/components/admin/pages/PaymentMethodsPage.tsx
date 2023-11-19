import { observer } from "mobx-react-lite"
import { useStore } from "../../../app/stores/store"
import { useEffect } from "react";

export const PaymentMethodsPage = observer(() => {
  const {shippingPaymentStore} = useStore();
  const {loadPaymentMethods, paymentMethods} = shippingPaymentStore;

  useEffect(() => {
    if (paymentMethods.length == 0)
      loadPaymentMethods();

  }, [loadPaymentMethods, paymentMethods])

  return (
    <div className="m-3">
      <h2 className="my-4">Payment Methods</h2>
      <div className="row">
        <ul className="list-group col-4">
          {paymentMethods .map((method) => (
            <li key={method.id} className="list-group-item">
              {method.name}
            </li>
          ))}
        </ul>

      </div>
    </div>
  )
})