import { observer } from "mobx-react-lite"
import { TopSoldProducts } from "../features/TopSoldProducts"
import { DiscountedProducts } from "../features/DiscountedProducts"
import { NewProducts } from "../features/NewProducts"

export const HomePage = observer(() => {
  return (
    <div>
      <p>HomePage</p>
      {/* <TopSoldProducts/> */}
      {/* <DiscountedProducts/> */}
      <NewProducts/>
    </div>
  )
})
