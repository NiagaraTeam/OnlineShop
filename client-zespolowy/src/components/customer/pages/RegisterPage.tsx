import { observer } from "mobx-react-lite"
import { useStore } from "../../../app/stores/store";
import { Navigate } from "react-router-dom";
import { RegisterForm } from "../forms/RegisterForm";

export const RegisterPage = observer(() => {
  const {userStore: {isLoggedIn, isAdmin}} = useStore();

    if (isLoggedIn && !isAdmin)
        return <Navigate to="/products"/>;

    return (
        <>
            <div className="p-4 col-4 offset-4">
                <h3 className="text-center mb-5">Sign up to OnlineShop</h3>
                <RegisterForm />
            </div>
        </>
    )
})
