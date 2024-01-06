import { makeAutoObservable, runInAction } from "mobx";
import { Category, CategoryTree } from "../models/onlineshop/Category";
import { Option } from "../models/options/Option";
import { store } from "./store";
import agent from "../api/agent";
import { toast } from "react-toastify";

export default class CategoryStore {
    categoryRegistry = new Map<number, Category>();

    constructor() {
        makeAutoObservable(this);
    }

    get categories() {
        return Array.from(this.categoryRegistry.values());
    }

    get categoriesAsOptions(): Option[] {
        return this.categories.map(category => ({
          value: category.id,
          text: category.name,
        }));
      }

    private setCategory = (category: Category) => {
        this.categoryRegistry.set(category.id, category);
    }

    loadCategories = async () => {
        try {
            this.categoryRegistry.clear();
            const categoryTree = await agent.Categories.getCategoryTree();
            this.convertAndSetCategories(categoryTree);
            runInAction(() => store.commonStore.setInitialLoading(false));
        } catch (error) {
            console.log(error);
            toast.error('Failed to load categories');
        }
    };

    private convertAndSetCategories = (categoryTree: CategoryTree) => {
        const convertCategoryTree = (tree: CategoryTree): Category => {
            return {
                id: tree.id,
                name: tree.name,
                parentCategoryId: tree.parentCategoryId,
                status: tree.status,
            };
        };
    
        const traverseAndConvert = (tree: CategoryTree) => {
            const convertedCategory = convertCategoryTree(tree);
            this.setCategory(convertedCategory);
    
            if (tree.childCategories && tree.childCategories.length > 0) {
                tree.childCategories.forEach((childTree) => traverseAndConvert(childTree));
            }
        };
    
        traverseAndConvert(categoryTree);
    };

    createCategory = async (category: Category) => { 
        try {
            console.log(category);
            const id = await agent.Categories.create(category);
            runInAction(() => {
                category.id = id;
                this.setCategory(category);
            });
            toast.success("Category created");
        } catch (error) {
            console.log(error);
            toast.error("Failed to create category");
        }
    }

    deleteCategory = async (categoryId: number) => { 
        try {
            await agent.Categories.delete(categoryId);

            runInAction(() => this.categoryRegistry.delete(categoryId));   

            toast.success("Category deleted");
        } catch (error) {
            console.log(error);
        }
    }

}
