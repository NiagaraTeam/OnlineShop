import { observer } from "mobx-react-lite"
import { Helmet } from "react-helmet-async"

export const AboutPage = observer(() => {
  return (
    <div>
      <Helmet>
        <title>About - BeautyShop</title>
      </Helmet>
      <p>About Page</p>
    </div>
  )
})
