import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import { UserDiscount } from "../../../app/models/onlineshop/UserDiscount";
import { FormikHelpers } from "formik";
import { useState } from "react";
import { EditDiscountForm } from "../forms/EditDiscountForm";
import { AccountStatus } from "../../../app/models/enums/AccountStatus";
import { Helmet } from "react-helmet-async";

export const CustomersPage = observer(() => {
  const { userStore } = useStore();
  const { users, selectedUser, updateDiscount, deleteUser, selectUser } = userStore;

  const [showEditForm, setShowEditForm] = useState(false);

  const handleEdit = (values: UserDiscount, formikHelpers: FormikHelpers<UserDiscount>) => {
    updateDiscount(selectedUser!.id, values).then(() => {
      setShowEditForm(false);
      formikHelpers.resetForm();
    });
  };

  const displayEditForm = (userId: string) => {
    selectUser(userId);
    setShowEditForm(true);
  };

  return (
    <div className="justify-content-center align-items-center">
      <div className="row">
        <div className="my-6">
          <Helmet>
            <title>Customers - BeautyShop</title>
          </Helmet>
          <h2 className=" my-5 text-center">CUSTOMERS</h2>
          {users.length > 0 && (
            <table className="table table-bordered table-striped text-center">
              <thead className="table-primary">
                <tr>
                  <th className="text-center">NAME</th>
                  <th className="text-center">EMAIL</th>
                  <th className="text-center">STATUS</th>
                  <th className="text-center">DISCOUNT</th>
                  <th style={{ width: "0", whiteSpace: "nowrap" }} className="text-center">NEWSLETTER</th>
                  <th className="text-center">
                    ACTIONS
                  </th>
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
                      <button
                        className="btn btn-secondary"
                        onClick={() => displayEditForm(user.id)}
                        title="Set discount"
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger ms-2"
                        onClick={() => deleteUser(user.id)}
                        title="Delete account"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {showEditForm && (
          <div className="col-lg-5 offset-lg-4 mt-5">
            <h2 className="pb-4 d-flex justify-content-between align-items-center">
              <span>Edit User Discount</span>
              <button className="btn btn-close" onClick={() => setShowEditForm(false)}></button>
            </h2>
            <div className="my-3">
            <b>USER:</b> {selectedUser?.email}
            </div>
            <EditDiscountForm
              key={selectedUser?.id}
              onSubmit={handleEdit}
              buttonText="Save"
              editMode={true}
              discount={{ value: selectedUser?.discountValue as number }}
            />
          </div>
        )}
      </div>
    </div>
  );
});
