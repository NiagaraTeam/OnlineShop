import { RouteObject, createBrowserRouter } from "react-router-dom";
import { App } from "../layout/App";
import { RequireAuthCustomer } from "./RequireAuthCustomer";
import ServerError from "../../components/errors/ServerError";
import NotFound from "../../components/errors/NotFound";
import { LoginPage as CustomerLogin }  from "../../components/customer/pages/LoginPage";
import { LoginPage as AdminLogin }  from "../../components/admin/pages/LoginPage";
import { ProductsPage } from "../../components/admin/pages/ProductsPage";
import { RequireAuthAdmin } from "./RequireAuthAdmin";
import { AdminApp } from "../layout/AdminApp";

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <App/>,
        children: [
            //login required as customer
            {element: <RequireAuthCustomer />, children: [
                //{path: 'path-name', element: <ComponentName />},
                //..
            ]},
            //no login required
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
            {element: <RequireAuthAdmin />, children: [
                {path: 'products/manage', element: <ProductsPage/> },
                //{path: 'path-name', element: <ComponentName />},
                //..
            ]},
            {path: 'login', element: <AdminLogin />},
        ]
    }
]

export const router = createBrowserRouter(routes);