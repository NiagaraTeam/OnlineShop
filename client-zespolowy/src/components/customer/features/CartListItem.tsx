import { observer } from "mobx-react-lite";
import { CartItem } from "../../../app/models/onlineshop/Cart";
import { useStore } from "../../../app/stores/store";
import { useEffect, useState } from "react";
import { Product } from "../../../app/models/onlineshop/Product";

interface Props {
    item: CartItem;
}

export const CartListItem = observer(({ item }: Props) => {
    const {productStore} = useStore();
    const {loadProduct} = productStore;
    const [product, setProduct] = useState<Product | undefined>(undefined);
  
    useEffect(() => {
        loadProduct(item.productId)
            .then((product) => setProduct(product));
  
    }, [item, loadProduct]);

    if (!product) return <></>

    return (
      <div>
        {product.id} {product.name} x {item.quantity}
      </div>
    );
});