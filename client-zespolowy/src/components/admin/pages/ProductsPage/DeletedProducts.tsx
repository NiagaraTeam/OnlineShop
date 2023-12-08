import { useState } from "react";
import RestoreDeleteButtons from "../../../common/RestoreDeleteButtons";
import { LoadingState } from "../../../../app/models/common/LoadingState";
import { useStore } from "../../../../app/stores/store";
import { observer } from "mobx-react-lite";

interface Props {
    setShowDeletedProducts: (state: boolean) => void;
}
export const DeletedProducts = observer(({setShowDeletedProducts}: Props) => {
    const {productStore} = useStore();
    const {deletedProducts, deleteAll, deletePermanently, restoreProduct} = productStore;

    const [loadingDelete, setLoadingDelete] = useState<LoadingState>({});
    const [loadingRestore, setLoadingRestore] = useState<LoadingState>({});

    // delete
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

    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="my-4">
                Deleted products
                </h2>
                <div>
                    {deletedProducts.length > 0 &&
                    <button className="btn btn-danger mx-2"
                        onClick={() => deleteAll()}>Delete all</button>}
                    <button className="btn btn-secondary"
                        onClick={() => setShowDeletedProducts(false)}>Cancel</button>
                </div>
            </div>

            {deletedProducts.length > 0 &&
            <table className="table table-bordered">
                <thead className="table-light">
                    <tr>
                    <th className="text-center">ID</th>
                    <th>Name</th>
                    <th className="text-center">Category</th>
                    <th style={{ width: "0", whiteSpace: "nowrap" }} className="text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {deletedProducts.map((product) => (
                        <tr key={product.id} >
                            <td className="text-center">{product.id}</td>
                            <td>{product.name}</td>
                            <td className="text-center">{product.category.name}</td>
                            <td>
                            <RestoreDeleteButtons
                                loadingDelete={loadingDelete[product.id]}
                                loadingRestore={loadingRestore[product.id]}
                                deleteAction={() => handleDeletePermanently(product.id)}
                                restoreAction={() => handleRestore(product.id)}
                                size={25}
                            />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>}

            {deletedProducts.length === 0 && 
                <h5>Trash is empty</h5>
            }
        </>
    );
});