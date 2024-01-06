import { observer } from "mobx-react-lite"
import { useStore } from "../../../app/stores/store";
import { useState } from "react";
import { LoadingState } from "../../../app/models/common/LoadingState";
import EditDeleteButtons from "../../common/EditDeleteButtons";
import { CategoryForm } from "../forms/CategoryForm";
import { Category } from "../../../app/models/onlineshop/Category";
import { FormikHelpers } from "formik";

export const ManageCategoriesPage = observer(() => {
  const {categoryStore} = useStore();
  const {categories, deleteCategory, createCategory} = categoryStore;

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

  return (
    <div className="m-3">
      <div className="row">

        <div className="col-lg-5">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="my-4">
              Categories
            </h2>
          </div>
          <ul className="list-group">
            {categories.map((category) => (
              <li key={category.id} className="list-group-item d-flex justify-content-between align-items-center">
                {category.name}
                <EditDeleteButtons
                  loading={loading[category.id]}
                  showEdit={false}
                  deleteAction={() => handleDelete(category.id)}
                  size={25}
                />
              </li>
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