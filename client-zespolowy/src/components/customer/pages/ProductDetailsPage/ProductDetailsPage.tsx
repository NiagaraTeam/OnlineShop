import { observer } from "mobx-react-lite"
import { useStore } from "../../../../app/stores/store";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../../common/Loading";
import { Product } from "../../../../app/models/onlineshop/Product";
import { ProductsSection } from "../../features/ProductsSection";
import { FavouriteCheckBox } from "../../features/FavouriteCheckBox";
import { ProductExpert } from "./ProductExpert";
import { ProductStatus } from "../../../../app/models/enums/ProductStatus";
import { router } from "../../../../app/router/Routes";
import { Helmet } from "react-helmet-async";
import { QuestionForm } from "../../forms/QuestionForm";
import { Question } from "../../../../app/models/onlineshop/Question";

export const ProductDetailsPage = observer(() => {
  const {productStore, commonStore, cartStore, userStore: {isNetValue}} = useStore();
  const {initialLoading} = commonStore;
  const {addItemToCart} = cartStore;
  const {loadProduct, selectedProduct: product, discountedProducts} = productStore;
  const {id} = useParams();

  const [quantity, setQuantity] = useState<number | undefined>(undefined);

  const handleAddToCart = () => {
    addItemToCart(product!.id, quantity!);
    setQuantity(undefined);
  }

  const handleSubmitQuestion = (question: Question) => {
    console.log(question);

};

  useEffect(() => {
      if (id)
        loadProduct(parseInt(id))
            .then((product) => {
                if (product?.status === ProductStatus.Hidden)
                    router.navigate("not-found");
            });

  }, [id, loadProduct]);


  if (initialLoading || !product) return <div className="text-center m-5"><Loading/></div>

  const renderPrice = () => {
        if (isNetValue)
            return renderNetPrice();
        else 
            return renderGrossPrice();
    }


    const renderNetPrice = () => {
        return(
            Product.isOnSale(product) ?  (
                <>
                    <h5 className="text-decoration-line-through">Net Price: {product.price} zł</h5>
                    <h5>Discounted net price: {Product.getDiscountedPrice(product)} zł </h5>
                </>
            ) : (
                <>
                    <h5>Net Price: {product.price} zł</h5>
                </>
            )
        )
    }

    const renderGrossPrice = () => {
        return(
            Product.isOnSale(product) ?  (
                <>
                    <h5 className="text-decoration-line-through">Price (with Tax): {Product.getPriceWithTax(product)} zł</h5>
                    <h5>Discounted price (with Tax): {Product.getDiscountedPriceWithTax(product)} zł </h5>
                </>
            ) : (
                <>
                    <h5>Price (with Tax): {Product.getPriceWithTax(product)} zł</h5>
                </>
            )
        )
    }

  return (
      <div className="container align-center ">
        <Helmet>
            <title>{product.name} - OnlineShop</title>
        </Helmet>
          <div className="row">

            <div className="col">
                <img 
                    className="rounded m-5"
                    
                    src={product.photo ? product.photo.urlLarge : '/assets/product.jpg'}
                    alt={product.name}
                    ></img>
            </div>

            <div className="col mt-5">

                <div className="d-flex justify-content-between align-items-center">
                    <p className="text-uppercase">Category: {product.category.name}</p>
                    <div className="mx-5">
                        <FavouriteCheckBox productId={product.id}/>
                    </div>
                </div>

                <div className="my-4">
                  <h2>{product.name}</h2>
                </div>
                
                
                <p>Availability:
                    {product.status === ProductStatus.Available  ?
                        <> {product.productInfo.currentStock} psc</>
                    :
                        <> Unavailable</>
                    }
                </p>
                <p>Tax rate: {product.taxRate === -1 ? "Tax free" : `${product.taxRate} %`}</p>

                {renderPrice()}

                {product.status === ProductStatus.Available &&
                <div className="row align-items-center mt-4">
                    <div className="col-5">
                        <div className="input-group mb-3">
                            <input type="number" min={1} max={product.productInfo.currentStock} 
                                className="form-control" aria-describedby="basic-addon2" placeholder="Enter quantity"
                                value={quantity !== undefined ? quantity : ''}
                                onChange={(e) => {
                                    const inputQuantity = Number(e.target.value);
                                    const maxQuantity = product.productInfo.currentStock;
                                
                                    setQuantity(isNaN(inputQuantity) || inputQuantity <= 0 ? undefined : Math.min(inputQuantity, maxQuantity));
                                }}
                            />
                            <button className="btn btn-primary" type="button" disabled={!quantity}
                                onClick={() => handleAddToCart()}>Add to cart</button>
                        </div>                        
                    </div>
                </div>}

                <div className="mt-4">
                  <h5>Product details:</h5>
                  <p>{product.description}</p>
                </div>

            </div>

          </div>

          <div className="border-top mt-5 p-3">
              <ProductExpert product={product}/>
          </div>

          <div className="border-top mt-3 p-3">
            <QuestionForm 
                buttonText="Send question"  
                onSubmit={handleSubmitQuestion}
                productExpertEmail={product.productExpert.email}            
            />
          </div>
          
          <div className="border-top mt-3 p-3">
            <ProductsSection products={discountedProducts.slice(0, 5)} label={"Discounted products"}/>
          </div>

      </div>
  )
})