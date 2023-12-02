import { observer } from "mobx-react-lite"
import React, { useState } from 'react'
import { ProductListItem } from "../features/ProductListItem";
import { useStore } from "../../../app/stores/store";

export const ProductsPage = observer(() => {
      const {productStore, categoryStore} = useStore();
      const {categoriesAsOptions} = categoryStore
      const {products} = productStore;

      const [pageNumber, setPageNumber] = useState(0)
      const [searchQuery, setSearchQuery] = useState("")
      const [selectedCategory, setSelectedCategory] = useState("")
      
      const productsPerPage = 10;
      const pagesVisited = pageNumber * productsPerPage
      const pageCount = Math.ceil(products.length / productsPerPage);

      const filteredProducts = products
        .filter((product) => 
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
            (selectedCategory == "" || product.category.id.toString() == selectedCategory)
      )

      const displayProducts = filteredProducts
        .slice(pagesVisited, pagesVisited + productsPerPage!)
        .map((product) => {
          return(    
              <div className="col" key={product.id}>
                <ProductListItem product={product}/>          
            </div>
          );        
      });     

      const changePage = ({ selected }: {selected: number}) => {
        if (selected < pageCount! && selected >= 0) {
          setPageNumber(selected);
        }
      }

      const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
        setPageNumber(0);
      }

      const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(event.target.value);
        setPageNumber(0);
      }
      
      // komponent
      const Pagination = (
        <nav>
          <ul className="pagination">
            <li className="page-item">
              <a className="page-link" onClick={() => changePage({ selected: pageNumber - 1 })}>
                Previous
              </a>
            </li>
            {[...Array(pageCount)].map((_, index) => (
              <li key={index} className="page-item">
                <a
                  className={`page-link ${pageNumber === index ? 'active' : ''}`}
                  onClick={() => setPageNumber(index)}
                >
                  {index + 1}
                </a>
              </li>
            ))}
            <li className="page-item">
              <a className="page-link" onClick={() => changePage({ selected: pageNumber + 1 })}>
                Next
              </a>
            </li>
          </ul>
        </nav>
      );

      // komponent
      const Search = (
          <div className="col-md-5 order-md-1">
            <div className="input-group">
              <input
                className="form-control border-end-0 border rounded-pill"
                type="search"
                id="example-search-input"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
        </div>
      );

      // komponent
      const categoryFilter = (
          <div className="col-md-3 order-md-1">
            <select
              className="form-select"
              value={selectedCategory}
              onChange={handleCategoryChange}>     
            <option value="">All categories</option>
            {categoriesAsOptions.map((category) => (
              <option key={category.value} value={category.value}>
                {category.text}
              </option>    
            ))}
          </select>
        </div>
      )

    return (
      <div className="container">
        <div className="row offset-3">
          {Search} {categoryFilter}
        </div>
        <div className="mt-5">
          <div className="row row-cols-2 row-cols-md-5 g-2">
              {displayProducts}
          </div>
        </div>
        <div className="p-2 mt-3">
          {Pagination}
        </div>
      </div>
    )
}) 