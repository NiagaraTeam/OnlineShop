import { makeAutoObservable, runInAction } from "mobx";
import { Product, ProductFormValues } from "../models/onlineshop/Product";
import { store } from "./store";
import agent from "../api/agent";
import { toast } from "react-toastify";
import { ProductStatus } from "../models/enums/ProductStatus";
import { Pagination, PagingParams } from "../models/common/Pagination";

export default class ProductStore {
    productsRegistry = new Map<number,Product>();
    deletedProductsRegistry = new Map<number,Product>();
    selectedProduct: Product | undefined = undefined;

    topSoldProducts: Product[] = [];
    discoutedProducts: Product[] = [];
    newProducts: Product[] = [];
    favouriteProducts: Product[] = [];

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

    get deletedProducts() {
        return Array.from(this.deletedProductsRegistry.values());
    }

    private setProduct = (product: Product) => {
        this.productsRegistry.set(product.id, this.initializeDate(product));
    }

    private getProduct = (id: number) => {
        return this.productsRegistry.get(id);
    }

    private setDeletedProduct = (product: Product) => {
        this.deletedProductsRegistry.set(product.id, this.initializeDate(product));
    }

    private getDeletedProduct = (id: number) => {
        return this.deletedProductsRegistry.get(id);
    }

    initializeDate = (product: Product): Product => {
        product.createdAt = new Date(product.createdAt);
        product.modificationDate = new Date(product.modificationDate);

        product.productDiscounts.forEach((discout) => {
            discout.start = new Date(discout.start);
            discout.end = new Date(discout.end);
        })
        return product;
    }

    initializeDates = (products: Product[]): Product[] => {
        const initializedProducts: Product[] = [];

        products.forEach((product) => {
            initializedProducts.push(this.initializeDate(product));
        })

        return initializedProducts;
    }

    clearUserRelatedData = () => {
        this.favouriteProducts = [];
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
        let product = this.getProduct(id);

        if (product) {
            this.selectedProduct = product;
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
            }
        }
    }

    loadDeletedProducts = async () => {
        store.commonStore.setInitialLoading(true);
        try {
            this.deletedProductsRegistry.clear();
            const deletedProducts = await agent.Products.getDeleted();
            deletedProducts.forEach(
                product => this.setDeletedProduct(product)
            );
            runInAction(() => store.commonStore.setInitialLoading(false))
        } catch (error) {
            console.log(error);
            toast.error('Failed to load deleted products');
        } finally {
            runInAction(() => store.commonStore.setInitialLoading(false))
        }
    }

    loadHomePageProducts = async () => {
        store.commonStore.setInitialLoading(true);
        try {
            const topSold = await agent.Products.getTopPurchased();
            const discouted = await agent.Products.getDiscounted();
            const newest = await agent.Products.getNewest();

            runInAction(() => {           
                this.topSoldProducts = this.initializeDates(topSold);
                this.discoutedProducts = this.initializeDates(discouted);
                this.newProducts = this.initializeDates(newest);
                store.commonStore.setInitialLoading(false);
            });
        } catch (error) {
            console.log(error);
            toast.error('Failed to load home page products');
        } finally {
            runInAction(() => store.commonStore.setInitialLoading(false))
        }
    }

    deleteProduct = async (id: number) => {
        await this.changeStatus(id, ProductStatus.Deleted);
    }

    restoreProduct = async (id: number) => {
        await this.changeStatus(id, ProductStatus.Hidden);
    }

    changeStatus = async (id:number, status: ProductStatus) => {
        try {
            await agent.Products.changeStatus(id, status);
            runInAction(() => {
                this.moveProductBetweenRegistries(id, status);
                toast.success(`Product status changed`);
            })                
        } catch (error) {
            console.log(error);
            toast.error(`Failed to change product status`);
        }
    }

    createProduct = async (product: ProductFormValues) => {
        try {
            product.status = parseInt(product.status.toString());

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

    updateProduct = async (id: number, product: ProductFormValues) => {
        try {
            
            product.status = parseInt(product.status.toString());
            
            const updatedProduct = await agent.Products.update(id, product);

            runInAction(() => this.setProduct(updatedProduct));

            runInAction(() => {
                this.moveProductBetweenRegistries(id, product.status);
            });

            toast.success('Product updated');
        } catch (error) {
            console.log(error);
            toast.error('Failed to update product');
        }
    }

    deletePermanently = async (id: number) => {
        try {
            await agent.Products.deletePermanently(id);
            runInAction(() => {
                this.deletedProductsRegistry.delete(id);
            });
            toast.success(`Product permanently deleted`);
        } catch (error) {
            console.log(error);
            toast.error(`Failed to permanently delete product`);
        }
    }

    deleteAll = async () => {
        try {
            const deletedProductIds = Array.from(this.deletedProductsRegistry.keys());

            await Promise.all(deletedProductIds.map(async (productId) => {
                await agent.Products.deletePermanently(productId);
                runInAction(() => {
                    this.deletedProductsRegistry.delete(productId);
                });
            }));

            toast.success(`All deleted products permanently deleted`);
        } catch (error) {
            console.log(error);
            toast.error(`Failed to permanently delete all deleted products`);
        }
    }

    addToFavourites = async (userId: string, productId: number) => {
        try {
            await agent.Account.addFavouriteProduct(userId, productId);
            const product = await this.loadProduct(productId);
            runInAction(() => {
                this.favouriteProducts.push(product as Product);
            });
            toast.success(`Product added to favourites`);
        } catch (error) {
            console.log(error);
            toast.error(`Failed adding product to favourites`);
        }
    }

    removeFromFavourites = async (userId: string, productId: number) => {
        try {
            await agent.Account.removeFavouriteProduct(userId, productId);
            runInAction(() => {
                const index = this.favouriteProducts.findIndex(product => product.id === productId);

                if (index > -1) {
                    this.favouriteProducts.splice(index, 1);
                    toast.success(`Product removed from favourites`);
                } else {
                    toast.warning(`Product not found in favourites`);
                }       
            });
        } catch (error) {
            console.log(error);
            toast.error(`Failed removing product from favourites`);
        }
    }

    isProductInFavorites = (productId: number): boolean  => {
        const isFavorite = this.favouriteProducts.some(product => product.id === productId);
        return isFavorite;
    }

    private moveProductBetweenRegistries = (id: number, newStatus: ProductStatus) => {
        const productInRegistry = this.getProduct(id);
        const deletedProductInRegistry = this.getDeletedProduct(id);

        if (newStatus === ProductStatus.Deleted) {
            // Move to deletedProductsRegistry
            if (productInRegistry) {
                productInRegistry.status = ProductStatus.Deleted;
                productInRegistry.modificationDate = new Date();
                this.deletedProductsRegistry.set(id, productInRegistry);
                this.productsRegistry.delete(id);
            } else if (deletedProductInRegistry) {
                // Product is already in deletedProductsRegistry
                // You may choose to update the status or leave it as is
            }
        } else {
            // Move to productsRegistry
            if (deletedProductInRegistry) {
                deletedProductInRegistry.status = newStatus;
                deletedProductInRegistry.modificationDate = new Date();
                this.productsRegistry.set(id,deletedProductInRegistry);
                this.deletedProductsRegistry.delete(id);
            } else if (productInRegistry) {
                // Product is already in productsRegistry
                // You may choose to update the status or leave it as is
            }
        }
    }
}