import ReactDOM from 'react-dom/client'
import './app/layout/App.css'
import "bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'react-toastify/dist/ReactToastify.min.css'
import { StoreContext, store } from './app/stores/store'
import { RouterProvider } from 'react-router-dom'
import { router } from './app/router/Routes'
import React from 'react';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StoreContext.Provider value={store}>
        <RouterProvider router={router}/>
    </StoreContext.Provider>
  </React.StrictMode>
)
