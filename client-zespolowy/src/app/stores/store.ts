import { createContext, useContext } from "react";
import CommonStore from "./commonStore";
import UserStore from "./userStore";
import ProductStore from "./productStore";
import ShippingPaymentStore from "./shippingPaymentStore";

interface Store {
    commonStore: CommonStore;
    userStore: UserStore;
    productStore: ProductStore;
    shippingPaymentStore: ShippingPaymentStore;
}

export const store: Store = {
    commonStore: new CommonStore(),
    userStore: new UserStore(),
    productStore: new ProductStore(),
    shippingPaymentStore: new ShippingPaymentStore()
}

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}