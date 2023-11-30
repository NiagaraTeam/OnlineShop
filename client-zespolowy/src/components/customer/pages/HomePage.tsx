import { observer } from "mobx-react-lite"
import { useStore } from "../../../app/stores/store"
import { ProductsSection } from "../features/ProductsSection"
import Loading from "../../common/Loading";
import { useEffect } from "react";

export const HomePage = observer(() => {
  const {userStore, productStore, commonStore} = useStore();
  const {isLoggedIn, isAdmin} = userStore;
  const {initialLoading} = commonStore;
  const {topSoldProducts, discoutedProducts, 
    newProducts, favouriteProducts, homePageLoaded, loadHomePageProducts} = productStore;

  useEffect(() => {
      if (!homePageLoaded)
        loadHomePageProducts();

  }, [homePageLoaded, loadHomePageProducts, topSoldProducts]);

  if (initialLoading) return <div className="text-center m-5"><Loading/></div>

  return (
    <div>
      <ProductsSection label="Bestsellers" products={topSoldProducts} />

      <ProductsSection label="Discounted products" products={discoutedProducts} />
      
      <ProductsSection label="New products" products={newProducts} />

      {isLoggedIn && !isAdmin &&
        <ProductsSection label="Your favorite products" products={favouriteProducts} />
      }
    </div>
  )
})
