import { Form, Formik, FormikHelpers } from "formik";
import { observer } from "mobx-react-lite"
import * as Yup from "yup";
import TextInput from "../../common/formInputs/TextInput";
import { ProductFormValues } from "../../../app/models/onlineshop/Product";
import NumberInput from "../../common/formInputs/NumberInput";
import { taxRateOptions } from "../../../app/models/options/TaxRateOptions";
import SelectInput from "../../common/formInputs/SelectInput";
import { useStore } from "../../../app/stores/store";
import Loading from "../../common/Loading";
import { useEffect } from "react";
import { enumToOptions } from "../../../app/models/options/Option";
import { ProductStatus } from "../../../app/models/enums/ProductStatus";
import TextAreaInput from "../../common/formInputs/TextAreaInput";

interface Props {
    onSubmit: (product: ProductFormValues, formikHelpers: FormikHelpers<ProductFormValues>) => void;
    buttonText: string;
    product?: ProductFormValues;
    editMode?: boolean;
}

export const ProductForm = observer(
    ({onSubmit, product, buttonText}: Props) => {

    const {categoryStore, expertsStore, commonStore} = useStore();
    const {loadCategories, categories, categoriesAsOptions} = categoryStore;
    const {loadExperts, experts, expertsAsOptions} = expertsStore;
    const {initialLoading} = commonStore;  

    const validationSchema = Yup.object({
      name: Yup.string().required('Name is required'),
      description: Yup.string().required('Description is required'),
      price: Yup.number().required('Price is required').min(0, 'Price must be greater than or equal to 0'),
      taxRate: Yup.string().required('Tax Rate is required'),
      categoryId: Yup.string().required('Category is required'),
      productExpertId: Yup.string().required('Product Expert is required'),
      status: Yup.string().required('Status is required'),
      currentStock: Yup.number().required('Stock is required').min(0, 'Stock must be greater than or equal to 0'),
    });

    // on load
    useEffect(() => {
      if (categories.length == 0)
        loadCategories();

      if (experts.length == 0)
        loadExperts();

    }, [categories, loadCategories, experts, loadExperts])

    if (initialLoading) return <div className="text-center"><Loading/></div>

    return (
    <>
        <Formik
          initialValues={product!}
          validationSchema={validationSchema}
          onSubmit={(values, formikHelpers) => onSubmit(values, formikHelpers)}
        >
        {({ isValid, dirty, isSubmitting }) => {
          return(
          <Form >
            {/* Name */}
            <div className="my-2">
                <b><TextInput placeholder="Product name" name="name" label="Name"/></b>
            </div>

            {/* Description */}
            <div className="my-2">
                <b><TextAreaInput placeholder="Description" name="description" label="Description" rows={2}/></b>
            </div>

            {/* Price */}
            <div className="my-2">
                <b><NumberInput placeholder="Price" name="price" label="Price"/></b>
            </div>

            {/* TaxRate - select */}
            <div className="my-2">
              <b><SelectInput label="Tax Rate" name="taxRate" options={taxRateOptions}/></b>
            </div>

            {/* Category - select */}
            <div className="my-2">
                <b><SelectInput label="Category" name="categoryId" options={categoriesAsOptions}/></b>
            </div>

            {/* Expert - select */}
            <div className="my-2">
                <b><SelectInput label="Product Expert" name="productExpertId" options={expertsAsOptions}/></b>
            </div>

            {/* Status - select */}
            <div className="my-2">
                <b><SelectInput label="Status" name="status" options={enumToOptions(ProductStatus)}/></b>
            </div>

            {/* CurrentStock */}
            <div className="my-2">
                <b><NumberInput placeholder="Current stock" name="currentStock" label="Stock"/></b>
            </div>

            {/* Button */}
            <div className="text-center my-5">
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