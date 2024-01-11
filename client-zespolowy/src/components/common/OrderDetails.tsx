import { Link } from "react-router-dom";
import { OrderStatus } from "../../app/models/enums/OrderStatus";
import { Order } from "../../app/models/onlineshop/Order";
import { OrderItem } from "../../app/models/onlineshop/OrderItem";
import { roundValue } from "../../app/utils/RoundValue";

interface Props {
  order: Order;
  adminView?: boolean
  addItemsFromOrder?: (order: Order) => void;
}

export const OrderDetails = ({order, adminView = false, addItemsFromOrder}: Props) => {
  const hasDiscount = order.userDetails.discountValue !== 0;
  const userDiscount = order.userDetails.discountValue;

  function calculateNetValue(item: OrderItem) {
    const taxRate = 1 + item.product.taxRate / 100;
    return roundValue(((item.product.price * item.quantity) * taxRate), 2)
  }
  
  return (
    <div>
      
      <div className="row">

        <div className="col-lg-8 pe-lg-5">
          <div className="fs-3 row">
            <div>Order no. <b className="fs-2">{order.id}</b></div>
            <div className="fs-6">Date: {order.orderDate.toLocaleDateString()}</div>
            <div className="fs-6">Status: {OrderStatus[order.status]}</div>
          </div>
          <table className="table table-bordered mt-4">
            <thead className="table-light">
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Tax</th>
                <th>Gross Value</th>
                <th>Net Value</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.product.id}>
                  <td>
                    <Link 
                      to={`/product/${item.product.id}`}
                      className="text-decoration-none text-black"
                    >
                      {item.product.name}
                    </Link>
                  </td>
                  <td>{item.quantity}</td>
                  <td>{item.product.price} zł</td>
                  <td>{item.product.taxRate === -1 ? "Tax free" : `${item.product.taxRate} %`}</td>
                  <td>{roundValue(item.product.price * item.quantity, 2)} zł</td>
                  <td>{calculateNetValue(item)} zł</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* {!adminView && 
          <div className="d-flex justify-content-end">
            <button 
              className="btn btn-secondary mt-3" 
              onClick={() => addItemsFromOrder!(order)}>
                Add products to cart
              </button>
          </div>} */}
          {!adminView && 
          <div className="d-lg-none mb-5">
            <button 
              className="btn btn-secondary mt-3 w-100" 
              onClick={() => addItemsFromOrder!(order)}
            >
              Add products to cart
            </button>
          </div>}

        {!adminView && 
          <div className="d-none d-lg-flex justify-content-end mb-4">
            <button 
              className="btn btn-secondary mt-3" 
              onClick={() => addItemsFromOrder!(order)}
            >
              Add products to cart
            </button>
          </div>}
        </div>

        <div className="col-lg-4 border rounded px-4 py-4">
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

          {hasDiscount && 
            <div className="my-4">
                {roundValue(userDiscount * 100, 2)} % discount applied
            </div>}

          <div className="fs-5 ">
            Total:&nbsp;
            {hasDiscount && <del className="text-muted">{roundValue(order.totalValue / (1 -userDiscount), 2)} zł</del>}
            <b>&nbsp;{roundValue(order.totalValue, 2)} zł</b>
          </div>
          <div className="fs-5 ">
            Total with Tax:&nbsp;
            {hasDiscount && <del className="text-muted">{roundValue(order.totalValueWithTax / (1 -userDiscount), 2)} zł</del>}
            <b>&nbsp;{roundValue(order.totalValueWithTax, 2)} zł</b>
          </div>
        </div>

        
      </div>
    </div>
  );
}
