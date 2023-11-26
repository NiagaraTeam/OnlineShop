import { createContext, useContext } from "react";
import CommonStore from "./commonStore";
import UserStore from "./userStore";
import ProductStore from "./productStore";
import ShippingPaymentStore from "./shippingPaymentStore";
import CategoryStore from "./categoryStore";
import ExpertsStore from "./expertsStore";

interface Store {
    commonStore: CommonStore;
    userStore: UserStore;
    productStore: ProductStore;
    shippingPaymentStore: ShippingPaymentStore;
    categoryStore: CategoryStore;
    expertsStore: ExpertsStore;
}

export const store: Store = {
    commonStore: new CommonStore(),
    userStore: new UserStore(),
    productStore: new ProductStore(),
    shippingPaymentStore: new ShippingPaymentStore(),
    categoryStore: new CategoryStore(),
    expertsStore: new ExpertsStore(),
}

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}