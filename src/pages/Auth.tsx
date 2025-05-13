import React, {useContext, useEffect, useState} from 'react';
import { Container, Form, Card, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { CALENDAR_ROUTE, REGISTRATION_ROUTE, PASSWORD_RECOVERY_ROUTE} from "../utils/consts";
import { signIn } from "../http/userAPI";
import { observer} from "mobx-react-lite";
import { Context} from "../index";
import s from "./Page.module.scss";
import {motion} from "framer-motion";
import { ReactComponent as Logo } from '../assets/logo.svg';

const Auth = observer(() => {
    const {user} = useContext(Context)

    const location = useLocation();
    const { password_changed } = location?.state || false;

    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [loginDirty, setLoginDirty] = useState(false)
    const [passwordDirty, setPasswordDirty] = useState(false)
    const [loginError, setLoginError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [formValid, setFormValid] = useState(true)
    const [error, setError] = useState('')

    const navigate  = useNavigate()

    useEffect(() => {
        document.title = 'Зоостиль | Авторизация';
    }, []);

    useEffect(()=>{
        if (loginError || passwordError) {
            setFormValid(false)
        } else {
            setFormValid(true)
        }

    }, [loginError, passwordError])

    const click = async () => {
        try {
            const data = await signIn(login, password)
            user.setUser(data)

            // @ts-ignore
            user.setRoles(data.role)

            if (user.isAuth) {
                navigate(CALENDAR_ROUTE)
            }
        } catch (e: any) {
            setError(e?.response?.data?.message)
        }
    }

    // const loginHandler = (e: any) => {
    //     setLogin(e.target.value)
    //     if (!isLogin) {
    //         const re = /^[a-zA-Z0-9_\.]+$/
    //         if(!re.test(String(e.target.value).toLowerCase())){
    //             setLoginError('Некорректный логин')
    //             if(!e.target.value) {
    //                 setLoginError('Логин не может быть пустым')
    //             }

    //         }else {
    //             setLoginError('')
    //         }
    //     } else {
    //             setLoginError('')
    //         }
    // }

    const loginHandler = (e: any) => {
        setLogin(e.target.value)
        setLoginError('')
    }

    // const passwordHandler = (e: any) => {
    //     setPassword(e.target.value)
    //     if (!isLogin) {
    //         if(e.target.value.length < 6 || e.target.value.length > 16){
    //             setPasswordError('Пароль должен содержать от 6 до 16 символов')
    //             if(!e.target.value) {
    //                 setPasswordError('Пароль не может быть пустым')
    //             }
    //             }else {
    //             setPasswordError('')
    //             }
    //     } else {
    //         setPasswordError('')
    //     }
    // }

    const passwordHandler = (e: any) => {
        setPassword(e.target.value)
        setPasswordError('')
    }

    const blurHandler = (e:any) => {
        switch(e.target.name){
            case 'login':
                setLoginDirty(true)
                break
            case 'password':
                setPasswordDirty(true)
                break
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 40,  height: "90%" }}
            animate={{ opacity: 1, y: 0, height: "100%" }}
            exit={{ opacity: 0, y: 40, height: "90%" }}
            transition={{ duration: 0.4}}
            className={s.login_page}
        >
            <div className={s.header}>
                <a href="https://zoostyle.com/">
                    <Logo className={s.header_logo}/>
                </a>
            </div>

            <Container className="d-flex h-100 w-100 justify-content-center align-items-center" style={{width: window.innerWidth - 328}}>
                <Card style={{width: '420px', boxSizing:'border-box', border: 'none', backgroundColor: "transparent"}} className="rounded-4 d-flex flex-column align-items-start">
                    { password_changed === 'true' && <h3 style={{fontFamily: "Inter", fontSize: '32px'}}>Пароль обновлён.</h3>}
                    <h3 style={{fontFamily: "Inter", fontSize: '32px'}}>Авторизация</h3>
                    <Form className='d-flex w-100 flex-column'>
                        <Form.Control
                            name={'login'}
                            onBlur={e => blurHandler(e)}
                            style={{ height: 59, marginTop: 32, borderRadius:'16px', fontSize: "16px"}}
                            placeholder="Ваш логин..."
                            value={login}
                            onChange={e => loginHandler(e)}
                        />
                        {(loginDirty && loginError) && <div className='text-bg-danger bg-opacity-50 text-lg-start p-1 mt-1 rounded-1'>{loginError}</div>}
                        <Form.Control
                            name={'password'}
                            onBlur={e => blurHandler(e)}
                            style={{height: 59, marginTop: 12, borderRadius:'16px', fontSize: "16px"}}
                            placeholder="Ваш пароль..."
                            value={password}
                            onChange={e => passwordHandler(e)}
                            type="password"
                        />
                        {(passwordDirty && passwordError) && <div className='text-bg-danger bg-opacity-50 text-lg-start p-1 mt-1 rounded-1'>{passwordError}</div>}
                        {error && <div className='text-bg-danger bg-opacity-50 text-lg-start p-1 mt-2 rounded-1'>{error}</div>}
                        <Button
                            disabled={!formValid}
                            style={{height: 59, marginTop: 22, borderRadius:'16px', background: "#FF813D", border: "none", outline: "none"}}
                            variant={"primary"}
                            onClick={click}
                        >
                            Войти
                        </Button>
                    </Form>
                </Card>
            </Container>
        </motion.div>
    )
})

export default Auth;