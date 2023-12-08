import { makeAutoObservable, reaction, runInAction } from "mobx";
import { CartItem } from "../models/onlineshop/Cart";
import { toast } from "react-toastify";
import agent from "../api/agent";
import { CreateOrder } from "../models/onlineshop/Order";
import { store } from "./store";

export default class CartStore {
    cartItems: CartItem[] = [];
    shippingMethodId: number | undefined = undefined;
    paymentMethodId: number | undefined = undefined;

    showLoginForm: boolean = false;
    subbmiting: boolean = false;
    
    constructor() {
        makeAutoObservable(this);

        this.loadFromLocalStorage();

        // Reaction to save changes to localStorage when cart data changes
        reaction(
            () => ({
                cartItems: this.cartItems.slice(), // Create a shallow copy to trigger the reaction
                shippingMethodId: this.shippingMethodId,
                paymentMethodId: this.paymentMethodId,
            }),
            (data) => {
                localStorage.setItem('cartItems', JSON.stringify(data.cartItems));
                localStorage.setItem('shippingMethodId', String(data.shippingMethodId));
                localStorage.setItem('paymentMethodId', String(data.paymentMethodId));
            }
        );
    }

    setShowLoginForm = (state: boolean) => {
        this.showLoginForm = state;
    }

    get productIds(): number[] {
        return this.cartItems.map(item => item.productId);
    }

    addItemToCart = (productId: number, quantity: number) => {
        const existingItem = this.cartItems.find(item => item.productId === productId);
    
        if (existingItem) {
            existingItem.quantity += quantity;
            toast.success("Quantity increased in cart");
            this.saveToLocalStorage();
        } else {
            this.cartItems.push({ productId, quantity });
            toast.success("Item added to cart");
        }

        if (!this.shippingMethodId)
            this.shippingMethodId = store.shippingPaymentStore.shippingMethods[0].id;

        if (!this.paymentMethodId)
            this.paymentMethodId = store.shippingPaymentStore.paymentMethods[0].id;
    }

    deleteItemFromCart = (productId: number) => {
        this.cartItems = this.cartItems.filter(item => item.productId !== productId);
    }

    setShippingMethod = (methodId: number) => {
        this.shippingMethodId = methodId;
    }

    setPaymentMethod = (methodId: number) => {
        this.paymentMethodId = methodId;
    }

    changeQuantity = (productId: number, newQuantity: number) => {
        const existingItem = this.cartItems.find(item => item.productId === productId);

        if (existingItem) {
            existingItem.quantity = Math.max(newQuantity, 0);
            toast.success("Quantity updated");
            this.saveToLocalStorage();
        } else {
            toast.error("Product not found in cart");
        }
    }

    get totalValue() {
        let value = 0;
        this.cartItems.forEach((item) => {
            const price = store.productStore.productPrice(item.productId);
            if (price) 
                value += price * item.quantity;
        })

        const shippingPrice = this.getShippingPrice();
        if (shippingPrice)
            value += shippingPrice;

        return value;
    }

    get totalValueWithTax() {
        let value = 0;
        this.cartItems.forEach((item) => {
            const price = store.productStore.productPriceWithTax(item.productId);
            if (price) 
                value += price * item.quantity;
        })

        const shippingPrice = this.getShippingPrice();
        if (shippingPrice)
            value += shippingPrice;

        return value;
    }

    calculateTotalValues = (discount: number) => {
        const discountedTotal = this.totalValue * (1 - discount);
        const discountedTotalWithTax = this.totalValueWithTax * (1 - discount);
    
        return {
          total: Math.floor(this.totalValue * 100) / 100,
          discountedTotal: Math.floor(discountedTotal * 100) / 100,
          totalWithTax: Math.floor(this.totalValueWithTax * 100) / 100,
          discountedTotalWithTax: Math.floor(discountedTotalWithTax * 100) / 100
        };
      };

    private getShippingPrice(): number {
        if (this.shippingMethodId)
        {
            const shippingPrice = store.shippingPaymentStore.shippingMethodPrice(this.shippingMethodId);
            if (shippingPrice)
                return shippingPrice;
        }

        return 0;
    }

    createOrder = async () => {
        this.subbmiting = true;
        try {
            const orderData: CreateOrder = {
                paymentMethodId: this.paymentMethodId,
                shippingMethodId: this.shippingMethodId,
                items: this.cartItems,
            };

            const orderId = await agent.Orders.create(orderData);
            toast.success(`Order created successfully. Order ID: ${orderId}`);
            this.resetCart();
            runInAction(async() => store.userStore.accountDetails?.orders.push(await agent.Orders.getDetails(orderId)));
        } catch (error) {
            console.error('Error creating order:', error);
            toast.error("Failed to crate order.");
        } finally {
            runInAction(() => this.subbmiting = false);
        }
    }

    resetCart = () => {
        this.cartItems = [];
        this.shippingMethodId = undefined;
        this.paymentMethodId = undefined;
    }

    private loadFromLocalStorage() {
        // Load cart data from localStorage
        const storedCartItems = localStorage.getItem('cartItems');
        const storedShippingMethodId = localStorage.getItem('shippingMethodId');
        const storedPaymentMethodId = localStorage.getItem('paymentMethodId');

        if (storedCartItems) {
            this.cartItems = JSON.parse(storedCartItems);
        }

        if (storedShippingMethodId) {
            this.shippingMethodId = Number(storedShippingMethodId);
        }

        if (storedPaymentMethodId) {
            this.paymentMethodId = Number(storedPaymentMethodId);
        }
    }

    saveToLocalStorage = () => {
        localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    }
}