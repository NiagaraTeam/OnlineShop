import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import { UserDiscount } from "../../../app/models/onlineshop/UserDiscount";
import { FormikHelpers } from "formik";
import { useEffect, useState } from "react";
import EditDeleteButtons from "../../common/EditDeleteButtons";
import { LoadingState } from "../../../app/models/common/LoadingState";
import { EditDiscountForm } from "../forms/EditDiscountForm";
import { AccountDetails } from "../../../app/models/onlineshop/AccountDetails";
import { User } from "../../../app/models/common/User";

export const CustomersPage = observer(() => {
  const { userStore } = useStore();
  const { users, selectedUser, updatedDiscount, getSelectedUser, updateDiscount } = userStore;

  
  const [showEditForm, setShowEditForm] = useState(true);


  const handleEdit = (userId: string, values: UserDiscount, formikHelpers: FormikHelpers<UserDiscount>) => {       
        updateDiscount(userId, values).then(() => {
        setShowEditForm(false);
        formikHelpers.resetForm();
    })
}

  return (
    <div>
        <h1>Customers</h1>
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
                <td className="text-center">{user.status}</td>
                <td className="text-center">{user.discountValue}</td>
                <td className="text-center">{user.newsletter}</td>
                <td>
                  <EditDeleteButtons
                    loading={false}
                    //editAction={handleEdit}
                    //deleteAction={() => handleDelete(user.id)}
                    deleteToolTipText="Move to trash"
                    //editAction={() => displayEditForm(user.id)}
                  />
                </td>
                {showEditForm &&
                    <>
                    {console.log("siema")}
                        <h2 className="my-4 d-flex justify-content-between align-items-center">
                            <span>Edit Product</span>
                            <button className="btn btn-close" onClick={() => setShowEditForm(false)}></button>
                        </h2>
                        <EditDiscountForm 
                            key={user.id} 
                            onSubmit={handleEdit} buttonText="Save" editMode={true}
                            discount={updatedDiscount}
                        />
                    </>}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
});
