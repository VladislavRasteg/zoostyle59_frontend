import React, {useContext, useEffect, useState} from 'react';
import {Container, Form, Card, Button} from "react-bootstrap";
import { useNavigate, useParams} from "react-router-dom";
import {CALENDAR_ROUTE} from "../utils/consts";
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import s from "./Page.module.scss";
import {motion} from "framer-motion";
import { ReactComponent as Logo } from '../assets/logo.svg';
import { showInvite, acceptInvite } from '../http/inviteAPI';

const Auth = observer(() => {
    const {user} = useContext(Context)
    const [invite, setInvite] = useState({link: '', personName: '', personMail: '', branchId: 0, isAdmin: false})
    const [name, setName] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')
    const [mail, setMail] = useState('')
    const [password, setPassword] = useState('')
    const [loginDirty, setLoginDirty] = useState(false)
    const [passwordDirty, setPasswordDirty] = useState(false)
    const [loginError, setLoginError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [formValid, setFormValid] = useState(false)
    const [error, setError] = useState('')

    const [pageError, setPageError] = useState(false)

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const navigate  = useNavigate()

    const {link} = useParams()

    useEffect(()=>{
        document.title = 'Приглашение в Zoostyle';
        showInvite(link).then((data: any) => {
            if(data.invite){
                setMail(data.invite.personMail)
                setName(data.invite.personName)
                setInvite(data.invite)
                if(!data.invite.isActive){
                    setPageError(true) 
                } else {
                    setPageError(false) 
                }
                
            } else {
                setPageError(true)
            }
        })
    }, [])


    const goHome = () => {
        navigate(CALENDAR_ROUTE)
    }

    const click = async () => {
        try {
            await acceptInvite(invite.link, invite.personName, invite.personMail, password, invite.isAdmin, invite.branchId).then((data: any) => {
                user.setRoles(user.user.role)
                user.setUser(data)
                user.setBranches(user.user.branches)
                user.setCurrentBranch(user.user.branchId)
                setTimeout(goHome, 2000)
            })
        } catch (e: any) {
            setError(e.response.data.message)
        }
    }

    const mailHandler = (e: any) => {
        setMail(e.target.value)
    }

    const nameHandler = (e: any) => {
        setName(e.target.value)
    }

    const passwordHandler = (e: any) => {
        if(e.target.value != repeatPassword || e.target.value.length < 6){
            setFormValid(false)
        } else {
            setFormValid(true)
        }
        setPassword(e.target.value)
    }

    const repeatPasswordHandler = (e: any) => {
        if(e.target.value != password || e.target.value.length < 6){
            setFormValid(false)
            setError('Пароль должен быть не менее 6 символов.')
            if(e.target.value != password){
                setError('Вы ввели разные пароли')
            }
        } else {
            setFormValid(true)
            setError('')
        }
        setRepeatPassword(e.target.value)
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

    if(pageError) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 40,  height: "90%" }}
                animate={{ opacity: 1, y: 0, height: "100%" }}
                exit={{ opacity: 0, y: 40, height: "90%" }}
                transition={{ duration: 0.4}}
                className={s.login_page}
            >
                <div className={s.header}>
                <Logo className={s.header_logo}/>
                </div>
                <Container className="d-flex h-100 w-100 justify-content-center align-items-center" style={{width: window.innerWidth - 328}}>
                    <Card style={{width: 600, background: "rgba(222, 31, 91, 0.08)", border: '1px solid #DE1F5B'}} className="p-5 rounded-4">
                        <h3 style={{fontFamily: "Inter", color: '#DE1F5B'}} className='m-auto'>Ошибка</h3>
                        <p style={{margin: 0, padding: 0, marginTop: 12, fontSize: 16, color: '#000'}}>Данное приглашение не существует<br/>или было отменено администратором</p>
                    </Card>
                </Container>
            </motion.div>
        )
    } else {
        return (
            <motion.div
                initial={{ opacity: 0, y: 40,  height: "90%" }}
                animate={{ opacity: 1, y: 0, height: "100%" }}
                exit={{ opacity: 0, y: 40, height: "90%" }}
                transition={{ duration: 0.4}}
                className={s.login_page}
            >
                <div className={s.header}>
                <Logo className={s.header_logo}/>
                </div>

                <Container className="d-flex h-100 w-100 justify-content-center align-items-center" style={{width: window.innerWidth - 328}}>
                    <Card style={{width: 600, background: "#FDFDFF"}} className="p-5 rounded-4">
                        <h3 style={{fontFamily: "Inter"}} className='m-auto'>Регистрация сотрудника</h3>
                        <Form className='d-flex flex-column'>
                            <Form.Control
                                name={'name'}
                                onBlur={e => blurHandler(e)}
                                style={{height: 50, marginTop: 32}}
                                placeholder="Ваше имя..."
                                value={name}
                                onChange={e => nameHandler(e)}
                                disabled
                            />
                            {(loginDirty && loginError) && <div className='text-bg-danger bg-opacity-50 text-lg-start p-1 mt-1 rounded-1'>{loginError}</div>}
                            <Form.Control
                                name={'mail'}
                                onBlur={e => blurHandler(e)}
                                style={{height: 50, marginTop: 12}}
                                placeholder="Ваша почта..."
                                value={mail}
                                onChange={e => mailHandler(e)}
                                disabled
                            />
                            {(loginDirty && loginError) && <div className='text-bg-danger bg-opacity-50 text-lg-start p-1 mt-1 rounded-1'>{loginError}</div>}
                            <Form.Control
                                name={'password'}
                                onBlur={e => blurHandler(e)}
                                style={{height: 50, marginTop: 12}}
                                placeholder="Ваш пароль..."
                                value={password}
                                onChange={e => passwordHandler(e)}
                                type="password"
                            />
                            <Form.Control
                                name={'repeatPassword'}
                                onBlur={e => blurHandler(e)}
                                style={{height: 50, marginTop: 12}}
                                placeholder="Повторите пароль..."
                                value={repeatPassword}
                                onChange={e => repeatPasswordHandler(e)}
                                type="password"
                            />
                            {error && <div className='text-bg-danger bg-opacity-50 text-lg-start p-1 mt-2 rounded-1'>{error}</div>}
                            <Button
                                disabled={!formValid}
                                style={{height: 50, marginTop: 22}}
                                variant={"outline-primary"}
                                onClick={click}
                            >
                                Зарегестрироваться
                            </Button>
                        </Form>
                    </Card>
                </Container>
            </motion.div>
        )
    }
})

export default Auth;