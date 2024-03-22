import { observer } from "mobx-react-lite"
import { Link, NavLink } from "react-router-dom";
import { useStore } from "../../../app/stores/store";
import { IconContext } from "react-icons";
import { RiAccountCircleFill } from "react-icons/ri";
import { BiLogOut } from "react-icons/bi";

export const Header = observer(() => {
    const {userStore} = useStore();
    const {isLoggedIn, isAdmin, logout} = userStore;

    return (
        <>
            <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-xlg-between py-3 mb-4 border-bottom">
                <Link to="/" className="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none">
                    <h4>OnlineShop</h4>
                </Link>

                {isLoggedIn && isAdmin &&
                <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
                    <li><NavLink to="/admin/products" className="nav-link px-2 link-dark">Products</NavLink></li>
                    <li><NavLink to="/admin/orders" className="nav-link px-2 link-dark">Orders</NavLink></li>
                    <li><NavLink to="/admin/categories" className="nav-link px-2 link-dark">Categories</NavLink></li>
                    <li className="nav-item">
                        <a className="nav-link dropdown-toggle link-dark px-2" data-bs-toggle="dropdown" aria-expanded="false" role="button">
                            Payment & Shipping
                        </a>
                        <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li><NavLink to="/admin/methods/payment" className="dropdown-item">Payment Methods</NavLink></li>
                            <li><NavLink to="/admin/methods/shipping" className="dropdown-item">Shipping Methods</NavLink></li>
                        </ul>
                    </li>
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle link-dark px-2" data-bs-toggle="dropdown" aria-expanded="false" role="button">
                            Customers
                        </a>
                        <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li><NavLink to="/admin/customers" className="dropdown-item">Manage Customers</NavLink></li>
                            <li><NavLink to="/admin/newsletter" className="dropdown-item">Newsletter Settings</NavLink></li>
                        </ul>
                    </li>
                </ul>
                }

               
                <div className="col-md-3 text-end">
                {isLoggedIn && isAdmin
                ? 
                    <div className="btn px-2">
                        <div  className="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                            <IconContext.Provider value={{ size: "25px" }}>
                                <RiAccountCircleFill/> Admin
                            </IconContext.Provider>
                        </div>
                        <ul className="dropdown-menu">
                            <li><div className="dropdown-item" onClick={logout}><BiLogOut/> Logout</div></li>
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