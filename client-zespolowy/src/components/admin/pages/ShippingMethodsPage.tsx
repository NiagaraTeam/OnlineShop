import { observer } from "mobx-react-lite"
import { useStore } from "../../../app/stores/store";
import { useEffect } from "react";

export const ShippingMethodsPage = observer(() => {
  const {shippingPaymentStore} = useStore();
  const {loadShippingMethods, shippingMethods} = shippingPaymentStore;

  useEffect(() => {
    if (shippingMethods.length == 0)
      loadShippingMethods();

  }, [loadShippingMethods, shippingMethods])
  
  return (
    <div className="m-3">
      <h2 className="my-4">Shipping Methods</h2>
      <div className="row">
        <ul className="list-group col-4">
          {shippingMethods .map((method) => (
            <li key={method.id} className="list-group-item">
              {method.name}
            </li>
          ))}
        </ul>

      </div>
    </div>
  )
})