import { makeAutoObservable, runInAction } from "mobx";
import { ShippingMethod } from "../models/onlineshop/ShippingMethod";
import agent from "../api/agent";
import { Option } from "../models/options/Option";
import { PaymentMethod } from "../models/onlineshop/PaymentMethod";
import { store } from "./store";
import { toast } from "react-toastify";

export default class ShippingPaymentStore {
    shippingMethodsRegistry = new Map<number, ShippingMethod>();
    paymentMethodsRegistry = new Map<number, PaymentMethod>();

    constructor() {
        makeAutoObservable(this);
    }

    get shippingMethods() {
        return Array.from(this.shippingMethodsRegistry.values());
    }
    
    get paymentMethods() {
        return Array.from(this.paymentMethodsRegistry.values());
    }

    get shippingMethodsAsOptions(): Option[] {
        return this.shippingMethods.map(method => ({
          value: method.id,
          text: `${method.name} (${method.cost} zł)`,
        }));
      }

    get paymentMethodsAsOptions(): Option[] {
        return this.paymentMethods.map(method => ({
          value: method.id,
          text: `${method.name}`,
        }));
      }

    private setPaymentMethod = (method: PaymentMethod) => {
        this.paymentMethodsRegistry.set(method.id, method);
    }

    private setShippingMethod = (method: ShippingMethod) => {
        this.shippingMethodsRegistry.set(method.id, method);
    }

    shippingMethodPrice = (methodId: number): number | undefined => {
        const shippingMethod = this.shippingMethodsRegistry.get(methodId);

        if (shippingMethod) {
            return shippingMethod.cost !== null ? shippingMethod.cost : undefined;
        } else {
            return undefined;
        }
    }

    loadShippingMethods = async () => {
        try {
            const shippingMethods = await agent.ShippingMethods.list();
            shippingMethods.forEach(
                method => this.setShippingMethod(method)
            );
            runInAction(() => store.commonStore.setInitialLoading(false))
        } catch (error) {
            console.log(error);
        }
    }

    loadPaymentMethods = async () => {
        try {
            const paymentMethods = await agent.PaymentMethods.list();
            paymentMethods.forEach(
                method => this.setPaymentMethod(method)
            );
            runInAction(() => store.commonStore.setInitialLoading(false))
        } catch (error) {
            console.log(error);
        }
    }

    deletePaymentMethod = async (id: number) => {
        try {
            await agent.PaymentMethods.delete(id);
            this.paymentMethodsRegistry.delete(id);
            toast.success(`Method deleted`);
        } catch (error) {
            console.log(error);
            toast.error('Failed to delete method');
        }
    }

    deleteShippingMethod = async (id: number) => {
        try {
            await agent.ShippingMethods.delete(id);
            this.shippingMethodsRegistry.delete(id);
            toast.success(`Method deleted`);
        } catch (error) {
            console.log(error);
            toast.error('Failed to delete method');
        }
    }

    createShippingMethod = async (method: ShippingMethod) => {
        try {
            const id = await agent.ShippingMethods.create(method);
            method.id = id;
            runInAction(() => this.setShippingMethod(method));
            toast.success(`Method "${method.name}" created`);
        } catch (error) {
            console.log(error);
            toast.error('Failed to create method');
        }
    }

    createPaymentMethod = async (method: PaymentMethod) => {
        try {
            const id = await agent.PaymentMethods.create(method);
            method.id = id;
            runInAction(() => this.setPaymentMethod(method));
            toast.success(`Method "${method.name}" created`);
        } catch (error) {
            console.log(error);
            toast.error('Failed to create method');
        }
    }
}