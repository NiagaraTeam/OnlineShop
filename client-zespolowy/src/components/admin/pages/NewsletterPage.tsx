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
              <table className="table table-bordered">
                <thead className="table-light">
                  <tr>
                    <th className="text-center">Name</th>
                    <th className="text-center">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    user.newsletter === true &&
                    <tr key={user.id}>
                      <td className="text-center">{user.userName}</td>
                      <td className="text-center">{user.email}</td>
                    </tr>
                  ))}
                </tbody>
                <button onClick={() => userStore.sendNewsletter()} className="btn btn-primary">
                      Send newsletter
                </button>
              </table>)}
            </div>
      </div>
    </div>
    )

});