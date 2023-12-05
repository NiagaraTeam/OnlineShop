import { makeAutoObservable, reaction } from "mobx";
import { CartItem } from "../models/onlineshop/Cart";
import { toast } from "react-toastify";
import agent from "../api/agent";

export default class CartStore {
    cartItems: CartItem[] = [];
    shippingMethodId: number | null = null;
    paymentMethodId: number | null = null;
    
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

    // raczej się nie przyda
    get productIds(): number[] {
        return this.cartItems.map(item => item.productId);
    }

    addItemToCart = (productId: number, quantity: number) => {
        this.cartItems.push({productId, quantity});
        toast.success("Item added to cart");
    }

    deleteItemFromCart = (productId: number) => {
        this.cartItems = this.cartItems.filter(item => item.productId !== productId);
    }

    setShippingMethod = (methodId: number | null) => {
        this.shippingMethodId = methodId;
    }

    setPaymentMethod = (methodId: number | null) => {
        this.paymentMethodId = methodId;
    }

    createOrder = async () => {
        try {
            const orderData = {
                paymentMethodId: this.paymentMethodId,
                shippingMethodId: this.shippingMethodId,
                items: this.cartItems,
            };

            const orderId = await agent.Orders.create(orderData);

            toast.success(`Order created successfully. Order ID: ${orderId}`);
            this.resetCart();
        } catch (error) {
            console.error('Error creating order:', error);
            toast.error("Failed to crate order.");
        }
    }

    resetCart = () => {
        this.cartItems = [];
        this.shippingMethodId = null;
        this.paymentMethodId = null;
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
}