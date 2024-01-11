import { useEffect } from 'react'
import './App.css'
import { observer } from 'mobx-react-lite'
import { useStore } from '../stores/store';
import { Link, Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import { Header } from '../../components/admin/common/Header';
import { Footer } from '../../components/common/Footer';
import Loading from '../../components/common/Loading';
import { ToastContainer } from 'react-toastify';
import { Helmet } from 'react-helmet-async';

export const AdminApp = observer(() => {
  const { commonStore, userStore } = useStore();

  const location = useLocation();
  
  useEffect(() => {
    commonStore.setApploaded(false);
    if (commonStore.token) {
      userStore.getUser()
        .then(() => commonStore.loadAdminAppData())
          .finally(() => commonStore.setAdminApploaded());
    } else {
      commonStore.loadAdminAppData()
        .finally(() => commonStore.setAdminApploaded());
    }
  }, [commonStore, userStore]);

  if (!commonStore.adminAppLoaded) 
    return <div className='center'><Loading/></div>

  return (
    <> 
      <Helmet>
        <title>Admin Panel - OnlineShop</title>
      </Helmet>
      <div className='container'>
        <ScrollRestoration/>
        <ToastContainer position='bottom-right' hideProgressBar theme='colored' style={{ width: '500px' }}/>
        <div className='wrapper'>
          <Header/>
            <div className='my-5'>
              {location.pathname === '/admin' 
              ? 
                <div className='text-center '>
                  <h1 className='mb-4'>Welcome to admin page</h1>
                  {(!userStore.isLoggedIn || !userStore.isAdmin) 
                  ?
                    <Link to={'/admin/login'} className='btn btn-primary' >Login</Link>
                  :
                    <Link to={'/admin/orders'} className='btn btn-primary' >Go to orders</Link>
                  }
                </div>
              : 
                <Outlet />
              }
            </div>
        </div>
        <Footer/>
      </div>
    </>
  )
})
