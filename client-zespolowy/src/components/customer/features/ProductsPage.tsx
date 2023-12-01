import { observer } from "mobx-react-lite"
import React, { useEffect, useState } from 'react'
import { ProductListItem } from "./ProductListItem";
import { useStore } from "../../../app/stores/store";

export const ProductsPage = observer(() => {


    const {productStore, categoryStore} = useStore();
    const {loadCategories, categories, categoriesAsOptions} = categoryStore
    const {allProducts, loadProducts} = productStore;
    const [pageNumber, setPageNumber] = useState(0)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("")
    
    useEffect(() => {
      if (allProducts.length == 0) {
        loadProducts();
      }
    }, [allProducts, loadProducts]);
    
    useEffect(() => {
      if(categories.length == 0)
        loadCategories();
    }, [categories, loadCategories, categoriesAsOptions])


      const productsPerPage = 5
      const pagesVisited = pageNumber * productsPerPage

      //const filteredProducts = productStore
      const filteredProducts = allProducts
        .filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()) && (selectedCategory == "" || product.category.id.toString() == selectedCategory)
      )
      const displayProducts = filteredProducts
        .slice(pagesVisited, pagesVisited + productsPerPage)
        .map((product, index) => {
          return(    
              <div className="col" key={index}>
                <ProductListItem product={product}/>          
            </div>
          );        
        });
        
        const pageCount = Math.ceil(allProducts.length / productsPerPage) //do zminay

        const changePage = ({ selected }: {selected:number}) => {
          if (selected < pageCount && selected >= 0) {
            setPageNumber(selected)
          }
        }
        const Pagination = (
          <nav aria-label="Page navigation example">
            <ul className="pagination">
              <li className="page-item">
                <a className="page-link" href="#" onClick={() => changePage({ selected: pageNumber - 1 })}>
                  Previous
                </a>
              </li>
              {[...Array(pageCount)].map((_, index) => (
                <li key={index} className="page-item">
                  <a
                    className={`page-link ${pageNumber === index ? 'active' : ''}`}
                    href="#"
                    onClick={() => setPageNumber(index)}
                  >
                    {index + 1}
                  </a>
                </li>
              ))}
              <li className="page-item">
                <a className="page-link" href="#" onClick={() => changePage({ selected: pageNumber + 1 })}>
                  Next
                </a>
              </li>
            </ul>
          </nav>
        );

        const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
          setSearchQuery(event.target.value)
          setPageNumber(0)
        }
        const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
          console.log("Selected category:", event.target.value);
          setSelectedCategory(event.target.value)
          setPageNumber(0)
        }
        const Search = (
            <div className="row">
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
                    <span className="input-group-append">
                      <button className="btn btn-outline-secondary bg-white border-bottom-0 border rounded-pill ms-n5" type="button">
                        <i className="fa fa-search"></i>
                      </button>
                    </span>
                  </div>
                </div>
              </div>
    );
      const categoryFilter = (
        <div className = "row mt-2">
          <div className = "col-md-3 order-md-1">
            <select
              className="form-select"
              aria-label="Default select example"
              value={selectedCategory}
              onChange={handleCategoryChange}>     
            <option value ="">All categories</option>
            {categoriesAsOptions.map((category) => (
              <option key = {category.text} value = {category.value}>
                {category.text}
              </option>    
            ))}
          </select>
          </div>
        </div>
      )
    return (
      <div className="container">
          {Search} {categoryFilter}
          <div className="m-3 p-3"></div>
          <h5><p>Produkty</p></h5>
          <div className="row row-cols-2 row-cols-md-5 g-2">
              {displayProducts}
          </div>
          {Pagination}
      </div>
    )
}) 