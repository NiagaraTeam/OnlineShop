import { OrderStatus } from "../../app/models/enums/OrderStatus";
import { Order } from "../../app/models/onlineshop/Order";

interface Props {
  order: Order;
}

export const OrderDetails = ({order}: Props) => {
  
  function calculateTotalOrderAmount(order: Order) {
    const totalProductAmount = order.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
    if(order.shippingMethod.cost == null)
    {
      order.shippingMethod.cost = 0;
    }
    return Math.floor((totalProductAmount + order.shippingMethod.cost) * 100) / 100;
  }
  
  return (
    <div>
      <p className="fs-3 row">
          <div>Order no. <b className="fs-2">{order.id}</b></div>
          <div className="fs-6">Date: {order.orderDate.toLocaleDateString()}</div>
          <div className="fs-6">Status: {OrderStatus[order.status]}</div>
      </p>
      <div className="row">

        <div className="col-8 pe-5">
          <h5 className="mb-4 mt-2">Items</h5>
          <table className="table table-bordered">
            <thead className="table-light">
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
                  <td>{Math.floor(item.product.price*item.quantity * 100) / 100}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="col-4 border rounded px-4 py-4">
          <h5 className="">Details</h5>

          <div className="mt-4">
            <div className="fs-6 my-3">Payment Method: <b>{order.paymentMethod.name}</b></div>
            <div className="fs-6 my-3">Shipping Method: <b>{order.shippingMethod.name} ({order.shippingMethod.cost} zł)</b></div>
          </div>
          
          <div className="mt-5">
            <p className="fs-6 mb-3">Shipping address:</p>
            <dl className="row">
              <dt className="col-sm-4">Address Line:</dt>
              <dd className="col-sm-8">{order.userDetails.address.addressLine1}</dd>

              {order.userDetails.address.addressLine2 && (
                <>
                  <dt className="col-sm-4">Address Line 2:</dt>
                  <dd className="col-sm-8">{order.userDetails.address.addressLine2}</dd>
                </>
              )}

              <dt className="col-sm-4">City:</dt>
              <dd className="col-sm-8">{order.userDetails.address.city}</dd>

              <dt className="col-sm-4">Country:</dt>
              <dd className="col-sm-8">{order.userDetails.address.country}</dd>

              <dt className="col-sm-4">Zip Code:</dt>
              <dd className="col-sm-8">{order.userDetails.address.zipCode}</dd>
            </dl>
          </div>

          <div className="fs-5 mt-5">Total: <b>{calculateTotalOrderAmount(order)} zł</b></div>
        </div>

        
      </div>
    </div>
  );
}
