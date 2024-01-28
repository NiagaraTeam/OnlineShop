import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import { useState } from "react";
import Loading from "../../common/Loading";
import { LoadingState } from "../../../app/models/common/LoadingState";
import { PaymentMethodForm } from "../forms/PaymentMethodForm";
import { PaymentMethod } from "../../../app/models/onlineshop/PaymentMethod";
import { FormikHelpers } from "formik";
import { Helmet } from "react-helmet-async";

export const PaymentMethodsPage = observer(() => {
  const { shippingPaymentStore, commonStore } = useStore();
  const { deletePaymentMethod, createPaymentMethod, paymentMethods } = shippingPaymentStore;
  const { initialLoading } = commonStore;

  // create
  const handleCreate = (method: PaymentMethod, formikHelpers: FormikHelpers<PaymentMethod>) => {
    createPaymentMethod(method).then(() => formikHelpers.resetForm());
  };

  // delete
  const [loading, setLoading] = useState<LoadingState>({});

  const handleDelete = (id: number) => {
    setLoading((prevLoading) => ({
      ...prevLoading,
      [id]: true,
    }));
    deletePaymentMethod(id).finally(() => {
      setLoading((prevLoading) => ({
        ...prevLoading,
        [id]: false,
      }));
    });
  };

  if (initialLoading) return <div className="text-center m-5"><Loading /></div>;

  return (
    <div className="m-3">
      <Helmet>
        <title>Payment Methods - OnlineShop</title>
      </Helmet>
      <div className="row">
        <div className="text-center">
          <h2 className="my-4">PAYMENT METHODS</h2>
        </div>
        <ul className="list-group">
          {paymentMethods.map((method) => (
            <li key={method.id} className="list-group-item d-flex justify-content-between align-items-center">
              <b>{method.name}</b>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(method.id)}
                disabled={loading[method.id]}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
        <div className="text-center mt-5">
          <h4>Create Payment Method</h4>
          <PaymentMethodForm onSubmit={handleCreate} buttonText="Create" />
        </div>
      </div>
    </div>
  );
});
