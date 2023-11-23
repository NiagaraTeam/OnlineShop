import { CategoryStatus } from "../enums/CategoryStatus";

export interface Category {
    id: number;
    name: string;
    parentCategoryId?: number;
    status: CategoryStatus;
}

export interface CategoryTree {
    id: number;
    name: string;
    parentCategoryId?: number;
    status: CategoryStatus;

    childCategories: CategoryTree[];
}