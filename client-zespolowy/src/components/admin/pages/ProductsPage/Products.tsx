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
    const {productsAdmin, deleteProduct, loadProduct, selectedProduct} = productStore;

    // filter parameters
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    const filteredProducts = productsAdmin
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
            <div className="text-center">
                <h2>PRODUCTS</h2>
            </div>

            <div className="d-flex justify-content-between align-items-center py-3">
                {search} <div className="col-3">{categoryFilter}</div>
            </div>
            
            {productsAdmin.length > 0 &&
            <table className="table table-bordered table-striped text-center">
                <thead className="table-primary ">
                    <tr>
                    <th className="text-center">ID</th>
                    <th>NAME</th>
                    <th className="text-center">CATEGORY</th>
                    <th style={{ width: "0", whiteSpace: "nowrap" }}  className="text-center">STOCK</th>
                    <th className="text-center">STATUS</th>
                    <th style={{ width: "0", whiteSpace: "nowrap" }} className="text-center">ACTION</th>
                    </tr>
                </thead>
                <tbody>
                {pagedProducts.map((product) => (
                <tr key={product.id} className={selectedProduct?.id === product.id ? 'selected-row' : ''}>
                    <td className="text-center">{product.id}</td>
                    <td>{product.name}</td>
                    <td className="text-center">{product.category.name}</td>
                    <td className="text-center">{product.productInfo.currentStock}</td>
                    <td className="text-center">{ProductStatus[product.status]}</td>
                    <td>
                    <div className="d-flex justify-content-around align-items-center">
                        <button
                        className="btn btn-secondary"
                        onClick={() => displayEditForm(product.id)}
                        >
                        Edit
                        </button>
                        <button
                        className="btn btn-danger mx-2"
                        onClick={() => handleDelete(product.id)}
                        disabled={loadingDelete[product.id]}
                        >
                        Delete
                        </button>
                    </div>
                    </td>
                </tr>
                ))}
                </tbody>
            </table>}
            {filteredProducts.length === 0 &&
            <div className="text-center">
                <h4>There is no such product</h4>
            </div>}
            <div className=" my-5 text-center">
                    {showCreateButton &&
                    <button className="btn btn-primary mx-2" 
                        onClick={() => setShowCreateForm(true)}>Create</button>
                    }
                    <button className="btn btn-dark me-2"
                        onClick={() => setShowDeletedProducts(true)}>All Deleted</button>
                </div>

            {filteredProducts.length > 0 &&
            <div className="mt-3">
                {pagination}
            </div>}
            
        </> 
    );
});