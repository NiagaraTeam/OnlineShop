import { makeAutoObservable, runInAction } from "mobx";
import { ShippingMethod } from "../models/onlineshop/ShippingMethod";
import agent from "../api/agent";
import { PaymentMethod } from "../models/onlineshop/PaymentMethod";
import { store } from "./store";

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
}