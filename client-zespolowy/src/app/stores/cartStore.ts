import { makeAutoObservable, reaction, runInAction } from "mobx";
import { CartItem } from "../models/onlineshop/Cart";
import { toast } from "react-toastify";
import agent from "../api/agent";
import { CreateOrder, Order } from "../models/onlineshop/Order";
import { store } from "./store";
import { roundValue } from "../utils/RoundValue";
import { router } from "../router/Routes";

export default class CartStore {
    cartItems: CartItem[] = [];
    shippingMethodId: number | undefined = undefined;
    paymentMethodId: number | undefined = undefined;

    unavailableItems: CartItem[] = [];

    showLoginForm: boolean = false;
    showDialog: boolean = false;
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

    setShowDialog = (state: boolean) => {
        this.showDialog = state;
    }

    get productIds(): number[] {
        return this.cartItems.map(item => item.productId);
    }

    setCartItems = (cartItems: CartItem[]) => {
        this.cartItems = cartItems;
    }

    addItemsFromOrder = (order: Order) => {
        order.items.forEach(
            (item) => this.addItemToCart(item.product.id, item.quantity)
        );
    }

    addItemToCart = (productId: number, quantity: number) => {
        const price = store.productStore.productPrice(productId);

        if (!price) {
            toast.info(`Product Unavailable ID: ${productId}`);
            return;
        }

        const existingItem = this.cartItems.find(item => item.productId === productId);
    
        if (existingItem) {
            this.changeQuantity(
                productId, 
                existingItem.quantity + quantity,
            )
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

        if (!existingItem){
            toast.error("Product not found in cart");
            return;
        }

        const product = store.productStore.getProduct(productId);

        if (product) {
            const maxStock = product.productInfo.currentStock;

            if (newQuantity > maxStock) {
                toast.info(`Quantity not increased. Maximum available quantity for product ID:${productId} is ${maxStock}.`);
                return;
            }

            existingItem.quantity = Math.max(newQuantity, 0);
            existingItem.quantity = Math.min(newQuantity, maxStock);
            
            toast.success("Quantity changed");
            this.saveToLocalStorage();
        } else {
            toast.error("Product not found in cart");
        }
    }

    get totalValue()  {
        let value = 0;
        this.cartItems.forEach((item) => {
            const price = store.productStore.productPrice(item.productId);
            if (price) 
                value += price * item.quantity;
            else
            {
                this.deleteItemFromCart(item.productId);
                toast.info(`Product with id: ${item.productId} is Unavailable. Removed from cart.`);
            }
                
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
            else 
            {
                this.deleteItemFromCart(item.productId);
                toast.info(`Product with id: ${item.productId} is Unavailable. Removed from cart.`);
            }
                
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
          total: roundValue(this.totalValue, 2),
          discountedTotal: roundValue(discountedTotal, 2),
          totalWithTax: roundValue(this.totalValueWithTax, 2),
          discountedTotalWithTax: roundValue(discountedTotalWithTax, 2),
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
                paymentMethodId: this.paymentMethodId!,
                shippingMethodId: this.shippingMethodId!,
                items: this.cartItems,
            };

            const orderId = await agent.Orders.create(orderData);
            toast.success(`Order created successfully. Order ID: ${orderId}`);
            this.resetCart();
            runInAction(async () => {
                const orderDetails = await agent.Orders.getDetails(orderId);
              
                // Access the observable state and update it within the action
                if (store.userStore.accountDetails) {
                  store.userStore.addOrder(orderDetails);
                }
              });
        } catch (error) {
            console.error('Error creating order:', error);
            toast.error("Failed to crate order.");
        } finally {
            runInAction(() => this.subbmiting = false);
        }
    }

    tryCreateOrder = async () => {
        try {
            const orderData: CreateOrder = {
                paymentMethodId: this.paymentMethodId!,
                shippingMethodId: this.shippingMethodId!,
                items: this.cartItems,
            };
            
            const unavailableItems = await agent.Orders.checkItemsAvailability(orderData);
            
            runInAction(() => {
                if (unavailableItems.length > 0)
                {
                    this.unavailableItems = unavailableItems;
                    this.setShowDialog(true);
                }
                else
                {
                    this.createOrder().then(() => {
                        this.setShowDialog(false);
                        router.navigate('/account');
                    });
                }
                    
            });
        } catch (error) {
            console.error('Error while checking availability', error);
        }
    }

    removeUnavailableItems = () => {
        // Filter out items that are unavailable or have a quantity less than in unavailableItems
        const updatedCartItems = this.cartItems.filter(cartItem => {
            const unavailableItem = this.unavailableItems.find(unavailable => unavailable.productId === cartItem.productId);

            if (unavailableItem) {
                // If quantity in unavailableItems is less than in cartItems, decrease the quantity
                if (unavailableItem.quantity < cartItem.quantity) {
                    cartItem.quantity -= unavailableItem.quantity;
                    return true; // Keep the item in cartItems
                } else {
                    return false; // Remove the item from cartItems
                }
            }

            return true; // Keep items that are not in unavailableItems
        });

        // Update the cartItems with the filtered items
        this.setCartItems(updatedCartItems);
        this.unavailableItems = [];

        // Close the dialog
        this.setShowDialog(false);
    };

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