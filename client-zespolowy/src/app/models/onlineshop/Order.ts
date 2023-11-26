import { OrderStatus } from "../enums/OrderStatus";
import { OrderItem } from "./OrderItem";
import { PaymentMethod } from "./PaymentMethod";
import { ShippingMethod } from "./ShippingMethod";

export interface Order {
    id: number;
    orderDate: Date;
    status: OrderStatus;
    paymentMethod: PaymentMethod;
    shippingMethod: ShippingMethod;
    items: OrderItem[];
}