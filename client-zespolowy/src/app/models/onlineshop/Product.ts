import { ProductStatus } from "../enums/ProductStatus";
import { Category } from "./Category";
import { Photo } from "./Photo";
import { ProductInfo } from "./ProductInfo";
import { ProductDiscount } from "./ProductDiscount";
import { ProductExpert } from "./ProductExpert";
import { roundValue } from "../../utils/RoundValue";

export class Product {
    constructor(
        public id: number,
        public name: string,
        public description: string,
        public price: number,
        public taxRate: number,
        public createdAt: Date,
        public modificationDate: Date,
        public status: ProductStatus,
        public productInfo: ProductInfo,
        public photo: Photo,
        public category: Category,
        public productExpert: ProductExpert,
        public productDiscounts: ProductDiscount[]
    ) {}

    // Funkcja sprawdzająca, czy jest aktualna promocja na produkt
    static isOnSale(product: Product): boolean {       
        const currentDate = new Date();
        return product.productDiscounts.some(
            (discount) => currentDate >= discount.start && currentDate <= discount.end
        );
    }

    // Funkcja pobierająca discount value i zwracająca zniżoną cenę
    static getDiscountedPrice(product: Product): number {

        if (Product.isOnSale(product)) {
            const currentDiscount = product.productDiscounts.find((discount) => {
                const currentDate = new Date();
                return currentDate >= discount.start && currentDate <= discount.end;
            });

            if (currentDiscount) {
                return roundValue((product.price * (1 - currentDiscount.value)), 2);
            }
        }

        return product.price; // Jeśli brak promocji, zwracamy standardową cenę
    }
}

export class ProductFormValues {
    id?: number = undefined;
    name: string = '';
    description: string = '';
    price: number | null = null;
    taxRate: number = 23;
    categoryId: number = 1;
    productExpertId: number = 1;
    status: ProductStatus = ProductStatus.Available;
    currentStock: number | null = null;

    constructor(product?: ProductFormValues) {
        if (product) {
            this.id = product.id;
            this.name = product.name;
            this.description = product.description;
            this.price = product.price;
            this.taxRate = product.taxRate;
            this.categoryId = product.categoryId;
            this.productExpertId = product.productExpertId;
            this.status = product.status;
            this.currentStock = product.currentStock;
        }
    }

    static createFromProduct(product: Product): ProductFormValues {
        return new ProductFormValues({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            taxRate: product.taxRate,
            categoryId: product.category.id,
            productExpertId: product.productExpert.id,
            status: product.status,
            currentStock: product.productInfo.currentStock
        });
    }
}