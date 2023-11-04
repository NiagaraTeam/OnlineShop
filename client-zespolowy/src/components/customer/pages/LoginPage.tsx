import { LoginForm } from "../forms/LoginForm"
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { Navigate } from "react-router-dom";

export const LoginPage = observer(() => {
    const {userStore: {isLoggedIn}} = useStore();

    console.log(isLoggedIn);

    if (isLoggedIn)
        return <Navigate to="/products"/>;

    return (
        <>
            {isLoggedIn && "Jesteś zalogowany"}
            <div className="p-4 col-6 offset-3">
                <LoginForm />
            </div>
        </>
    )
})
