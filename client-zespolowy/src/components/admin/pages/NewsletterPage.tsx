import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import { Helmet } from "react-helmet-async";

export const NewsletterPage = observer(() => {
    const { userStore } = useStore();
    const { users } = userStore;

    return (
    <div className="m-3">
      <Helmet>
          <title>Newsletter - OnlineShop</title>
      </Helmet>
      <div className="row">
          <div className="col-lg-6 my-4">
            <h2 className="pb-3">Newsletter</h2>
            {users.length > 0 && (
            <>
              <ul className="list-group">
                <li className="list-group-item"><b>Customers with newsletter subscription</b></li>
                {users.map((user) => (
                    user.newsletter === true &&
                    <li key={user.id} className="list-group-item px-5">
                      {user.email}
                    </li>
                  ))}
              </ul>
              <button onClick={() => userStore.sendNewsletter()} className="btn btn-primary mt-3">
                Send newsletter
              </button>
            </>)}
          </div>
      </div>
    </div>
    )

});