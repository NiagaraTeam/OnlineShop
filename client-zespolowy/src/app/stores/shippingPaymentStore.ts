import { makeAutoObservable } from "mobx";
import { ShippingMethod } from "../models/onlineshop/ShippingMethod";
import agent from "../api/agent";
import { PaymentMethod } from "../models/onlineshop/PaymentMethod";

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
        try {
            const shippingMethods = await agent.ShippingMethods.list();
            shippingMethods.forEach(
                method => this.setShippingMethod(method)
            );
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
        } catch (error) {
            console.log(error);
        }
    }
}