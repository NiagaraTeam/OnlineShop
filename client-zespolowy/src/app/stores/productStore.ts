import { makeAutoObservable, runInAction } from "mobx";
import { Product } from "../models/onlineshop/Product";
import { store } from "./store";
import agent from "../api/agent";
import { toast } from "react-toastify";
import { ProductStatus } from "../models/enums/ProductStatus";

export default class ProductStore {
    productsRegistry = new Map<number,Product>();
    selectedProduct: Product | undefined = undefined;
    
    constructor() {
        makeAutoObservable(this);
    }

    get products() {
        return Array.from(this.productsRegistry.values());
    }

    // tutaj trzeba dodać konwertowanie czasu
    private setProduct = (product: Product) => {
        this.productsRegistry.set(product.id, product);
    }

    private getProduct = (id: number) => {
        return this.productsRegistry.get(id);
    }

    //zmienić jak będzie zrobiony endpoint pobierający liste produktów 
    //(z filtrowaniem i paginacją)
    loadProducts = async () => {
        store.commonStore.setInitialLoading(true);
        try {
            const produtcs = await agent.Products.getNewest();
            produtcs.forEach(
                product => this.setProduct(product)
            );
            runInAction(() => store.commonStore.setInitialLoading(false))
        } catch (error) {
            console.log(error);
            toast.error('Failed to load products');
        } finally {
            runInAction(() => store.commonStore.setInitialLoading(false))
        }
    }

    loadProduct = async (id: number) => {
        store.commonStore.setInitialLoading(true);

        let product = this.getProduct(id);

        if (product) {
            this.selectedProduct = product;
            store.commonStore.setInitialLoading(false)
            return product;
        } else {
            try {
                product = await agent.Products.getDetails(id);
                this.setProduct(product);
                runInAction(() => this.selectedProduct = product)
                return product;
            } catch (error) {
                console.log(error);
                toast.error('Failed to load product');
            } finally {
                runInAction(() => store.commonStore.setInitialLoading(false)); 
            }
        }
    }

    deleteProduct = async (id: number) => {
        await this.changeStatus(id, ProductStatus.Deleted);
    }

    changeStatus = async (id:number, status: ProductStatus) => {
        if (this.selectedProduct)
        {
            this.selectedProduct.status = status;
            this.selectedProduct.modificationDate = new Date();
        }
        try {
            await agent.Products.changeStatus(id, status);
            runInAction(() => {
                if (status === ProductStatus.Deleted)
                {
                    this.productsRegistry.delete(id);
                    toast.success(`Product deleted`);
                }
                else
                {
                    //not using this.setProduct(product) on purpose
                    //product object is not from db so dont need 
                    //to deal w date and time
                    this.productsRegistry.set(id, this.selectedProduct as Product);
                }
            })                
        } catch (error) {
            console.log(error);
            toast.error(`Failed to change product status`);
        }
    }

}