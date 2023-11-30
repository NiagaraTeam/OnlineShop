import { observer } from "mobx-react-lite"
import React, { useState } from 'react'
import { ProductListItem } from "./ProductListItem";

export const ProductsPage = observer(() => {

    const Products = [
      { name: "product 1", price: 50, discount: 10 },
      { name: "product 2", price: 75, discount: 10 },
      { name: "product 3", price: 100, discount: 10 },
      { name: "product 4", price: 50, discount: 15 },
      { name: "product 5", price: 75, discount: 10 },
      { name: "product 6", price: 100, discount: 10 },
      { name: "product 7", price: 50, discount: 10 },
      { name: "product 8", price: 75, discount: 10 },
      { name: "product 9", price: 100, discount: 10 },
      { name: "product 10", price: 50, discount: 10 },
    ];
      const [pageNumber, setPageNumber] = useState(0)
      const [searchQuery, setSearchQuery] = useState("")

      const productsPerPage = 5
      const pagesVisited = pageNumber * productsPerPage


      const filteredProducts = Products.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()));
      const displayProducts = filteredProducts
        .slice(pagesVisited, pagesVisited + productsPerPage)
        .map((product, index) => {
          return(    
              <div className="col" key={index}>
                <ProductListItem name={product.name} price={product.price} discount={product.discount}/>          
            </div>
          );
          
        });

        const pageCount = Math.ceil(filteredProducts.length / productsPerPage)

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
        const Search = (
          <div id ="search-box">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearch}
          />
          </div>

        )
    return (
      <div className="container">
          {Search}
          <div className="m-3 p-3"></div>
          <h5><p>Produkty</p></h5>
          <div className="row">
              {displayProducts}
          </div>
          {Pagination}
      </div>
    )
}) 