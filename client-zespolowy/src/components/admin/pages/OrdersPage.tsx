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

      {/*tu powinna być tabela z zamówieniami z opcją zmiany statusu i może jakieś pole do sortowania po dacie albo statusie*/}
      <ul className="list-group">
        {orders.map((order) => (
          <li key={order.id} className="list-group-item">
            <Link to={`/admin/order/${order.id}`} className='text-decoration-none text-black'> 
              Order ID: {order.id}, Date: {order.orderDate.toDateString()}, Status: {OrderStatus[order.status]}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
});