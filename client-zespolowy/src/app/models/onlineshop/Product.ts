import { Discount } from "./Discount";

export interface Product {
    id: number,
    name: string,
    description: string,
    price: number,
    photo: string,
    taxrate: number,
    quantity: number,

    discount?: Discount,
}