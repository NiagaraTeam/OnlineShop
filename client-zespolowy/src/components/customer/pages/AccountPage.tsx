import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import { LoginPage } from "./LoginPage";
import { OrderStatus } from "../../../app/models/enums/OrderStatus";
import Loading from "../../common/Loading";
import { Address } from "../../../app/models/onlineshop/Address";
import { AddressForm } from "../forms/AddressForm";

export const AccountPage = observer(() => {
    const {userStore: {user, isLoggedIn, isAdmin, logout, accountDetails, updateAddress}} = useStore();


    const handleAddressSubmit = (address: Address) => {
        if (user) {
            updateAddress(user.id, address);
        }
    };

    
    if (!isLoggedIn || isAdmin)
        return <LoginPage/>
    
    if (!user) return <></>

    if (!accountDetails) return <div className="text-center m-5"><Loading/></div>
    
    return (
        <>
        < div className="row">
            <div className="col-md-6">
                <h3>Account details</h3>
                <dl className="row list-group flex-column">
                    {/* <dt className="col-sm-3">Id:</dt>
                    <dd className="col-sm-9">{user.id}</dd> */}

                    <dt className="col-sm-3">Username:</dt>
                    <dd className="col-sm-9 list-group-item">{user.userName}</dd>

                    <dt className="col-sm-3">Email:</dt>
                    <dd className="col-sm-9 list-group-item">{user.email}</dd>

                    <dt className="col-sm-3">Discount:</dt>
                    <dd className="col-sm-9 list-group-item">-{(accountDetails?.discountValue as number) * 100} %</dd>

                    <dt className="col-sm-3">Newsletter:</dt>
                    <dd className="col-sm-9 list-group-item">{accountDetails?.newsletter ? "yes" : "no"}</dd>
                </dl>   
            </div>
            <div className="col-md-6">
                <h3>Adress information</h3>
                <AddressForm 
                    onSubmit={handleAddressSubmit}
                    address={accountDetails.address}
                    buttonText="Update address"
                />
            </div>         
        </div>
        <hr/>
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
