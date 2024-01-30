import { Link, NavLink } from "react-router-dom";
import { useStore } from "../../../app/stores/store";
import { FaShoppingCart } from 'react-icons/fa';
import { RiAccountCircleFill } from 'react-icons/ri';
import { BiLogOut } from 'react-icons/bi';
import { FiList } from 'react-icons/fi';
import { IconContext } from "react-icons";
import { observer } from "mobx-react-lite";

export const Header = observer(() => {
    const {userStore, cartStore: {cartItems}} = useStore();
    const {isLoggedIn, isAdmin, user, logout} = userStore;

    return (
        <>
            <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
                <Link to="/" className="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none">
                    <h4>OnlineShop</h4>
                </Link>

                <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
                    <li><NavLink to="/products" className="nav-link px-2 link-dark">Products</NavLink></li>
                    <li><NavLink to="/offerts" className="nav-link px-2 link-dark">Offerts</NavLink></li>
                    {/* <li><NavLink to="/about" className="nav-link px-2 link-dark">About</NavLink></li>
                    <li><NavLink to="/contact" className="nav-link px-2 link-dark">Contact</NavLink></li> */}
                </ul>

               
                <div className="col-md-3 text-end">
                <Link to='/cart' className="btn px-2">
                        <IconContext.Provider value={{ size: "25px" }}>
                            <div>
                                <FaShoppingCart/> Cart {cartItems.length > 0 && `(${cartItems.length})`}
                            </div>
                        </IconContext.Provider>
                        </Link>
                {(isLoggedIn && !isAdmin)
                ? 
                    <div className="btn px-2">
                        <div  className="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                            <IconContext.Provider value={{ size: "25px" }}>
                                <RiAccountCircleFill/> {user?.userName}
                            </IconContext.Provider>
                        </div>
                        <ul className="dropdown-menu">
                            <li><Link className="dropdown-item" to='/account'><FiList/> Account</Link></li>
                            <li><div className="dropdown-item" onClick={logout}><BiLogOut/> Logout</div></li>
                        </ul>
                    </div>
                :   
                    <span className="px-3">
                        <Link to="login" className="btn btn-outline-primary me-2">Login</Link>
                        <Link to="register" className="btn btn-primary">Sign-up</Link>
                    </span> 
                }
                </div>
            </header>
        </>
    )
})