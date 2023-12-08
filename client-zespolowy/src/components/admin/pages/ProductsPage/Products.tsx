import { observer } from "mobx-react-lite";
import { useState } from "react";
import { LoadingState } from "../../../../app/models/common/LoadingState";
import EditDeleteButtons from "../../../common/EditDeleteButtons";
import { useStore } from "../../../../app/stores/store";

interface Props {
    showCreateForm: boolean;
    setShowCreateForm: (state: boolean) => void;
    setShowEditForm: (state: boolean) => void;
    setShowDeletedProducts: (state: boolean) => void;
}
export const Products = observer(({showCreateForm, setShowCreateForm, 
    setShowEditForm, setShowDeletedProducts}: Props) => {
    
    const {productStore} = useStore();
    const {products, deleteProduct, loadProduct} = productStore;

    // edit
    function displayEditForm(id: number): void {
        loadProduct(id)
            .then(() => setShowEditForm(true));
    }

    // delete
    const [loadingDelete, setLoadingDelete] = useState<LoadingState>({});

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

    return (
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
            
            <table className="table table-bordered">
                <thead className="table-light">
                    <tr>
                    <th className="text-center">ID</th>
                    <th>Name</th>
                    <th className="text-center">Category</th>
                    <th className="text-center">Stock</th>
                    <th style={{ width: "0", whiteSpace: "nowrap" }} className="text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id} >
                            <td className="text-center">{product.id}</td>
                            <td>{product.name}</td>
                            <td className="text-center">{product.category.name}</td>
                            <td className="text-center">{product.productInfo.currentStock}</td>
                            <td>
                                <EditDeleteButtons
                                    loading={loadingDelete[product.id]}
                                    deleteAction={() => handleDelete(product.id)}
                                    deleteToolTipText="Move to trash"
                                    editAction={() => displayEditForm(product.id)}
                                    size={25}/> 
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </> 
    );
});