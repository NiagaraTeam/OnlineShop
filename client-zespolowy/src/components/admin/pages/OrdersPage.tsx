import { observer } from 'mobx-react-lite';
import { useStore } from '../../../app/stores/store';
import { OrderStatus } from '../../../app/models/enums/OrderStatus';
import Loading from '../../common/Loading';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { enumToOptions } from '../../../app/models/options/Option';

export const OrdersPage = observer(() => {
  const { orderStore, commonStore } = useStore();
  const { orders, changeOrderStatus } = orderStore;
  const { initialLoading } = commonStore;

  const [selectedStatus, setSelectedStatus] = useState(0); // początkowy status (0 - wszystkie zamówienia)

  if (initialLoading) return <div className="text-center m-5"><Loading /></div>;

  const filteredOrders = orders.filter(order => selectedStatus === 0 || order.status === selectedStatus);

  const handleStatusChange = (orderId: number, status: OrderStatus) => {
    changeOrderStatus(orderId, status);
  };

  const orderStatusOptions = enumToOptions(OrderStatus);

  return (
    <div className="m-3">
      <h2 className="my-4">Orders</h2>
      <div className="col-md-3 order-md-1">
        <select
          className="form-select"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(parseInt(e.target.value))}
        >
          <option value={0}>All</option>
          {orderStatusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.text}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-3"></div>
      <div className="col-md-10 order-md-10">
        
        {filteredOrders.length !== 0 &&
        <table className="table table-bordered">
          <thead className='table-light'>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Status</th>
              <th style={{ width: "0", whiteSpace: "nowrap" }} className="text-center"></th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.orderDate.toDateString()}</td>
                <td>{order.userDetails.email}</td>
                <td>{OrderStatus[order.status]}</td>
                <td>
                  <div className='d-flex me-2'>
                    <Link to={`/admin/order/${order.id}`} className="btn btn-primary btn-sm mx-2">
                    Details
                    </Link>
                    {order.status !== OrderStatus.Completed && order.status !== OrderStatus.Canceled &&
                    <div className="dropdown d-inline-block">
                      <button
                        className="btn btn-secondary btn-sm dropdown-toggle"
                        type="button"
                        id={`statusDropdown${order.id}`}
                        data-bs-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        Status
                      </button>
                      <div className="dropdown-menu" aria-labelledby={`statusDropdown${order.id}`}>
                        {orderStatusOptions.map((option) => (
                          <button
                            key={option.value}
                            className="dropdown-item"
                            onClick={() => handleStatusChange(order.id, option.value as OrderStatus)}
                          >
                            {option.text}
                          </button>
                        ))}
                      </div>
                    </div>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>}
        
        {(filteredOrders.length === 0 && orders.length > 0) &&
        <div className="mt-5">
          <h5>There are no {OrderStatus[selectedStatus].toLowerCase()} orders</h5>
        </div>}
      </div>
    </div>
  );
});

