import { makeAutoObservable, runInAction } from "mobx";
import { Category, CategoryTree } from "../models/onlineshop/Category";
import { Option } from "../models/options/Option";
import { store } from "./store";
import agent from "../api/agent";
import { toast } from "react-toastify";

export default class CategoryStore {
    categoryRegistry = new Map<number, CategoryTree>();
    categoryTree: CategoryTree | undefined = undefined;

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
        const categoryTree = {
            id: category.id,
            name: category.name,
            parentCategoryId: category.parentCategoryId,
            status: category.status,
            childCategories: []
        }
        this.categoryRegistry.set(category.id, categoryTree);
    }

    loadCategories = async () => {
        try {
            this.categoryRegistry.clear();
            const categoryTree = await agent.Categories.getCategoryTree();
            this.convertAndSetCategories(categoryTree);
            runInAction(() => {
                store.commonStore.setInitialLoading(false);
                this.categoryTree = categoryTree;
            });
        } catch (error) {
            console.log(error);
            toast.error('Failed to load categories');
        }
    };

    private convertAndSetCategories = (categoryTree: CategoryTree) => {
        const convertCategoryTree = (tree: CategoryTree): CategoryTree => {
            return {
                id: tree.id,
                name: tree.name,
                parentCategoryId: tree.parentCategoryId,
                status: tree.status,
                childCategories: tree.childCategories
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
            const id = await agent.Categories.create(category);
            runInAction(() => {
                category.id = id;
                this.setCategory(category);
                this.addToCategoryTree(category);
            });

            toast.success("Category created");
        } catch (error) {
            console.log(error);
            toast.error("Failed to create category");
        }
    }

    addToCategoryTree = (category: Category) => {
        const addToTree = (parent: CategoryTree) => {
            if (parent.id == category.parentCategoryId) {
                const node: CategoryTree = {
                    id: category.id,
                    name: category.name,
                    parentCategoryId: category.parentCategoryId,
                    status: category.status,
                    childCategories: [],
                };
                parent.childCategories.push(node);
                return;
            } else {
                for (const child of parent.childCategories) 
                    addToTree(child);
            }
        };

        addToTree(this.categoryTree!);
    };

    deleteCategory = async (categoryId: number) => { 
        try {
            await agent.Categories.delete(categoryId);

            runInAction(() => {
                this.categoryRegistry.delete(categoryId);
                this.removeFromCategoryTree(categoryId);
            });   

            toast.success("Category deleted");
        } catch (error) {
            console.log(error);
        }
    }

    removeFromCategoryTree = (categoryId: number) => {
        const removeFromTree = (parent: CategoryTree, id: number) => {
            parent.childCategories = parent.childCategories.filter(
                (child) => child.id !== id
            );
            for (const child of parent.childCategories) {
                removeFromTree(child, id);
            }
        };

        if (this.categoryTree) {
            runInAction(() => {
                removeFromTree(this.categoryTree!, categoryId);
            });
        }
    }

}
