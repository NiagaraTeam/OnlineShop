import { OrderStatus } from "../enums/OrderStatus";
import { AccountDetails } from "./AccountDetails";
import { CartItem } from "./Cart";
import { OrderItem } from "./OrderItem";
import { PaymentMethod } from "./PaymentMethod";
import { ShippingMethod } from "./ShippingMethod";

export interface Order {
    id: number;
    orderDate: Date;
    status: OrderStatus;
    paymentMethod: PaymentMethod;
    shippingMethod: ShippingMethod;
    userDetails: AccountDetails;
    items: OrderItem[];
}

export interface CreateOrder {
    paymentMethodId: number,
    shippingMethodId: number,
    items: CartItem[],
}