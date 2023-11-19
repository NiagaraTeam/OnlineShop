import { observer } from "mobx-react-lite";
import { useStore } from "../stores/store";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export const RequireAdminAuth = observer(() => {
    const {userStore} = useStore();
    const {isLoggedIn, isAdmin} = userStore;

    const location = useLocation();

    if (!isLoggedIn || (isLoggedIn && !isAdmin)) {
        return <Navigate to="/admin/login" state={{from: location}} />
    }

    return <Outlet/>
})