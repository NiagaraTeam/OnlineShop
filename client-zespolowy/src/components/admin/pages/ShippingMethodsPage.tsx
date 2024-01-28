import { observer } from "mobx-react-lite"
import { useStore } from "../../../app/stores/store";
import { useState } from "react";
import Loading from "../../common/Loading";
import { LoadingState } from "../../../app/models/common/LoadingState";
import EditDeleteButtons from "../../common/EditDeleteButtons";
import { ShippingMethodForm } from "../forms/ShippingMethodForm";
import { ShippingMethod } from "../../../app/models/onlineshop/ShippingMethod";
import { FormikHelpers } from "formik";
import { Helmet } from "react-helmet-async";

export const ShippingMethodsPage = observer(() => {
  const {shippingPaymentStore, commonStore} = useStore();
  const {deleteShippingMethod, createShippingMethod, shippingMethods} = shippingPaymentStore;
  const {initialLoading} = commonStore;

  // create
  const handleCreate = (method: ShippingMethod, formikHelpers: FormikHelpers<ShippingMethod>) => {
    createShippingMethod(method)
      .then(() => formikHelpers.resetForm());
  };

  // delete
  const [loading, setLoading] = useState<LoadingState>({});

  const handleDelete = (id: number) => {
    setLoading((prevLoading) => ({
      ...prevLoading,
      [id]: true,
    }));
    deleteShippingMethod(id)
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
      <Helmet>
          <title>Shipping Methods - BeautyShop</title>
      </Helmet>
      <div className="row">

          <div className="text-center">
            <h2 className="my-4 text-center">
              SHIPPING METHODS
            </h2>
          </div>
          <ul className="list-group">
            {shippingMethods.map((method) => (
              <li key={method.id} className="list-group-item d-flex justify-content-between align-items-center">
                <b>{method.name} ({method.cost} zł)</b>
                <div className="d-flex align-items-center">
                  <button
                    className="btn btn-danger me-2"
                    onClick={() => handleDelete(method.id)}
                    disabled={loading[method.id]}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        
          <h4 className="mt-5 text-center">
            Create New Shipping Method
          </h4>
          <ShippingMethodForm onSubmit={handleCreate} buttonText="Create"/>

      </div>
  )
})