import { makeAutoObservable, runInAction } from "mobx";
import { ProductExpert } from "../models/onlineshop/ProductExpert";
import { Option } from "../models/options/Option";
import { store } from "./store";
import agent from "../api/agent";
import { toast } from "react-toastify";

export default class ExpertsStore {
    productExpertsRegistry = new Map<number, ProductExpert>();

    constructor() {
        makeAutoObservable(this);
    }

    get experts() {
        return Array.from(this.productExpertsRegistry.values());
    }

    get expertsAsOptions(): Option[] {
        return this.experts.map(expert => ({
          value: expert.id,
          text: `${expert.firstName} ${expert.lastName}`,
        }));
      }

    private setProductExpert = (expert: ProductExpert) => {
        this.productExpertsRegistry.set(expert.id, expert);
    }

    loadExperts = async () => {
        try {
            this.productExpertsRegistry.clear();
            const experts = await agent.Products.getProductsExperts();
            experts.forEach(expert => this.setProductExpert(expert));
            runInAction(() => store.commonStore.setInitialLoading(false));
        } catch (error) {
            console.log(error);
            toast.error('Failed to load products experts');
        }
    }
    
}