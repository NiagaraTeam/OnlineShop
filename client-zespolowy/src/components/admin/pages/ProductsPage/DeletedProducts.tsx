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
            <div className=" text-center">
                <h2 className="my-4 ">
                    DELETED PRODUCTS
                </h2>
            </div>

            {deletedProducts.length > 0 &&
            <table className="table table-bordered table-striped">
                <thead className="table-primary">
                    <tr>
                    <th className="text-center">ID</th>
                    <th className="text-center">NAME</th>
                    <th className="text-center">CATEGORY</th>
                    <th style={{ width: "0", whiteSpace: "nowrap" }} className="text-center">ACTION</th>
                    </tr>
                </thead>
                <tbody>
                {deletedProducts.map((product) => (
                    <tr key={product.id} >
                        <td className="text-center">{product.id}</td>
                        <td className="text-center">{product.name}</td>
                        <td className="text-center">{product.category.name}</td>
                        <td>
                        <div className="d-flex justify-content-around align-items-center ">
                            <button
                            className="btn btn-danger mx-3"
                            onClick={() => handleDeletePermanently(product.id)}
                            disabled={loadingDelete[product.id]}
                            >
                            Delete
                            </button>
                            <button
                            className="btn btn-primary"
                            onClick={() => handleRestore(product.id)}
                            disabled={loadingRestore[product.id]}
                            >
                            Restore
                            </button>
                        </div>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>}
            <div>
                    {deletedProducts.length > 0 &&
                    <button className="btn btn-dark my-3"
                        onClick={() => deleteAll()}>Delete all</button>}
                    <button className="btn btn-secondary mx-4"
                        onClick={() => setShowDeletedProducts(false)}>Cancel</button>
                </div>
            {deletedProducts.length === 0 && 
                <h5>Trash is empty</h5>
            }
        </>
    );
});