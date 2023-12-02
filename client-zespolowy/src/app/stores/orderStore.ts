import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { Order } from '../models/onlineshop/Order';
import { toast } from 'react-toastify';
import { store } from "./store";

export default class OrderStore {
  ordersRegistry = new Map<number, Order>();

  constructor() {
    makeAutoObservable(this);
  }

  get orders() {
    return Array.from(this.ordersRegistry.values());
  }

  private setOrder = (order: Order) => {
    this.ordersRegistry.set(order.id, this.initializeDate(order));
  };

  private initializeDate = (order: Order): Order => {
    order.orderDate = new Date(order.orderDate);
    //order.items = store.productStore.initializeDates(order.items);
    return order;
  }

  initializeDates = (orders: Order[]): Order[] => {
      const initializedProducts: Order[] = [];

      orders.forEach((order) => {
          initializedProducts.push(this.initializeDate(order));
      })
      return initializedProducts;
  }

  loadOrders = async () => {
    store.commonStore.setInitialLoading(true);
    try {
      const orders = await agent.Orders.list();
      orders.forEach(
          order => this.setOrder(order)
      );
      runInAction(() => store.commonStore.setInitialLoading(false));
    } catch (error) {
        console.error("Error loading orders:", error);
        toast.error("failed to load");
    } finally {
        runInAction(() => store.commonStore.setInitialLoading(false))
    }
  };
}