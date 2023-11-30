import { observer } from "mobx-react-lite"
import { useStore } from "../../../app/stores/store";
import { Navigate } from "react-router-dom";
import { LoginForm } from "../../common/forms/LoginForm";

export const LoginPage = observer(() => {
    const {userStore: {isLoggedIn, isAdmin}} = useStore();

    if (isLoggedIn && isAdmin)
        return <Navigate to="/admin/orders"/>;

    return (
        <>
            <div className="p-4 col-4 offset-4">
                <h3 className="text-center mb-5">Admin login page</h3>
                <LoginForm customerLogin={false}/>
            </div>
        </>
    )
})