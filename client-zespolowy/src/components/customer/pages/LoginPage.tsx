import { LoginForm } from "../../common/forms/LoginForm"
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { Navigate } from "react-router-dom";

interface Props {
    redirectTo?: string;
}

export const LoginPage = observer(({redirectTo = "/"}: Props) => {
    const {userStore: {isLoggedIn, isAdmin}} = useStore();

    if (isLoggedIn && !isAdmin)
        return <Navigate to={redirectTo}/>;

    return (
        <>
            <div className="p-4 col-4 offset-4">
                <h3 className="text-center mb-5">Login to OnlineShop</h3>
                <LoginForm />
            </div>
        </>
    )
})
