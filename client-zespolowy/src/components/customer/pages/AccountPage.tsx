import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import { OrderStatus } from "../../../app/models/enums/OrderStatus";
import Loading from "../../common/Loading";
import { Address } from "../../../app/models/onlineshop/Address";
import { AddressForm } from "../forms/AddressForm";
import { FormikHelpers } from "formik";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

export const AccountPage = observer(() => {
    const {userStore: {user, logout, accountDetails, updateAddress}} = useStore();

    const handleAddressSubmit = (address: Address, formikHelpers: FormikHelpers<Address>) => {
        if (user) {
            updateAddress(user.id, address)
                .then(() => {
                    formikHelpers.resetForm({values: {...address}});
                });
        }
    };
    
    if (!user) return <></>

    if (!accountDetails) return <div className="text-center m-5"><Loading/></div>
    
    return (
        <div>
            <Helmet>
                <title>Account - OnlineShop</title>
            </Helmet>
            <div className="row border-bottom pb-4 mb-5">
                <div className="col-md-6 mt-4">
                    <h3>Account details</h3>
                    <dl className="row list-group px-1">
                        <dt className="col-sm-3">Username:</dt>
                        <dd className="col-sm-9 list-group-item mx-2">{user.userName}</dd>

                        <dt className="col-sm-3">Email:</dt>
                        <dd className="col-sm-9 list-group-item mx-2">{user.email}</dd>

                        <dt className="col-sm-3">Discount:</dt>
                        <dd className="col-sm-9 list-group-item mx-2">-{(accountDetails?.discountValue as number) * 100} %</dd>

                        <dt className="col-sm-3">Newsletter:</dt>
                        <dd className="col-sm-9 list-group-item mx-2">{accountDetails?.newsletter ? "yes" : "no"}</dd>
                    </dl>
                    <button className="btn btn-primary mt-4" onClick={logout}>Logout</button>
                </div>
                <div className="col-md-6 mt-4">
                    <h3>Address information</h3>
                    <AddressForm 
                        onSubmit={handleAddressSubmit}
                        address={accountDetails.address}
                        buttonText="Update address"
                    />
                </div>         
            </div>

            <div className="row">

                <div className="col-5">
                    <h3 className="mb-3">Orders</h3>
                    <table className="table table-bordered">
                        <thead className="table-light">
                        <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th style={{ width: "0", whiteSpace: "nowrap" }}></th>
                        </tr>
                        </thead>
                        <tbody>
                        {accountDetails?.orders.map(order => {
                            const orderDate = new Date(order.orderDate);
                            return (
                            
                            <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>{orderDate.toDateString()}</td>
                                    <td>{OrderStatus[order.status]}</td>
                                    <td>
                                        <div className="d-flex">
                                            <Link to={`/order/${order.id}`} className="btn btn-primary btn-sm mx-2">
                                                Details
                                            </Link>
                                        </div>
                                    </td>
                                    </tr>
                            )})}
                        </tbody>
                    </table>
                </div>

                {/* <div className="col-6 offset-1">
                    <h3 className="mb-3">Settings</h3>
                </div> */}

            </div>
        </div>
    )
})
