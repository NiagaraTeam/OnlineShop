import { ProductStatus } from "../enums/ProductStatus";
import { Category } from "./Category";
import { Photo } from "./Photo";
import { ProductInfo } from "./ProductInfo";
import { ProductDiscount } from "./ProductDiscount";
import { ProductExpert } from "./ProductExpert";

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    taxRate: number;
    createdAt: Date;
    modificationDate: Date;
    status: ProductStatus;
    productInfo: ProductInfo;
    photo: Photo;
    category: Category;
    productExpert: ProductExpert;
    productDiscounts: ProductDiscount[];
}