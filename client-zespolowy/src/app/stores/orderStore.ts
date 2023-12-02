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
    this.ordersRegistry.set(order.id, order);
  };

  loadOrders = async () => {
    store.commonStore.setInitialLoading(true);
    try {
    const orders = await agent.Orders.list();//nie zwraca sie lista
    // czy orders jest tablicą
    if (Array.isArray(orders)) {
        orders.forEach(
            order => this.setOrder(order)
        );
    }
    else
    {
        console.error("Returned data is not an array.");
    }
    
      runInAction(() => store.commonStore.setInitialLoading(false));
    } catch (error) {
        console.error("Error loading orders:", error);
        toast.error("failed to load");
    } finally {
        runInAction(() => store.commonStore.setInitialLoading(false))
    }
  };
}