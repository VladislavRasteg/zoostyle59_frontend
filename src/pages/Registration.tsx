import React, { useEffect } from 'react';
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { LOGIN_ROUTE } from "../utils/consts";
import { observer } from "mobx-react-lite";
import s from "./Page.module.scss";
import { ReactComponent as Logo } from '../assets/logo.svg';
import First from '../components/Registration/First/First';

const Registration = observer(() => {

    const navigate = useNavigate()

    useEffect(() => {
        document.title = 'Зоостиль | Регистрация';
      }, []);

    return (
        <div className={s.login_page}>
            <div className={s.header}>
                <a href='https://zoostyle.com/'>
                    <Logo className={s.header_logo}/>
                </a>
                <Button
                    style={{padding: '18px 22px', borderRadius: '16px'}}
                    variant={"outline-primary"}
                    onClick={() => navigate(LOGIN_ROUTE)}
                >
                    Войти
                </Button>
            </div>
            <First />
        </div>
    )
})

export default Registration;