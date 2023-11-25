import { observer } from "mobx-react-lite"
import { useStore } from "../../../app/stores/store";
import { useEffect, useState } from "react";
import Loading from "../../common/Loading";
import EditDeleteButtons from "../../common/EditDeleteButtons";
import { LoadingState } from "../../../app/models/common/LoadingState";
import { ProductForm } from "../forms/ProductForm";
import { FormikHelpers } from "formik";
import { ProductFormValues } from "../../../app/models/onlineshop/Product";

export const ProductsPage = observer(() => {
    const {productStore, commonStore} = useStore();
    const {products, selectedProduct, loadProducts, deleteProduct, createProduct, loadProduct, updateProduct} = productStore;
    const {initialLoading} = commonStore;

    // view logic
    const [showEditForm, setShowEditForm] = useState(false);

    // on load
    useEffect(() => {
        if (products.length == 0)
            loadProducts();

    }, [loadProducts, products])

    // delete
    const [loading, setLoading] = useState<LoadingState>({});

    if (initialLoading) return <div className="text-center m-5"><Loading/></div>

    function handleDelete(id: number): void {
        setLoading((prevLoading) => ({
            ...prevLoading,
            [id]: true,
          }));
          deleteProduct(id)
            .finally(() => {
              setLoading((prevLoading) => ({
                ...prevLoading,
                [id]: false,
              }));
            });
    }

    // edit
    function displayEditForm(id: number): void {
        loadProduct(id)
            .then(() => setShowEditForm(true));
    }

    function handleEdit(product: ProductFormValues, formikHelpers: FormikHelpers<ProductFormValues>): void {
        updateProduct(product.id!, product).then(() => {
            setShowEditForm(false);
            formikHelpers.resetForm();
        });
    }

    // create
    function handleCreate(product: ProductFormValues, formikHelpers: FormikHelpers<ProductFormValues>): void {
        createProduct(product)
            .then(() => formikHelpers.resetForm());
    }

    return (
        <div className="m-3">
            <div className="row">

                <div className="col-lg-6">
                <div className="d-flex justify-content-between align-items-center">
                    <h2 className="my-4">
                    Products
                    </h2>
                </div>
                <ul className="list-group">
                    {products.map((product) => (
                    <li key={product.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <span>{product.name} ({product.category.name})</span>
                        <EditDeleteButtons
                        loading={loading[product.id]}
                        deleteAction={() => handleDelete(product.id)}
                        editAction={() => displayEditForm(product.id)}
                        size={25}
                        />
                    </li>
                    ))}
                </ul>
                </div>
            
                <div className="col-lg-5 offset-lg-1">
                    {!showEditForm 
                    ?
                    <>
                        <h2 className="my-4">
                        Create Product
                        </h2>
                        <ProductForm onSubmit={handleCreate} buttonText="Create" product={new ProductFormValues()}/>
                    </>
                    : 
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
                    </>
                    }
                </div>
            
            </div>
        </div>    
    )
})