import { observer } from "mobx-react-lite"
import { Helmet } from "react-helmet-async"

export const ContactPage = observer(() => {
  return (
    <div>
      <Helmet>
        <title>Contact - BeautyShop</title>
      </Helmet>
      <p>Contact and F&Q</p>
    </div>
  )
})
