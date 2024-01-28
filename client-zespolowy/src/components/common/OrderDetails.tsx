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

        <div className="col-lg-12 pe-lg-5">
          <div className="fs-3 row text-center">
            <div>ORDER ID <b className="fs-2 text-center">{order.id}</b></div>
          </div>
          <table className="table table-bordered text-center mt-4">
            <thead className="table-primary">
              <tr>
                <th>PRODUCT NAME</th>
                <th>QUANTITY</th>
                <th>PRICE</th>
                <th>TAX</th>
                <th>GROSS VALUE</th>
                <th>NET VALUE</th>
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

        <div className="text-center">
          <div className="mt-4">
            <div className="fs-6 "><b>DATE:</b> {order.orderDate.toLocaleDateString()}</div>
            <div className="fs-6 "><b>STATUS: </b>{OrderStatus[order.status]}</div>
            <div className="my-3 ">
            <div className="fs-6 "><b>PAYMENT METHOD: </b>{order.paymentMethod.name}</div>
            <div className="fs-6"><b>SHIPPING METHOD: </b>{order.shippingMethod.name} ({order.shippingMethod.cost} zł)</div>
            </div>
            <div className="row">
            <div className="fs-6 "><b>ADDRESS LINE: </b>{order.userDetails.address.addressLine1}</div>

              {order.userDetails.address.addressLine2 && (
                <>
                <div className="fs-6 "><b>ADDRESS LINE: </b>{order.userDetails.address.addressLine2}</div>
                </>
              )}
              <div className="fs-6 "><b>CITY: </b>{order.userDetails.address.city}</div>
              <div className="fs-6 "><b>COUNTRY: </b>{order.userDetails.address.country}</div>
              <div className="fs-6 "><b>ZIP CODE: </b>{order.userDetails.address.zipCode}</div>
            </div>
          </div>
   
          {hasDiscount && 
            <div className="my-4">
                <b>{roundValue(userDiscount * 100, 2)} % discount applied</b>
            </div>}
          <div className="frame-container ">
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
    </div>
  );
}
