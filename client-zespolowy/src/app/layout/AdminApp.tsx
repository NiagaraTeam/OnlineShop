import { useEffect } from 'react'
import './App.css'
import { observer } from 'mobx-react-lite'
import { useStore } from '../stores/store';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Header } from '../../components/admin/common/Header';
import { Footer } from '../../components/admin/common/Footer';

export const AdminApp = observer(() => {
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
        <ScrollRestoration/>
        <Header/>
        <Outlet/>
        <Footer/>
    </>
  )
})
