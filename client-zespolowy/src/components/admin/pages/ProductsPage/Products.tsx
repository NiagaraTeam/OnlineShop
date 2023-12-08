import { observer } from "mobx-react-lite";
import { useState } from "react";
import { LoadingState } from "../../../../app/models/common/LoadingState";
import EditDeleteButtons from "../../../common/EditDeleteButtons";
import { useStore } from "../../../../app/stores/store";
import { CategoryFilter } from "../../../common/CategoryFilter";
import { Search } from "../../../common/Search";
import { Pagination } from "../../../common/Pagination";
import { ProductStatus } from "../../../../app/models/enums/ProductStatus";

interface Props {
    showCreateButton: boolean;
    setShowCreateForm: (state: boolean) => void;
    setShowEditForm: (state: boolean) => void;
    setShowDeletedProducts: (state: boolean) => void;
}
export const Products = observer(({showCreateButton, setShowCreateForm, 
    setShowEditForm, setShowDeletedProducts}: Props) => {
    
    const {productStore} = useStore();
    const {products, deleteProduct, loadProduct} = productStore;

    // filter parameters
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    const filteredProducts = products
        .filter((product) => 
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
            (selectedCategory == "" || product.category.id.toString() == selectedCategory)
      )

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    }

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(event.target.value);
    }

    const search = 
      <Search 
        handleSearch={handleSearch} 
        searchQuery={searchQuery}
        colSize={8}/>

    const categoryFilter = 
      <CategoryFilter 
        handleCategoryChange={handleCategoryChange}
        selectedCategory={selectedCategory}/>

    // pagination
    const [pageNumber, setPageNumber] = useState(0);

    const productsPerPage = 10;
    const pagesVisited = pageNumber * productsPerPage
    const pageCount = Math.ceil(filteredProducts.length / productsPerPage);

    const pagedProducts = filteredProducts
        .slice(pagesVisited, pagesVisited + productsPerPage!);         

    const pagination = 
      <Pagination 
        setPageNumber={setPageNumber}
        pageCount={pageCount}
        pageNumber={pageNumber}/>

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
            <div className="d-flex justify-content-between align-items-center mt-4">
                <h2>Products</h2>
                <div>
                    {showCreateButton &&
                    <button className="btn btn-success mx-2" 
                        onClick={() => setShowCreateForm(true)}>Create</button>
                    }
                    <button className="btn btn-secondary"
                        onClick={() => setShowDeletedProducts(true)}>Deleted</button>
                </div>
            </div>

            <div className="d-flex justify-content-between align-items-center py-3">
                {search} {categoryFilter}
            </div>
            
            {products.length > 0 &&
            <table className="table table-bordered">
                <thead className="table-light">
                    <tr>
                    <th className="text-center">ID</th>
                    <th>Name</th>
                    <th className="text-center">Category</th>
                    <th className="text-center">Status</th>
                    <th className="text-center">Stock</th>
                    <th style={{ width: "0", whiteSpace: "nowrap" }} className="text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {pagedProducts.map((product) => (
                        <tr key={product.id} >
                            <td className="text-center">{product.id}</td>
                            <td>{product.name}</td>
                            <td className="text-center">{product.category.name}</td>
                            <td className="text-center">{ProductStatus[product.status]}</td>
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
            </table>}

            {filteredProducts.length > 0 &&
            <div className="mt-3">
                {pagination}
            </div>}
            {filteredProducts.length === 0 &&
            <div className="text-center">
                <h5>There are no products with the given criteria</h5>
            </div>}
        </> 
    );
});