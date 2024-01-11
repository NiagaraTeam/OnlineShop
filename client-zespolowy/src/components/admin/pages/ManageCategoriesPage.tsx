import { observer } from "mobx-react-lite"
import { useStore } from "../../../app/stores/store";
import { ReactNode, useState } from "react";
import { LoadingState } from "../../../app/models/common/LoadingState";
import EditDeleteButtons from "../../common/EditDeleteButtons";
import { CategoryForm } from "../forms/CategoryForm";
import { Category, CategoryTree } from "../../../app/models/onlineshop/Category";
import { FormikHelpers } from "formik";
import React from "react";
import { FaClipboardList } from "react-icons/fa";
import MyTooltip from "../../common/MyTooltip";
import { Helmet } from "react-helmet-async";

export const ManageCategoriesPage = observer(() => {
  const {categoryStore, productStore: {downloadData}} = useStore();
  const {categoryTree, deleteCategory, createCategory} = categoryStore;

  // delete
  const [loading, setLoading] = useState<LoadingState>({});
  
  const handleDelete = (id: number) => {
    setLoading((prevLoading) => ({
      ...prevLoading,
      [id]: true,
    }));
    deleteCategory(id)
      .finally(() => {
        setLoading((prevLoading) => ({
          ...prevLoading,
          [id]: false,
        }));
      });
  };

  // create
  const handleCreate = (category: Category, formikHelpers: FormikHelpers<Category>) => {
    createCategory(category)
      .then(() => formikHelpers.resetForm());
  };

  const renderCategory = (category: CategoryTree, level: number = 0) => {
    const indentation = level * 40;
    return (
      <>
        <li
          className="list-group-item d-flex justify-content-between align-items-center" 
          style={level !== 0 ? { paddingLeft: `${indentation}px` }: {}}
        >
          {category.name}
          <div className="d-flex ">
            <MyTooltip placement="left" text={"Dowload price list"}>
              <FaClipboardList
                  className="mx-2 hover-primary"
                  size={25}
                  onClick={() => downloadData(category.id)}
              />
            </MyTooltip>
            <EditDeleteButtons
              loading={loading[category.id]}
              showEdit={false}
              deleteAction={() => handleDelete(category.id)}
              size={25}
            />
          </div>
        </li>
        {category.childCategories.length > 0 && (
        <>
          {category.childCategories.map((childCategory): ReactNode =>
            <React.Fragment key={childCategory.id}>
              {renderCategory(childCategory, level + 1)}
            </React.Fragment>
          )}
        </>
        )}
      </>
    );
  };

  return (
    <div className="m-3">
      <Helmet>
          <title>Categories - OnlineShop</title>
      </Helmet>
      <div className="row">

        <div className="col-lg-5">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="my-4">
              Categories
            </h2>
          </div>
          <ul className="list-group">
            {categoryTree && categoryTree.childCategories.map((category) => (
              <React.Fragment key={category.id}>
                {renderCategory(category)}
              </React.Fragment>
            ))}
          </ul>
        </div>
      
        <div className="col-lg-5 offset-lg-2">
            <h2 className="my-4">
              Create Category
            </h2>
            <CategoryForm onSubmit={handleCreate} buttonText="Add" />
        </div>
      
      </div>
    </div>
  )
})