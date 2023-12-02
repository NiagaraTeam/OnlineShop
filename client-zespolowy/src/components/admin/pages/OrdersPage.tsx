import { observer } from 'mobx-react-lite';
import { useStore } from '../../../app/stores/store';
import { useEffect } from 'react';
import { OrderStatus } from "../../../app/models/enums/OrderStatus";
import Loading from '../../common/Loading';

export const OrdersPage = observer(() => {
  const { orderStore, commonStore } = useStore();
  const { orders, loadOrders } = orderStore;
  const { initialLoading } = commonStore;

  useEffect(() => {
    if (orders.length == 0)
      loadOrders();

  }, [loadOrders, orders])

  if (initialLoading) return <div className="text-center m-5"><Loading /></div>;

  return (
    <div className="m-3">
      <h2 className="my-4">Orders</h2>

      <ul className="list-group">
        {orders.map((order) => (
          <li key={order.id} className="list-group-item">
            Order ID: {order.id}, Date: {order.orderDate.toDateString()}, Status: {OrderStatus[order.status]}
          </li>
        ))}
      </ul>
    </div>
  );
});