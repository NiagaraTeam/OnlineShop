import { observer } from "mobx-react-lite"
import { useStore } from "../../../../app/stores/store";
import { useState } from "react";
import Loading from "../../../common/Loading";
import { ProductForm } from "../../forms/ProductForm";
import { FormikHelpers } from "formik";
import { ProductFormValues } from "../../../../app/models/onlineshop/Product";
import { DeletedProducts } from "./DeletedProducts";
import { Products } from "./Products";

export const ProductsPage = observer(() => {
    const {productStore, commonStore} = useStore();
    const {selectedProduct, createProduct, updateProduct} = productStore;
    const {initialLoading} = commonStore;

    // view logic
    const [showEditForm, setShowEditForm] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showDeletedProducts, setShowDeletedProducts] = useState(false);

    // edit
    function handleEdit(product: ProductFormValues, formikHelpers: FormikHelpers<ProductFormValues>): void {
        updateProduct(product.id!, product).then(() => {
            setShowEditForm(false);
            formikHelpers.resetForm();
        });
    }

    // create
    function handleCreate(product: ProductFormValues, formikHelpers: FormikHelpers<ProductFormValues>): void {
        createProduct(product).then(() => {
            formikHelpers.resetForm();
        });
    }

    // render component
    if (initialLoading) return <div className="text-center m-5"><Loading/></div>

    return (
        <div className="m-3">
            <div className="row">

                <div className="col-lg-6">

                    {!showDeletedProducts &&
                        <Products 
                            showCreateForm={showCreateForm} 
                            setShowCreateForm={setShowCreateForm} 
                            setShowEditForm={setShowEditForm} 
                            setShowDeletedProducts={setShowDeletedProducts}/>}
    
                    {showDeletedProducts &&
                        <DeletedProducts setShowDeletedProducts={setShowDeletedProducts}/>}
                        
                </div>
            
                <div className="col-lg-5 offset-lg-1">
                    
                    {showCreateForm &&
                    <>
                        <h2 className="my-4 d-flex justify-content-between align-items-center">
                            <span>Create Product</span>
                            <button className="btn btn-close" onClick={() => setShowCreateForm(false)}></button>
                        </h2>
                        <ProductForm onSubmit={handleCreate} buttonText="Create" product={new ProductFormValues()}/>
                    </>}

                    {showEditForm &&
                    <>
                        <h2 className="my-4 d-flex justify-content-between align-items-center">
                            <span>Edit Product</span>
                            <button className="btn btn-close" onClick={() => setShowEditForm(false)}></button>
                        </h2>
                        <ProductForm 
                            key={selectedProduct!.id} 
                            onSubmit={handleEdit} buttonText="Save" editMode={true}
                            product={ProductFormValues.createFromProduct(selectedProduct!)}
                        />
                    </>}
                    
                </div>
            
            </div>
        </div>    
    )
})