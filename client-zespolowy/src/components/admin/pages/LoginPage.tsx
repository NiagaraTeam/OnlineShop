import { observer } from "mobx-react-lite"
import { useStore } from "../../../app/stores/store";
import { Navigate } from "react-router-dom";
import { LoginForm } from "../../common/forms/LoginForm";
import { Helmet } from "react-helmet-async";

export const LoginPage = observer(() => {
    const {userStore: {isLoggedIn, isAdmin}} = useStore();

    if (isLoggedIn && isAdmin)
        return <Navigate to="/admin/orders"/>;

        return (
            <>
                <Helmet>
                    <title>Admin Login - BeautyShop</title>
                </Helmet>
                <div className="text-center">
                    <div className="frame-container">
                        <div className="p-4 col-lg-4 offset-lg-4">
                            <h3 className="new-color text-center mb-5">ADMIN LOGIN PAGE</h3>
                            <LoginForm customerLogin={false}/>
                        </div>
                    </div>
                </div>
            </>
        );
        
})