import { observer } from "mobx-react-lite"
import { useStore } from "../../../app/stores/store";
import { useEffect, useState } from "react";
import Loading from "../../common/Loading";
import EditDeleteButtons from "../../common/EditDeleteButtons";
import { LoadingState } from "../../../app/models/common/LoadingState";
import { ProductForm } from "../forms/ProductForm";
import { FormikHelpers } from "formik";
import { ProductFormValues } from "../../../app/models/onlineshop/Product";
import RestoreDeleteButtons from "../../common/RestoreDeleteButtons";

export const ProductsPage = observer(() => {
    const {productStore, commonStore} = useStore();
    const {products, deletedProducts, selectedProduct, 
        loadProducts, loadDeletedProducts, deleteProduct, 
        createProduct, loadProduct, updateProduct,
        deleteAll, deletePermanently, restoreProduct} = productStore;
    const {initialLoading} = commonStore;

    // view logic
    const [showEditForm, setShowEditForm] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(true);
    const [showDeletedProducts, setShowDeletedProducts] = useState(false);

    // on load
    useEffect(() => {
        if (products.length == 0)
        {
            loadProducts();
            loadDeletedProducts();
        }          

    }, [loadProducts, loadDeletedProducts, products]);

    // delete
    const [loadingDelete, setLoadingDelete] = useState<LoadingState>({});
    const [loadingRestore, setLoadingRestore] = useState<LoadingState>({});

    function handleDelete(id: number): void {
        setLoadingDelete((prevLoading) => ({
            ...prevLoading,
            [id]: true,
          }));
          deleteProduct(id)
            .finally(() => {
              setLoadingDelete((prevLoading) => ({
                ...prevLoading,
                [id]: false,
              }));
            });
    }

    function handleDeletePermanently(id: number): void {
        setLoadingDelete((prevLoading) => ({
            ...prevLoading,
            [id]: true,
          }));
          deletePermanently(id)
            .finally(() => {
              setLoadingDelete((prevLoading) => ({
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
        createProduct(product).then(() => {
            formikHelpers.resetForm();
        });
    }

    // restore
    function handleRestore(id: number):void {
        setLoadingRestore((prevLoading) => ({
            ...prevLoading,
            [id]: true,
          }));
          restoreProduct(id)
            .finally(() => {
              setLoadingRestore((prevLoading) => ({
                ...prevLoading,
                [id]: false,
              }));
            });
    }

    // render component
    if (initialLoading) return <div className="text-center m-5"><Loading/></div>

    return (
        <div className="m-3">
            <div className="row">

                <div className="col-lg-6">

                    {!showDeletedProducts ?
                    <>
                        <div className="d-flex justify-content-between align-items-center">
                            <h2 className="my-4">
                            Products
                            </h2>
                            <div>
                                {!showCreateForm && 
                                <button className="btn btn-success mx-2" 
                                    onClick={() => setShowCreateForm(true)}>Create</button>
                                }
                                <button className="btn btn-secondary"
                                    onClick={() => setShowDeletedProducts(true)}>Deleted</button>
                            </div>
                        </div>

                        <ul className="list-group">
                            {products.map((product) => (
                            <li key={product.id} className="list-group-item d-flex justify-content-between align-items-center">
                                <span>{product.name} ({product.category.name})</span>
                                <EditDeleteButtons
                                    loading={loadingDelete[product.id]}
                                    deleteAction={() => handleDelete(product.id)}
                                    editAction={() => displayEditForm(product.id)}
                                    size={25}
                                />
                            </li>
                            ))}
                        </ul>
                        // to będzie wyświetlane w tabeli ładnej z filtrowaniem i paginacją
                    </> 
                    :
                    <>
                        <div className="d-flex justify-content-between align-items-center">
                            <h2 className="my-4">
                            Deleted products
                            </h2>
                            <div>
                                <button className="btn btn-danger mx-2"
                                    onClick={() => deleteAll()}>Delete all</button>
                                <button className="btn btn-secondary"
                                    onClick={() => setShowDeletedProducts(false)}>Cancel</button>
                            </div>
                        </div>

                        <ul className="list-group">
                            {deletedProducts.map((product) => (
                            <li key={product.id} className="list-group-item d-flex justify-content-between align-items-center">
                                <span>{product.name} ({product.category.name})</span>
                                <RestoreDeleteButtons
                                    loadingDelete={loadingDelete[product.id]}
                                    loadingRestore={loadingRestore[product.id]}
                                    deleteAction={() => handleDeletePermanently(product.id)}
                                    restoreAction={() => handleRestore(product.id)}
                                    size={25}
                                />
                            </li>
                            ))}
                        </ul>
                        // to będzie wyświetlane w tabeli ładnej
                    </>
                    }

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