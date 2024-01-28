import { Link, NavLink } from "react-router-dom";
import { useStore } from "../../../app/stores/store";
import { FaCartArrowDown, FaCartPlus, FaSadCry, FaShoppingCart, FaUser } from 'react-icons/fa';
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
       
            <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-between py-2 mb- border-bottom" style={{ backgroundColor: '#ecdefb' }}>
                <Link to="/" className="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none">
                    <h1 className="new-color">BeautyShop</h1>
                </Link>

                <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
                    <b><li><NavLink to="/products" className="nav-link px-3 link-dark">Products</NavLink></li></b>
                    <b><li><NavLink to="/offerts" className="nav-link px-3 link-dark">Offerts</NavLink></li></b>
                </ul>

               
                <div className="col-md-3 text-end">
                <Link to='/cart' className="btn px-2">
                        <IconContext.Provider value={{ size: "25px" }}>
                            <div>
                                <b>Cart{cartItems.length > 0 && `(${cartItems.length})`}</b>
                            </div>
                        </IconContext.Provider>
                        </Link>
                {(isLoggedIn && !isAdmin)
                ? 
                    <div className="btn px-2">
                        <div  className="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                            <IconContext.Provider value={{ size: "20px" }}>
                                <FaUser/> {user?.userName}
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