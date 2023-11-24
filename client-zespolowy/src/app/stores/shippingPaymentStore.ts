import { makeAutoObservable, runInAction } from "mobx";
import { ShippingMethod } from "../models/onlineshop/ShippingMethod";
import agent from "../api/agent";
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

    private setPaymentMethod = (method: PaymentMethod) => {
        this.paymentMethodsRegistry.set(method.id, method);
    }

    private setShippingMethod = (method: ShippingMethod) => {
        this.shippingMethodsRegistry.set(method.id, method);
    }

    loadShippingMethods = async () => {
        store.commonStore.setInitialLoading(true);
        try {
            const shippingMethods = await agent.ShippingMethods.list();
            shippingMethods.forEach(
                method => this.setShippingMethod(method)
            );
            runInAction(() => store.commonStore.setInitialLoading(false))
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => store.commonStore.setInitialLoading(false))
        }
    }

    loadPaymentMethods = async () => {
        store.commonStore.setInitialLoading(true)
        try {
            const paymentMethods = await agent.PaymentMethods.list();
            paymentMethods.forEach(
                method => this.setPaymentMethod(method)
            );
            runInAction(() => store.commonStore.setInitialLoading(false))
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => store.commonStore.setInitialLoading(false))
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