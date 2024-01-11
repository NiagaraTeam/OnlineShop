import { observer } from "mobx-react-lite"
import React, { useState } from 'react'
import { ProductListItem } from "../features/ProductListItem";
import { useStore } from "../../../app/stores/store";
import { CategoryFilter } from "../../common/CategoryFilter";
import { Search } from "../../common/Search";
import { Pagination } from "../../common/Pagination";
import { Helmet } from "react-helmet-async";

export const ProductsPage = observer(() => {
      const {productStore} = useStore();
      const {products} = productStore;

      const [pageNumber, setPageNumber] = useState(0)
      const [searchQuery, setSearchQuery] = useState("")
      const [selectedCategory, setSelectedCategory] = useState("")
      
      const filteredProducts = products
        .filter((product) => 
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
            (selectedCategory == "" || product.category.id.toString() == selectedCategory)
      )

      const productsPerPage = 10;
      const pagesVisited = pageNumber * productsPerPage
      const pageCount = Math.ceil(filteredProducts.length / productsPerPage);

      const displayProducts = filteredProducts
        .slice(pagesVisited, pagesVisited + productsPerPage!)
        .map((product) => {
          return(    
              <div className="col" key={product.id}>
                <ProductListItem product={product}/>          
            </div>
          );        
      });     

      const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
        setPageNumber(0);
      }

      const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(event.target.value);
        setPageNumber(0);
      }
      
    const pagination = 
      <Pagination 
        setPageNumber={setPageNumber}
        pageCount={pageCount}
        pageNumber={pageNumber}/>
     
    const search = 
      <Search
        colSize={12}
        handleSearch={handleSearch} 
        searchQuery={searchQuery}/>

    const categoryFilter = 
      <CategoryFilter 
        handleCategoryChange={handleCategoryChange}
        selectedCategory={selectedCategory}/>

    return (
      <div className="container">
        <Helmet>
          <title>Products - OnlineShop</title>
        </Helmet>
        <div className="row">
          <div className="col-lg-4 offset-lg-3 mb-2">{search}</div> 
          <div className="col-lg-2 mb-2">{categoryFilter}</div>
        </div>
        <div className="mt-5">
          <div className="row row-cols-2 row-cols-md-5 g-2">
              {displayProducts}
          </div>
        </div>
        {filteredProducts.length > 0 &&
        <div className="p-2 mt-3">
          {pagination}
        </div>}
        {(filteredProducts.length === 0 && products.length > 0) &&
        <div className="text-center">
          <h5>There are no products with the given criteria</h5>
        </div>}
      </div>
    )
}) 