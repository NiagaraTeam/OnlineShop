import { observer } from "mobx-react-lite"
import { Helmet } from "react-helmet"

export const ContactPage = observer(() => {
  return (
    <div>
      <Helmet>
        <title>Contact - OnlineShop</title>
      </Helmet>
      <p>Contact and F&Q</p>
    </div>
  )
})
