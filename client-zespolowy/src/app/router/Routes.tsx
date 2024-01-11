import { RouteObject, createBrowserRouter } from "react-router-dom";
import { App } from "../layout/App";
import ServerError from "../../components/errors/ServerError";
import NotFound from "../../components/errors/NotFound";
import { LoginPage as CustomerLogin }  from "../../components/customer/pages/LoginPage";
import { LoginPage as AdminLogin }  from "../../components/admin/pages/LoginPage";
import { AdminApp } from "../layout/AdminApp";
import { ProductsPage as CustomerProductsPage } from "../../components/customer/pages/ProductsPage";
import { AccountPage } from "../../components/customer/pages/AccountPage";
import { ProductsPage as AdminProductsPage } from "../../components/admin/pages/ProductsPage/ProductsPage";
import { OrdersPage } from "../../components/admin/pages/OrdersPage";
import { OrderDetailsPage } from "../../components/admin/pages/OrderDetailsPage/OrderDetailsPage";
import { ShippingMethodsPage } from "../../components/admin/pages/ShippingMethodsPage";
import { PaymentMethodsPage } from "../../components/admin/pages/PaymentMethodsPage";
import { CustomersPage } from "../../components/admin/pages/CustomersPage";
import { AboutPage } from "../../components/customer/pages/AboutPage";
import { ContactPage } from "../../components/customer/pages/ContactPage";
import { CartPage } from "../../components/customer/pages/CartPage/CartPage";
import { ProductDetailsPage } from "../../components/customer/pages/ProductDetailsPage/ProductDetailsPage";
import { RegisterPage } from "../../components/customer/pages/RegisterPage";
import { RequireCustomerAuth } from "./RequireCustomerAuth";
import { RequireAdminAuth } from "./RequireAdminAuth";
import { ManageCategoriesPage } from "../../components/admin/pages/ManageCategoriesPage";
import { DetailsPage } from "../../components/customer/pages/DetailsPage";
import { HomePage } from "../../components/customer/pages/HomePage";

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <App/>,
        children: [
            //login required as customer
            {element: <RequireCustomerAuth/>, children: [
                {path: 'account', element: <AccountPage />},
                {path: 'order/:id', element:<DetailsPage/>}
            ]},
            //no login required
            {path: 'products', element: <CustomerProductsPage />},
            {path: 'product/:id', element: <ProductDetailsPage />},
            {path: 'offerts', element: <HomePage title='Offerts - OnlineShop'/>},
            {path: 'cart', element: <CartPage />},
            {path: 'about', element: <AboutPage />},
            {path: 'contact', element: <ContactPage />},
            
            {path: 'login', element: <CustomerLogin />},
            {path: 'register', element: <RegisterPage />},

            {path: 'server-error', element: <ServerError />},
            {path: 'not-found', element: <NotFound />},
            {path: '*', element: <NotFound />},
            
        ],
    },
    {
        path: '/admin',
        element: <AdminApp/>,
        children: [
            //login required as admin
            {element: <RequireAdminAuth/>, children: [
                {path: 'products', element: <AdminProductsPage/> },
                {path: 'orders', element: <OrdersPage/> },
                {path: 'order/:id', element: <OrderDetailsPage/> },
                {path: 'categories', element: <ManageCategoriesPage/> },
                {path: 'methods/shipping', element: <ShippingMethodsPage/> },
                {path: 'methods/payment', element: <PaymentMethodsPage/> },
                {path: 'customers', element: <CustomersPage/> },
            ]},
            //no login required
            {path: 'login', element: <AdminLogin />},
            {path: 'not-found', element: <NotFound />},
            {path: '*', element: <NotFound />}
        ]
    }
]

export const router = createBrowserRouter(routes);