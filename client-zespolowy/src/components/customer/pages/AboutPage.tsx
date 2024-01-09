import { observer } from "mobx-react-lite"
import { Helmet } from "react-helmet"

export const AboutPage = observer(() => {
  return (
    <div>
      <Helmet>
        <title>About - OnlineShop</title>
      </Helmet>
      <p>About Page</p>
    </div>
  )
})
