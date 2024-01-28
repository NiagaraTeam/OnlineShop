import { observer } from "mobx-react-lite";
import { Category } from "../../../app/models/onlineshop/Category";
import * as Yup from "yup";
import { Form, Formik, FormikHelpers } from "formik";
import { CategoryStatus } from "../../../app/models/enums/CategoryStatus";
import TextInput from "../../common/formInputs/TextInput";
import { useStore } from "../../../app/stores/store";
import { useEffect } from "react";
import SelectInput from "../../common/formInputs/SelectInput";

interface Props {
    onSubmit: (method: Category, formikHelpers: FormikHelpers<Category>) => void;
    buttonText: string;
    category?: Category;
}

export const CategoryForm = observer(
    ({onSubmit, category, buttonText}: Props) => 
{
    const {categoryStore} = useStore();
    const {loadCategories, categories, categoriesAsOptions} = categoryStore;

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        parentCategoryId: Yup.string().required('Parent category is required'),
    });

    // on load
    useEffect(() => {
        if (categories.length == 0)
            loadCategories();
    }, [categories, loadCategories])

    return (
    <>
        <Formik
          initialValues={category ? category : {
            id: 0,
            name: '',
            parentCategoryId: 1,
            status: CategoryStatus.Visible
          }}
          validationSchema={validationSchema}
          onSubmit={(values, formikHelpers) => onSubmit(values, formikHelpers)}
        >
        {({ isValid, dirty, isSubmitting }) => {
          return(
          <Form >
            {/* Name */}
            <div className="my-2">
            <b><TextInput placeholder="Category name" name="name" label="Name"/></b>
            </div>

            {/* Parent Category - select */}
            <div className="my-2">
            <b><SelectInput label="Parent Category" name="parentCategoryId" options={categoriesAsOptions}/></b>
            </div>
            
            {/* Button */}
            <div className="text-center my-4">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!(dirty && isValid) || isSubmitting}
              >
                {buttonText}
              </button>
            </div>

          </Form>
          )
        }}
        </Formik>
      </>
  )
})