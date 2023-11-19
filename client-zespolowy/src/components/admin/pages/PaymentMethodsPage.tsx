import { observer } from "mobx-react-lite"
import { useStore } from "../../../app/stores/store"
import { useEffect } from "react";
import Loading from "../../common/Loading";

export const PaymentMethodsPage = observer(() => {
  const {shippingPaymentStore, commonStore} = useStore();
  const {loadPaymentMethods, paymentMethods} = shippingPaymentStore;
  const {initialLoading} = commonStore;

  useEffect(() => {
    if (paymentMethods.length == 0)
      loadPaymentMethods();

  }, [loadPaymentMethods, paymentMethods])

  // te funkcje będą w ShippingPaymentStore
  const handleDelete = (id: number) => {
    console.log(id);
  };

  const handleEdit = (id: number) => {
    console.log(id);
  };

  const handleCreate = () => {
  };

  if (initialLoading) return <div className="text-center m-5"><Loading/></div>

  return (
    <div className="m-3">
      <div className="col-5 d-flex justify-content-between align-items-center">
        <h2 className="my-4">
          Payment Methods
        </h2>
        <button
          className="btn btn-success mt-2"
          onClick={() => handleCreate()}
        >
          Add
        </button>
      </div>
      <ul className="list-group col-5">
        {paymentMethods.map((method) => (
          <li key={method.id} className="list-group-item d-flex justify-content-between align-items-center">
            {method.name}
            <div>
              <button
                className="btn btn-primary mx-2"
                onClick={() => handleEdit(method.id)}
              >
                Edit
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(method.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>    
  )
})