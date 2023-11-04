import { observer } from "mobx-react-lite";
import { useStore } from "../stores/store";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export const RequireAuthCustomer = observer(() => {
    const {userStore: {isLoggedIn, isAdmin}} = useStore();
    const location = useLocation();

    if (isLoggedIn && !isAdmin)
        return <Outlet/>

    return <Navigate to="/login" state={{from: location}} />
})