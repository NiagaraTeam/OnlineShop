import { observer } from "mobx-react-lite"
import React, { useState } from 'react'

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

      const productsPerPage = 4
      const pagesVisited = pageNumber * productsPerPage

    
      const filteredProducts = Products.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()));
      const displayProducts = filteredProducts
        .slice(pagesVisited, pagesVisited + productsPerPage)
        .map((product) => {
          return(
            <div className="container" key={product.name}>
            <thead>
              <tr>
                <p className="product-title">{product.name}</p>
                <p className="product-price">{`Price: ${product.price} zł`}</p>
                <p className="product-discount">{`Discount: ${product.discount}%`}</p>
              </tr>
            </thead>            
            <button className="add-to-order">Dodaj do koszyka</button>
            <button className="view">Pokaż</button>
            </div>
          );
        });

        console.log(searchQuery.toLowerCase());
        console.log(filteredProducts)


        const pageCount = Math.ceil(filteredProducts.length / productsPerPage)

        const changePage = ({ selected }: {selected:number}) => {
          if (selected < pageCount && selected >= 0) {
            setPageNumber(selected)
          }
          //setPageNumber(selected)
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
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearch}
          />
        )

    return (
        <div className="container">
        {Search}
        {displayProducts} 
        {Pagination}
        
        </div>
    )
})