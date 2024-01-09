import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import { UserDiscount } from "../../../app/models/onlineshop/UserDiscount";
import { FormikHelpers } from "formik";
import { useState } from "react";
import EditDeleteButtons from "../../common/EditDeleteButtons";

import { EditDiscountForm } from "../forms/EditDiscountForm";
import { AccountStatus } from "../../../app/models/enums/AccountStatus";
import { Helmet } from "react-helmet";


export const CustomersPage = observer(() => {
  const { userStore } = useStore();
  const { users, selectedUser, updateDiscount, deleteUser, selectUser} = userStore;

  const [showEditForm, setShowEditForm] = useState(false);

  const handleEdit = (values: UserDiscount, formikHelpers: FormikHelpers<UserDiscount>) => {       
        updateDiscount(selectedUser!.id, values)
        .then(() => {
          setShowEditForm(false);
          formikHelpers.resetForm();
        })
  }

  const displayEditForm = (userId: string) => {
    selectUser(userId);
    setShowEditForm(true);
  }

  return (
    <div className="m-3">
      <Helmet>
          <title>Customers - OnlineShop</title>
      </Helmet>
      <div className="row">
          <div className="col-lg-6 my-4">
            <h2 className="pb-3">Customers</h2>
            {users.length > 0 && (
              <table className="table table-bordered">
                <thead className="table-light">
                  <tr>
                    <th className="text-center">Name</th>
                    <th className="text-center">Email</th>
                    <th className="text-center">Status</th>
                    <th className="text-center">Discount</th>
                    <th className="text-center">Newsletter</th>
                    <th style={{ width: "0", whiteSpace: "nowrap" }} className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="text-center">{user.userName}</td>
                      <td className="text-center">{user.email}</td>
                      <td className="text-center">{AccountStatus[user.status]}</td>
                      <td className="text-center">{user.discountValue}</td>
                      <td className="text-center">{user.newsletter ? "yes" : "no"}</td>
                      <td>
                        <EditDeleteButtons
                          loading={false}
                          editAction={() => displayEditForm(user.id)}
                          deleteAction={() => deleteUser(user.id)}
                          deleteToolTipText="Delete account"
                          editToolTipText="Set discount"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>)}
            </div>

            {showEditForm &&
            <div className="col-lg-5 offset-lg-1 mt-5">
              <h2 className="pb-4 d-flex justify-content-between align-items-center">
                  <span>Set user discount</span>
                  <button className="btn btn-close" onClick={() => setShowEditForm(false)}></button>
              </h2>
              <div className="my-3">User: <b>{selectedUser?.email}</b></div>
              <EditDiscountForm
                  key={selectedUser?.id}
                  onSubmit={handleEdit} buttonText="Save" editMode={true}
                  discount={{value: selectedUser?.discountValue as number}}
              />
            </div>}
      </div>
    </div>
  );
});
