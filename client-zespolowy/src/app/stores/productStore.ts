import { makeAutoObservable, runInAction } from "mobx";
import { Product, ProductFormValues } from "../models/onlineshop/Product";
import { store } from "./store";
import agent from "../api/agent";
import { toast } from "react-toastify";
import { ProductStatus } from "../models/enums/ProductStatus";
import { Pagination, PagingParams } from "../models/common/Pagination";

export default class ProductStore {
    productsRegistry = new Map<number,Product>();
    selectedProduct: Product | undefined = undefined;

    pagination: Pagination | null = null;
    pagingParams = new PagingParams();
    
    constructor() {
        makeAutoObservable(this);
    }

    setPagingParams = (pagingParams: PagingParams) => {
        this.pagingParams = pagingParams;
    }

    get axiosParams() {
        const params = new URLSearchParams();
        
        params.append('pageNumber', this.pagingParams.pageNumber.toString());
        params.append('pageSize', this.pagingParams.pageSize.toString());

        return params
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
            this.productsRegistry.clear();
            const result = await agent.Products.list(this.axiosParams);
            result.data.forEach(
                product => this.setProduct(product)
            );
            this.setPagination(result.pagination);
            runInAction(() => store.commonStore.setInitialLoading(false))
        } catch (error) {
            console.log(error);
            toast.error('Failed to load products');
        } finally {
            runInAction(() => store.commonStore.setInitialLoading(false))
        }
    }

    setPagination = (pagination: Pagination) => {
        this.pagination = pagination;
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

    createProduct = async (product: ProductFormValues) => {
        try {
            const createdProductId = await agent.Products.create(product);
    
            const createdProduct = await agent.Products.getDetails(createdProductId);
    
            runInAction(() => {
                this.setProduct(createdProduct);
            });
    
            runInAction(() => {
                this.selectedProduct = createdProduct;
            });
    
            toast.success('Product created successfully');
        } catch (error) {
            console.log(error);
            toast.error('Failed to create product');
        }
    };

}