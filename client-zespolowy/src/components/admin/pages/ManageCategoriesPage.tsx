import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import { ReactNode, useState } from "react";
import { LoadingState } from "../../../app/models/common/LoadingState";
import { CategoryForm } from "../forms/CategoryForm";
import { Category, CategoryTree } from "../../../app/models/onlineshop/Category";
import { FormikHelpers } from "formik";
import React from "react";
import { FaClipboardList } from "react-icons/fa";
import { BsDownload, BsTrash } from "react-icons/bs";
import MyTooltip from "../../common/MyTooltip";
import { Helmet } from "react-helmet-async";

export const ManageCategoriesPage = observer(() => {
  const { categoryStore, productStore: { downloadData } } = useStore();
  const { categoryTree, deleteCategory, createCategory } = categoryStore;

  // delete
  const [loading, setLoading] = useState<LoadingState>({});

  const handleDelete = (id: number) => {
    setLoading((prevLoading) => ({
      ...prevLoading,
      [id]: true,
    }));
    deleteCategory(id).finally(() => {
      setLoading((prevLoading) => ({
        ...prevLoading,
        [id]: false,
      }));
    });
  };

  // create
  const handleCreate = (category: Category, formikHelpers: FormikHelpers<Category>) => {
    createCategory(category).then(() => formikHelpers.resetForm());
  };

  const renderCategory = (category: CategoryTree, level: number = 0) => {
    const indentation = level * 40;
    return (
      <>
        <li
          className="list-group-item d-flex justify-content-between align-items-center"
          style={level !== 0 ? { paddingLeft: `${indentation}px` } : {}}
        >
          {category.name}
          <div className="d-flex ">
            <MyTooltip placement="left" text={"Download price list"}>
              <BsDownload
                className="mx-2 hover-primary"
                size={25}
                onClick={() => downloadData(category.id)}
              />
            </MyTooltip>
            <button
              className="btn btn-danger mx-2 hover-danger"
              onClick={() => handleDelete(category.id)}
              title="Delete category"
            >
              Delete
            </button>
          </div>
        </li>
        {category.childCategories.length > 0 && (
          <>
            {category.childCategories.map((childCategory): ReactNode => (
              <React.Fragment key={childCategory.id}>
                {renderCategory(childCategory, level + 1)}
              </React.Fragment>
            ))}
          </>
        )}
      </>
    );
  };

  return (
    <div className="m-3">
      <Helmet>
        <title>Categories - BeautyShop</title>
      </Helmet>
      <div className="row ">
        <div className="">
          <div className="text-center">
            <h2 className="my-4 ">CATEGORIES</h2>
          </div>
          <ul className="list-group">
            {categoryTree && categoryTree.childCategories.map((category) => (
              <React.Fragment key={category.id}>
                {renderCategory(category)}
              </React.Fragment>
            ))}
          </ul>
        </div>

        <div className="">
          <h4 className="my-4 text-center">Create Category</h4>
          <CategoryForm onSubmit={handleCreate} buttonText="Add" />
        </div>
      </div>
    </div>
  );
});
