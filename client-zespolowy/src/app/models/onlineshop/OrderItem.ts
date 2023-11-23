import { Product } from "./Product";

export interface OrderItem {
    quantity: number;
    product: Product;
}

export interface OrderItemNewQuantity {
    productId: number;
    quantity: number;
}