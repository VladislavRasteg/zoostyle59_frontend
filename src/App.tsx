import s from "./App.module.scss"
import React, {useContext, useEffect, useState} from 'react';
import {BrowserRouter} from 'react-router-dom';
import AppRouter from './components/AppRouter';
import Navbar from "./components/Navbar/Navbar";
import {Context} from "./index";
import {observer} from "mobx-react-lite";
import {check} from "./http/userAPI";
import {Spinner} from "react-bootstrap";
import {Notification} from "@arco-design/web-react";
import {ToastContainer} from 'react-toastify';
import "react-datepicker/dist/react-datepicker.css";
import 'react-toastify/dist/ReactToastify.css';
import 'swiper/css';
import {YMInitializer} from "react-yandex-metrika";

const App = observer(() => {
  const {user} = useContext(Context)
  const [loading, setLoading] = useState(true)

  const checkUserAuthorization = async () => {
    try {
      // @ts-ignore
      const data = await check()
      
      user.setUser(data)
      user.setRoles(data.role)

    } catch (e: any) {
      return (Notification.error({
        title: 'Ошибка',
        content: e?.response?.data?.message,
      }))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    document.title = 'Зоостиль - учет клиентов и автоматизация зоосалона'
    if (
      window.location.pathname !== '/login'
      && window.location.pathname.slice(0, 13) !== '/registration'
      && window.location.pathname.slice(0, 7) !== '/widget'
      && window.location.pathname.slice(0, 7) !== '/invite'
      && window.location.pathname !== '/password_recovery'
    ) {
      checkUserAuthorization()
    } else setLoading(false)
  }, [])


  if (loading) {
    return (
      <div style={{width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center"}}>
        <Spinner animation={"grow"} variant="primary"/></div>)
  }

  return (
    <div className={s.app_wrapper}>
      <BrowserRouter>
        <YMInitializer
          accounts={[97588053]}
          options={{
            defer: true,
            webvisor: true,
            clickmap: true,
            trackLinks: true,
            accurateTrackBounce: true,
          }}
          version="2"
        />
          {user.isAuth && (<Navbar/>)}
          <ToastContainer/>
          <div className={s.page}>
            <AppRouter/>
          </div>
      </BrowserRouter>
    </div>
  )
})

export default App;
