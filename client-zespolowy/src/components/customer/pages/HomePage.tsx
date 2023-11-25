import { observer } from "mobx-react-lite"
import { TopSoldProducts } from "../features/TopSoldProducts"

export const HomePage = observer(() => {
  return (
    <div>
      <p>HomePage</p>
      <TopSoldProducts/>
    </div>
  )
})
