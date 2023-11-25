import { observer } from "mobx-react-lite"
import { ProductListItem } from "../features/ProductListItem"

export const HomePage = observer(() => {
  return (
    <div>
      <p>HomePage</p>
      <ProductListItem/>
    </div>
  )
})
