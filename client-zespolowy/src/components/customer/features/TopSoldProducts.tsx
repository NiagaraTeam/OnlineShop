import { observer } from "mobx-react-lite";
import { ProductListItem } from "./ProductListItem";

export const TopSoldProducts = observer(() => {
  const products = [
    { name: "Produkt 1", price: 50 },
    { name: "Produkt 2", price: 75 },
    { name: "Produkt 3", price: 100 },
    { name: "Produkt 4", price: 50 },
    { name: "Produkt 5", price: 75 },
    { name: "Produkt 6", price: 100 },
    { name: "Produkt 7", price: 50 },
    { name: "Produkt 8", price: 75 },
    { name: "Produkt 9", price: 100 },
    { name: "Produkt 10", price: 50 },
  ];

  return (
    <div className="m-3 border p-3">
      <b><p>TopSoldProducts</p></b>
      <div className="row row-cols-2 row-cols-md-5 g-2">
        {products.map((product, index) => (
          <div className="col" key={index}>
            <ProductListItem name={product.name} price={product.price} />
          </div>
        ))}
      </div>
    </div>
  );
});