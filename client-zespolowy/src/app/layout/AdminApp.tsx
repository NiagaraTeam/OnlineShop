import { useEffect } from 'react'
import './App.css'
import { observer } from 'mobx-react-lite'
import { useStore } from '../stores/store';
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import { Header } from '../../components/admin/common/Header';
import { Footer } from '../../components/common/Footer';
import Loading from '../../components/common/Loading';
import { ToastContainer } from 'react-toastify';

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
      <div className='container'>
        <ScrollRestoration/>
        <ToastContainer position='bottom-right' hideProgressBar theme='colored' />
        <div className='wrapper'>
        <Header/>
          <div className='my-5 '>
            {location.pathname === '/admin' 
            ? 
              <h1>Welcome to admin page</h1>
              //sprawdzenie czy jest zalogowany i wyświetlenie opcji w zależności od tego
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
