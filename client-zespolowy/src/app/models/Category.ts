import { CategoryStatus } from "./enums/CategoryStatus";

export interface Category {
    id: number;
    name: string;
    parentCategoryId?: number;
    status: CategoryStatus;
}