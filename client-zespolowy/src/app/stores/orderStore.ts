import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { Order } from '../models/onlineshop/Order';
import { toast } from 'react-toastify';
import { store } from "./store";
import { OrderItem } from '../models/onlineshop/OrderItem';
import { Product } from '../models/onlineshop/Product';

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
    store.commonStore.setInitialLoading(true);
    try {
      const orders = await agent.Orders.list();
      orders.forEach(
          order => this.setOrder(order)
      );
    } catch (error) {
        console.error("Error loading orders:", error);
        toast.error("failed to load");
    } finally {
        runInAction(() => store.commonStore.setInitialLoading(false))
    }
  };

  loadOrder = async (id: number) => {
    let order = this.getOrder(id);

    if (order) {
        this.selectedOrder = order;
        return order;
    } else {
        store.commonStore.setInitialLoading(true);
        try {
            order = await agent.Orders.getDetails(id);

            const orderItems: OrderItem[] = [];
            order.items.forEach(async (item) => {
               item.product = await store.productStore.loadProduct(item.product.id) as Product;
               orderItems.push(item);
            })
            order.items = orderItems;
            this.setOrder(order);

            runInAction(() => this.selectedOrder = order)
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