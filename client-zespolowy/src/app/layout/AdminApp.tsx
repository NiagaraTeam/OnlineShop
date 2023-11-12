import { useEffect } from 'react'
import './App.css'
import { observer } from 'mobx-react-lite'
import { useStore } from '../stores/store';
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import { Header } from '../../components/admin/common/Header';
import { Footer } from '../../components/common/Footer';

export const AdminApp = observer(() => {
  const { commonStore, userStore } = useStore();

  const location = useLocation();
  
  useEffect(() => {
    if (commonStore.token) {
      userStore.getUser().finally(() => commonStore.setApploaded());
    } else {
      commonStore.setApploaded();
    }
  }, [commonStore, userStore]);

  return (
    <>  
      <div className='container'>
        <ScrollRestoration/>
        <Header/>
        <div className='my-5'>
          {location.pathname === '/admin' 
          ? 
            <h1>Welcome to admin page</h1>
            //sprawdzenie czy jest zalogowany i wyświetlenie opcji w zależności od tego
          : 
            <Outlet />
          }
        </div>
        <Footer/>
      </div>
    </>
  )
})
