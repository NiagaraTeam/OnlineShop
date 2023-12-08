import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import { OrderStatus } from "../../../app/models/enums/OrderStatus";
import Loading from "../../common/Loading";
import { Address } from "../../../app/models/onlineshop/Address";
import { AddressForm } from "../forms/AddressForm";

export const AccountPage = observer(() => {
    const {userStore: {user, logout, accountDetails, updateAddress}} = useStore();

    const handleAddressSubmit = (address: Address) => {
        if (user) {
            updateAddress(user.id, address);
        }
    };
    
    if (!user) return <></>

    if (!accountDetails) return <div className="text-center m-5"><Loading/></div>
    
    return (
        <>
        <div className="row border-bottom pb-5 mb-5">
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

        <h3>Orders</h3>
                    {accountDetails?.orders.map(order => {
                        return (
                            <p key={order.id}>Id: {order.id} status: {OrderStatus[order.status]}</p>
                        )
                    })} 
        <button className="btn btn-primary mt-4" onClick={logout}>Logout</button>

        </>
    )
})
