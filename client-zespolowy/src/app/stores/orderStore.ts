import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { Order } from '../models/onlineshop/Order';
import { toast } from 'react-toastify';
import { store } from "./store";
import { OrderItem } from '../models/onlineshop/OrderItem';
import { OrderStatus } from '../models/enums/OrderStatus';

export default class OrderStore {
  ordersRegistry = new Map<number, Order>();
  selectedOrder: Order | undefined = undefined;

  constructor() {
    makeAutoObservable(this);
  }

  get orders() {
    return Array.from(this.ordersRegistry.values());
  }

  private setOrder = (order: Order) => {
    this.ordersRegistry.set(order.id, this.initializeDate(order));
  };

  private getOrder = (id: number) => {
    return this.ordersRegistry.get(id);
  }

  private initializeDate = (order: Order): Order => {
    order.orderDate = new Date(order.orderDate);
    const initializedItems: OrderItem[] = [];

    order.items.forEach((item) => {
      item.product = store.productStore.initializeDate(item.product);
      initializedItems.push(item);
    })

    order.items = initializedItems;
    
    return order;
  }

  initializeDates = (orders: Order[]): Order[] => {
      const initializedOrders: Order[] = [];

      orders.forEach((order) => {
          initializedOrders.push(this.initializeDate(order));
      })
      return initializedOrders;
  }

  loadOrders = async () => {
    try {
      const orders = await agent.Orders.list();
      runInAction(()=>{
        orders.forEach(
          order => this.setOrder(order)
      );
      })
      
    } catch (error) {
        console.error("Error loading orders:", error);
        toast.error("failed to load");
    }
  };
  
  changeOrderStatus = async (orderId: number, newStatus: OrderStatus) => {
    try {
      await agent.Orders.changeOrderStatus(orderId, newStatus);

      const orderToUpdate = this.orders.find((order) => order.id === orderId);
      runInAction(() => {
        if (orderToUpdate) 
          orderToUpdate.status = newStatus;
      });
      
    } catch (error) {
      console.error('Error changing order status:', error);
    }
  };

  loadOrder = async (id: number) => {
    let order = this.getOrder(id);

    if (order) {
        runInAction(() => this.selectedOrder = order);
        return order;
    } else {
        store.commonStore.setInitialLoading(true);
        try {
            order = await agent.Orders.getDetails(id);
            runInAction(() => {
              this.setOrder(order!);
              this.selectedOrder = order;
            })
            return order;
        } catch (error) {
            console.log(error);
            toast.error('Failed to load order');
        } finally {
          runInAction(() => store.commonStore.setInitialLoading(false));
      }
    }
  }
}
