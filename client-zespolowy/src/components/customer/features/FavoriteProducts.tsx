import { observer } from "mobx-react-lite"
import { ProductListItem } from "./ProductListItem";

export const FavoriteProducts = observer(() => {

    const favoriteProductIds = [2, 5, 8];
    const products = [
        { id: 1, name: "Product 1", price: 50, new: true },
        { id: 2, name: "Product 2", price: 75, discount: 10, new: true},
        { id: 3, name: "Product 3", price: 100, new: true },
        { id: 4, name: "Product 4", price: 50, new: true },
        { id: 5, name: "Product 5", price: 75, new: true },
        { id: 6, name: "Product 6", price: 100, new: true },
        { id: 7, name: "Product 7", price: 50, new: true },
        { id: 8, name: "Product 8", price: 75},
        { id: 9, name: "Product 9", price: 100, new: true },
        { id: 10, name: "Product 10", price: 50, new: true },
      ];

    const favoriteProducts = products.filter((product) =>
        favoriteProductIds.includes(product.id)
    );

  return (
    <div className="m-3 border p-3">
      <h5><p>Your favorite products</p></h5>
      <div className="row row-cols-2 row-cols-md-5 g-2">
        {favoriteProducts.map((product, index) => (
          <div className="col" key={index}>
            <ProductListItem name={product.name} price={product.price} discount={product.discount} new={product.new || false}/>
          </div>
        ))}
      </div>
    </div>
  )
})
