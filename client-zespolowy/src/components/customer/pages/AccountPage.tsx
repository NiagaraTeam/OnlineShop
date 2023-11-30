import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import { LoginPage } from "./LoginPage";
import { OrderStatus } from "../../../app/models/enums/OrderStatus";

export const AccountPage = observer(() => {
    const {userStore: {user, isLoggedIn, isAdmin, logout, accountDetails}} = useStore();
    
    if (!isLoggedIn || isAdmin)
        return <LoginPage/>
    
    if (!user) return <></>
    
    return (
        <>
            <h3>Account details</h3>
                <p>Id: {user.id}</p>
                <p>Username: {user.userName}</p>
                <p>Email: {user.email}</p>
                <p>Discount: -{(accountDetails?.discountValue as number) * 100} %</p>
                <p>Newsletter: {accountDetails?.newsletter ? "yes" : "no"}</p>

            <h3>Orders</h3>
                {accountDetails?.orders.map(order => {
                    return (
                    <>
                        <p>Id: {order.id} status: {OrderStatus[order.status]}</p>
                    </>
                    )
                })}

            <h3>Address</h3>
                <p>AddressLine1: {accountDetails?.address.addressLine1}</p>
                <p>AddressLine2: {accountDetails?.address.addressLine2}</p>
                <p>City: {accountDetails?.address.city}</p>
                <p>ZipCode: {accountDetails?.address.zipCode}</p>
                <p>Country: {accountDetails?.address.country}</p>

            <button className="btn btn-primary mt-4" onClick={logout}>Logout</button>
        </>
    )
})
