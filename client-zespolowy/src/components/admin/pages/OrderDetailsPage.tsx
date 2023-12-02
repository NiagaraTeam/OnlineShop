import { observer } from "mobx-react-lite"
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useStore } from "../../../app/stores/store";
import Loading from "../../common/Loading";
import { Order } from "../../../app/models/onlineshop/Order";

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
  
  function calculateTotalOrderAmount(order: Order) {
    const totalProductAmount = order.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
    if(order.shippingMethod.cost == null)
    {
      order.shippingMethod.cost = 0;
    }
    return totalProductAmount + order.shippingMethod.cost;
  }
  
  return (
    <div>
      <h2>Order Details</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={item.product.id}>
              <td>{item.product.name}</td>
              <td>{item.quantity}</td>
              <td>{item.product.price}</td>
              <td>{item.product.price*item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
  
      <table className="table">
        <thead>
          <tr>
            <th>Payment Method</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{order.paymentMethod.name}</td>
          </tr>
        </tbody>
      </table>
  
      <table className="table">
        <thead>
          <tr>
            <th>Shipping Method</th>
            <th>Cost</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{order.shippingMethod.name}</td>
            <td>{order.shippingMethod.cost}</td>
          </tr>
        </tbody>
      </table>
      <h3>Total Order Amount: {calculateTotalOrderAmount(order)}</h3>
    </div>
  );
  
})
