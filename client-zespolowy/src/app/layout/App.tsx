import { useEffect } from 'react'
import './App.css'
import { observer } from 'mobx-react-lite'
import { useStore } from '../stores/store';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Header } from '../../components/customer/common/Header';
import { Footer } from '../../components/customer/common/Footer';

export const App = observer(() => {
  const { commonStore, userStore } = useStore();

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
          {location.pathname === '/' 
          ? 
            <h1>strona głowna klienta</h1>
          : 
            <Outlet/>
          }
        <Footer/>
        </div>
    </>
  )
})

