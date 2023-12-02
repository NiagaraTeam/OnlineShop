import { observer } from "mobx-react-lite"
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useStore } from "../../../app/stores/store";
import Loading from "../../common/Loading";
import { OrderStatus } from "../../../app/models/enums/OrderStatus";

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
      <p>Order ID: {order.id}, Date: {order.orderDate.toDateString()}, Status: {OrderStatus[order.status]}</p>
      <p>Szczegóły zamówienia, w tym tabela produktów z ilościami dla danego zamówienia i jakiś dropdown do zmiany statusu zamówienia</p>
      {order.items.map((item) => (
        <p>{item.product.name} x {item.quantity}</p>
      ))}
    </div>
  )
})
