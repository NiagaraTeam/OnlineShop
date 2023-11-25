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
    const {products, loadProducts, deleteProduct, createProduct} = productStore;
    const {initialLoading} = commonStore;

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
    function handleEdit(id: number): void {
        console.log(id);
        throw new Error("Function not implemented.");
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
                        {product.name} ({product.category.name})
                        <EditDeleteButtons
                        loading={loading[product.id]}
                        deleteAction={() => handleDelete(product.id)}
                        editAction={() => handleEdit(product.id)}
                        size={25}
                        />
                    </li>
                    ))}
                </ul>
                </div>
            
                <div className="col-lg-5 offset-lg-1">
                    <h2 className="my-4">
                    Create Product
                    </h2>
                    <ProductForm onSubmit={handleCreate} buttonText="Create" product={new ProductFormValues()}/>
                </div>
            
            </div>
        </div>    
    )
})