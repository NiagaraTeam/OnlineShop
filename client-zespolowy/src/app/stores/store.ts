import { createContext, useContext } from "react";
import CommonStore from "./commonStore";
import UserStore from "./userStore";
import ProductStore from "./productStore";

interface Store {
    commonStore: CommonStore;
    userStore: UserStore;
    productStore: ProductStore
}

export const store: Store = {
    commonStore: new CommonStore(),
    userStore: new UserStore(),
    productStore: new ProductStore()
}

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}