import { useEffect } from 'react'
import './App.css'
import { observer } from 'mobx-react-lite'
import { useStore } from '../stores/store';
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import { Header } from '../../components/customer/common/Header';
import { Footer } from '../../components/common/Footer';
import Loading from '../../components/common/Loading';
import { ToastContainer } from 'react-toastify';
import { HomePage } from '../../components/customer/pages/HomePage';
import { Helmet } from 'react-helmet-async';

export const App = observer(() => {
  const { commonStore, userStore } = useStore();

  const location = useLocation();

  useEffect(() => {
    commonStore.setAdminApploaded(false);
    if (commonStore.token) {
      commonStore.loadAppData()
        .then(() => userStore.getUser()
          .then(() => userStore.loadAccountDetails())
          .finally(() => commonStore.setApploaded()));
      
    } else {
      commonStore.loadAppData()
        .finally(() => commonStore.setApploaded());
    }
  }, [commonStore, userStore]);

  if (!commonStore.appLoaded) 
    return <div className='center'><Loading/></div>

  return (
    <>
      <Helmet>
        <title>BeautyShop</title>
      </Helmet>
      <div className='container'>
        <ScrollRestoration/>
        <ToastContainer position='bottom-right' hideProgressBar theme='colored' style={{ width: '500px' }}/>
        <div className="wrapper">
          <Header/>
          <div className='my-5'>
            {location.pathname === '/' 
            ? 
              <HomePage title='BeautyShop'/>
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

