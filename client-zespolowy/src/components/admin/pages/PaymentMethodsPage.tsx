import { observer } from "mobx-react-lite"
import { useStore } from "../../../app/stores/store"
import { useState } from "react";
import Loading from "../../common/Loading";
import { LoadingState } from "../../../app/models/common/LoadingState";
import EditDeleteButtons from "../../common/EditDeleteButtons";
import { PaymentMethodForm } from "../forms/PaymentMethodForm";
import { PaymentMethod } from "../../../app/models/onlineshop/PaymentMethod";
import { FormikHelpers } from "formik";

export const PaymentMethodsPage = observer(() => {
  const {shippingPaymentStore, commonStore} = useStore();
  const {deletePaymentMethod, createPaymentMethod, paymentMethods} = shippingPaymentStore;
  const {initialLoading} = commonStore;


  // create
  const handleCreate = (method: PaymentMethod, formikHelpers: FormikHelpers<PaymentMethod>) => {
    createPaymentMethod(method)
      .then(() => formikHelpers.resetForm());
  };
  
  // delete
  const [loading, setLoading] = useState<LoadingState>({});

  const handleDelete = (id: number) => {
    setLoading((prevLoading) => ({
      ...prevLoading,
      [id]: true,
    }));
    deletePaymentMethod(id)
      .finally(() => {
        setLoading((prevLoading) => ({
          ...prevLoading,
          [id]: false,
        }));
      });
  };

  if (initialLoading) return <div className="text-center m-5"><Loading/></div>

  return (
    <div className="m-3">
      <div className="row">

        <div className="col-lg-5">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="my-4">
              Payment Methods
            </h2>
          </div>
          <ul className="list-group">
            {paymentMethods.map((method) => (
              <li key={method.id} className="list-group-item d-flex justify-content-between align-items-center">
                {method.name}
                <EditDeleteButtons
                  loading={loading[method.id]}
                  showEdit={false}
                  deleteAction={() => handleDelete(method.id)}
                  size={25}
                />
              </li>
            ))}
          </ul>
        </div>
      
        <div className="col-lg-5 offset-lg-2">
            <h2 className="my-4">
              Create Shipping Method
            </h2>
            <PaymentMethodForm onSubmit={handleCreate} buttonText="Create"/>
        </div>
      
      </div>
    </div>    
  )
})