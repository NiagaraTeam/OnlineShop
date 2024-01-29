import { observer } from "mobx-react-lite"
import { Link, NavLink } from "react-router-dom";
import { useStore } from "../../../app/stores/store";
import { IconContext } from "react-icons";
import { FaUser } from "react-icons/fa";

export const Header = observer(() => {
    const { userStore } = useStore();
    const { isLoggedIn, isAdmin, logout } = userStore;

    return (
        <>
            <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-between py-2 mb- border-bottom" style={{ backgroundColor: '#ecdefb' }}>
                
                <Link to="/" className="text-decoration-none">
                    <h1 className="new-color mb-0">BeautyShop</h1>
                </Link> 

                {isLoggedIn && isAdmin &&
                    <ul className="nav col-12 col-lg-auto mb-2 justify-content-center mb-lg-0">
                        <b><li><NavLink to="/admin/products" className="nav-link px-3 link-dark">Products</NavLink></li></b>
                        <b><li><NavLink to="/admin/orders" className="nav-link px-3 link-dark">Orders</NavLink></li></b>
                        <b><li><NavLink to="/admin/customers" className="nav-link px-3 link-dark">Customers</NavLink></li></b>
                        <b><li><NavLink to="/admin/categories" className="nav-link px-3 link-dark">Categories</NavLink></li></b>
                        <b><li><NavLink to="/admin/methods/payment" className="nav-link px-3 link-dark">Payment Methods</NavLink></li></b>
                        <b><li><NavLink to="/admin/methods/shipping" className="nav-link px-3 link-dark">Shipping Methods</NavLink></li></b>
                    </ul>
                }

                <div className="text-end">
                    {isLoggedIn && isAdmin
                        ? 
                            <div className="btn px-2">
                                <div className="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                    <IconContext.Provider value={{ size: "20px" }}>
                                        <FaUser /> Admin
                                    </IconContext.Provider>
                                </div>
                                <ul className="dropdown-menu">
                                    <li><div className="dropdown-item" onClick={logout}> Logout</div></li>
                                </ul>
                            </div>
                        :   
                            <span className="px-3">
                                <Link to="login" className="btn btn-outline-primary me-2">Login</Link>
                            </span> 
                    }
                </div>
            </header>
        </>
    )
})
