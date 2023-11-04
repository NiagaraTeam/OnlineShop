import { RouteObject, createBrowserRouter } from "react-router-dom";
import { App } from "../layout/App";
import ServerError from "../../components/errors/ServerError";
import NotFound from "../../components/errors/NotFound";
import { LoginPage as CustomerLogin }  from "../../components/customer/pages/LoginPage";
import { LoginPage as AdminLogin }  from "../../components/admin/pages/LoginPage";
import { ManageProducts } from "../../components/admin/pages/ManageProducts";
import { AdminApp } from "../layout/AdminApp";
import { Products } from "../../components/customer/features/Products";
import { AccountPage } from "../../components/customer/pages/AccountPage";

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <App/>,
        children: [
            //login required as customer
            {path: 'account', element: <AccountPage />},
            
            //no login required
            {path: 'products', element: <Products />},
            {path: 'login', element: <CustomerLogin />},
            {path: 'server-error', element: <ServerError />},
            {path: '*', element: <NotFound />}
        ],
    },
    {
        path: '/admin',
        element: <AdminApp/>,
        children: [
            //login required as admin
            {path: 'products/manage', element: <ManageProducts/> },

            //no login required
            {path: 'login', element: <AdminLogin />},
        ]
    }
]

export const router = createBrowserRouter(routes);