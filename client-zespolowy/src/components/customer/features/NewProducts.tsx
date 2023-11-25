import { observer } from "mobx-react-lite"
import { ProductListItem } from "./ProductListItem";

export const NewProducts = observer(() => {

    const products = [
        { name: "Product 1", price: 50, new: true },
        { name: "Product 2", price: 75, new: true},
        { name: "Product 3", price: 100, new: true },
        { name: "Product 4", price: 50, new: true },
        { name: "Product 5", price: 75, new: true },
        { name: "Product 6", price: 100, new: true },
        { name: "Product 7", price: 50, new: true },
        { name: "Product 8", price: 75, new: true },
        { name: "Product 9", price: 100, new: true },
        { name: "Product 10", price: 50, new: true },
      ];

  return (
    <div className="m-3 border p-3">
      <h5><p>New products</p></h5>
      <div className="row row-cols-2 row-cols-md-5 g-2">
        {products.map((product, index) => (
          <div className="col" key={index}>
            <ProductListItem name={product.name} price={product.price} new={product.new || false}/>
          </div>
        ))}
      </div>
    </div>
  )
})
