import { observer } from "mobx-react-lite"
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useStore } from "../../../app/stores/store";
import Loading from "../../common/Loading";
import { OrderDetails } from "../../common/OrderDetails";

export const OrderDetailsPage = observer(() => {
  const {orderStore, commonStore} = useStore();
  const {initialLoading} = commonStore;
  const {loadOrder, selectedOrder: order} = orderStore;
  const {id} = useParams();

  useEffect(() => {
      if (id)
        loadOrder(parseInt(id));

  }, [id, loadOrder]);

  if (initialLoading || !order) return <div className="text-center m-5"><Loading /></div>;
  
  return (
    <div>
      <h2>Order Details</h2>
      <br />
      <table className="table">
        <thead>
        <tr>
          <th>Customer's address details</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <th>Address Line:</th>
          <td>{order.userDetails.address.addressLine1}</td>
        </tr>
        {order.userDetails.address.addressLine2 && (
          <tr>
            <th>Address Line 2:</th>
            <td>{order.userDetails.address.addressLine2}</td>
          </tr>
        )}
        <tr>
          <th>City:</th>
          <td>{order.userDetails.address.city}</td>
        </tr>
        <tr>
          <th>Country:</th>
          <td>{order.userDetails.address.country}</td>
        </tr>
        <tr>
          <th>Zip Code:</th>
          <td>{order.userDetails.address.zipCode}</td>
        </tr>
      </tbody>
     </table>
      <br />
      <OrderDetails></OrderDetails>
    </div>
  );
  
})
