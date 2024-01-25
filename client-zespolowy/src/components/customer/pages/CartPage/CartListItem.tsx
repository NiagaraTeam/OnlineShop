import { observer } from "mobx-react-lite";
import { CartItem } from "../../../../app/models/onlineshop/Cart";
import { useStore } from "../../../../app/stores/store";
import { useEffect, useState } from "react";
import { Product } from "../../../../app/models/onlineshop/Product";
import { Link } from "react-router-dom";
import EditDeleteButtons from "../../../common/EditDeleteButtons";

interface Props {
    item: CartItem;
}

export const CartListItem = observer(({ item }: Props) => {
    const {productStore, cartStore, userStore: {isNetValue}} = useStore();
    const {getProductObject} = productStore;
    const {deleteItemFromCart, changeQuantity} = cartStore;
    const [product, setProduct] = useState<Product | null>(null);
    const [editedQuantity, setEditedQuantity] = useState<number>(item.quantity);
  
    useEffect(() => {
        getProductObject(item.productId)
            .then((product) => setProduct(product));
  
    }, [item, getProductObject]);

    if (!product) return <></>

    const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newQuantity = parseInt(event.target.value, 10) || 0;
      const maxQuantity = product.productInfo.currentStock;
  
      // Jeżeli wprowadzona ilość jest większa niż dostępny stan magazynowy, ustaw ilość na maksymalny dostępny stan magazynowy
      setEditedQuantity(Math.min(newQuantity, maxQuantity));
  };
  
    const handleConfirmQuantity = () => {
      changeQuantity(product.id, editedQuantity);
    };

    const renderPrice = () => {
        if (isNetValue)
            return renderNetPrice();
        else 
            return renderGrossPrice();
    }


    const renderNetPrice = () => {
        return(
          Product.isOnSale(product) 
          ? 
            <><del className="text-muted">{product.price} zł</del> {Product.getDiscountedPrice(product)} zł</>
          : 
            <span className="mt-2">{product.price} zł</span>
        )
    }

    const renderGrossPrice = () => {
        return(
          Product.isOnSale(product) 
          ? 
            <><del className="text-muted">{Product.getPriceWithTax(product)} zł</del> {Product.getDiscountedPriceWithTax(product)} zł</>
          : 
            <span className="mt-2">{Product.getPriceWithTax(product)} zł</span>
        )
    }

    return (
      <div className="d-flex justify-content-between align-items-center p-2">
        <div>
          <img 
            className="me-4" 
            src={product.photo ? product.photo.urlSmall : '/assets/product.jpg'} 
            alt={product.name} width={75}
          />
          <Link className="text-decoration-none text-black" to={`/product/${product.id}`}>
            {product.name} 
          </Link>
        </div>
        <div className="d-flex">
          <div className="d-flex flex-column">
            {renderPrice()}
          </div>
          <div style={{width: "75px", marginRight: "50px"}}>
            <input 
              type="number" 
              value={editedQuantity ? editedQuantity : ''} 
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