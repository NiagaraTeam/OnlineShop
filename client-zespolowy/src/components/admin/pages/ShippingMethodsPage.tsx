import { observer } from "mobx-react-lite"
import { useStore } from "../../../app/stores/store";
import { useEffect, useState } from "react";
import Loading from "../../common/Loading";
import { LoadingState } from "../../../app/models/common/LoadingState";
import EditDeleteButtons from "../../common/EditDeleteButtons";
import { ShippingMethodForm } from "../forms/ShippingMethodForm";
import { ShippingMethod } from "../../../app/models/onlineshop/ShippingMethod";
import { FormikHelpers } from "formik";

export const ShippingMethodsPage = observer(() => {
  const {shippingPaymentStore, commonStore} = useStore();
  const {loadShippingMethods, deleteShippingMethod, 
    createShippingMethod, shippingMethods} = shippingPaymentStore;
  const {initialLoading} = commonStore;
  
  // on load
  useEffect(() => {
    if (shippingMethods.length == 0)
      loadShippingMethods();

  }, [loadShippingMethods, shippingMethods])

  
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
      <div className="row">

        <div className="col-lg-5">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="my-4">
              Shipping Methods
            </h2>
          </div>
          <ul className="list-group">
            {shippingMethods.map((method) => (
              <li key={method.id} className="list-group-item d-flex justify-content-between align-items-center">
                {method.name} ({method.cost} zł)
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

        <div className="col-lg-5 offset-2">
          <h2 className="my-4">
            Create Shipping Method
          </h2>
          <ShippingMethodForm onSubmit={handleCreate} buttonText="Create"/>
        </div>

      </div>
    </div>
  )
})