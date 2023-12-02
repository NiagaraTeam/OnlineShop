import { observer } from 'mobx-react-lite';
import { useStore } from '../../../app/stores/store';
import { OrderStatus } from "../../../app/models/enums/OrderStatus";
import Loading from '../../common/Loading';
import { Link } from 'react-router-dom';

export const OrdersPage = observer(() => {
  const { orderStore, commonStore } = useStore();
  const { orders } = orderStore;
  const { initialLoading } = commonStore;

  if (initialLoading) return <div className="text-center m-5"><Loading /></div>;

  return (
    <div className="m-3">
      <h2 className="my-4">Orders</h2>

      <table className="table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.orderDate.toDateString()}</td>
              <td>{OrderStatus[order.status]}</td>
              <td>
                <Link to={`/admin/order/${order.id}`} className='btn btn-primary btn-sm'>
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
