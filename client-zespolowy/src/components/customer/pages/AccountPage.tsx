import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import { LoginPage } from "./LoginPage";

export const AccountPage = observer(() => {
    const {userStore: {user, isLoggedIn, isAdmin, logout}} = useStore();
    
    if (!isLoggedIn || isAdmin)
        return <LoginPage/>
    
    return (
        <>
            <h2>Szczegóły konta</h2>
            <p>Username: {user?.userName}</p>
            <button className="btn btn-primary" onClick={logout}>Logout</button>
        </>
    )
})
