import { AccountStatus } from "../enums/AccountStatus";
import { Address } from "./Address";
import { Order } from "./Order";

export interface AccountDetails {
    id: string;
    userName: string;
    email: string;
    status: AccountStatus;
    discountValue: number;
    newsletter: boolean;
    orders: Order[];
    address: Address;
}