import { observer } from "mobx-react-lite";
import { CartItem } from "../../../app/models/onlineshop/Cart";
import { useStore } from "../../../app/stores/store";
import { useEffect, useState } from "react";
import { Product } from "../../../app/models/onlineshop/Product";
import { Link } from "react-router-dom";
import EditDeleteButtons from "../../common/EditDeleteButtons";

interface Props {
    item: CartItem;
}

export const CartListItem = observer(({ item }: Props) => {
    const {productStore, cartStore} = useStore();
    const {loadProduct} = productStore;
    const {deleteItemFromCart, changeQuantity} = cartStore;
    const [product, setProduct] = useState<Product | undefined>(undefined);
    const [editedQuantity, setEditedQuantity] = useState<number>(item.quantity);
  
    useEffect(() => {
        loadProduct(item.productId)
            .then((product) => setProduct(product));
  
    }, [item, loadProduct]);

    if (!product) return <></>

    const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newQuantity = parseInt(event.target.value, 10) || 0;
      setEditedQuantity(newQuantity);
    };
  
    const handleConfirmQuantity = () => {
      changeQuantity(product.id, editedQuantity);
    };

    return (
      <div className="d-flex justify-content-between align-items-center p-2">
        <div>
          <img 
            className="me-4" 
            src={product.photo ? product.photo.urlSmall : '/assets/telefon.png'} 
            alt={product.name} width={75}
          />
          <Link className="text-decoration-none text-black" to={`/product/${product.id}`}>
            {product.name} 
          </Link>
        </div>
        <div className="d-flex">
          <div className="d-flex flex-column">
            {Product.isOnSale(product) 
            ? 
              <><del className="text-muted">{product.price} zł</del> {Product.getDiscountedPrice(product)} zł</>
            : 
              <span className="mt-2">{product.price} zł</span>
            }
          </div>
          <div style={{width: "60px", marginRight: "50px"}}>
            <input 
              type="number" 
              value={editedQuantity} 
              className="form-control mx-4"
              onChange={handleQuantityChange}/>
          </div>
          <div className="mt-1 d-flex">
            <EditDeleteButtons
                loading={false}
                showEdit={item.quantity !== editedQuantity}
                editAction={handleConfirmQuantity}
                editToolTipText="Change quantity"
                deleteAction={() => deleteItemFromCart(product.id)}
                deleteToolTipText="Remove from cart"
                size={25}
            />
          </div>
        </div>
      </div>
    );
});