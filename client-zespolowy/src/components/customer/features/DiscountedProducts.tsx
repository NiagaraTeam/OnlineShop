import { observer } from "mobx-react-lite"
import { ProductListItem } from "./ProductListItem";

export const DiscountedProducts = observer(() => {

    const products = [
        { name: "Product 1", price: 50, discount: 10 },
        { name: "Product 2", price: 75, discount: 10 },
        { name: "Product 3", price: 100, discount: 10 },
        { name: "Product 4", price: 50, discount: 15 },
        { name: "Product 5", price: 75, discount: 10 },
        { name: "Product 6", price: 100, discount: 10 },
        { name: "Product 7", price: 50, discount: 10 },
        { name: "Product 8", price: 75, discount: 10 },
        { name: "Product 9", price: 100, discount: 10 },
        { name: "Product 10", price: 50, discount: 10 },
    ];

  return (
    <div className="m-3 border p-3">
      <h5><p>TopSoldProducts</p></h5>
      <div className="row row-cols-2 row-cols-md-5 g-2">
        {products.map((product, index) => (
          <div className="col" key={index}>
            <ProductListItem name={product.name} price={product.price} discount={product.discount} />
          </div>
        ))}
      </div>
    </div>
  )
})
