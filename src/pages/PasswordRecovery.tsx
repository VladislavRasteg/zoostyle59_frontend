import {useContext, useEffect, useRef, useState} from 'react';
import { Container, Form, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { LOGIN_ROUTE, REGISTRATION_ROUTE } from "../utils/consts";
import { findEmail, recoveryPassword, checkCode } from "../http/userAPI";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import s from "./Page.module.scss";
import { motion } from "framer-motion";
import { ReactComponent as Logo } from '../assets/logo.svg';


type RefInputCode = Array<HTMLInputElement>

const Auth = observer(() => {
    const {user} = useContext(Context)
    const TIMER_AMOUNT = 10

    const navigate  = useNavigate()
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    const [verificationCodeError, setVerificationCodeError] = useState('')
    const [emailDirty, setEmailDirty] = useState(false)
    const [passwordDirty, setPasswordDirty] = useState(false)
    const [formValid, setFormValid] = useState(true)
    const [recoveryStage, setRecoveryStage] = useState('need_email')
    const [code, setCode] = useState(['', '', '', '', '', ''])
    const [error, setError] = useState('')

    const [reSendTime, setReSendTime] = useState(TIMER_AMOUNT)
    const intervalRef = useRef<number | null>(null);

    const [newPassword, setNewPassword] = useState('')
    const [newPasswordRepeat, setNewPasswordRepeat] = useState('')
    const [passwordError, setPasswordError] = useState('')

    const refInputCode = useRef<RefInputCode>([])

    useEffect(() => {
        document.title = 'Зоостиль | Восстановление пароля';
    }, []);

    const submitEmail = async () => {
        if (email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            try {
                const result = await findEmail(email)
                setRecoveryStage('waiting_code')
                setFormValid(true)
                startInterval()
            }
            catch(e: any) {
                setEmailDirty(true)
                setEmailError(e.response.data.message)
            }
        }  
        else {
            setEmailDirty(true)
            setEmailError('Введите корректный e-mail')
        }
    }

    const checkRecoveryCode = async () => {
        try {
            const inputCode = code.join('')
            if(inputCode.length === 6) {
                const verdict = await checkCode(email, inputCode)
                if (verdict) {
                    if (verdict.a_lot_attempts) {
                        setRecoveryStage('suspicious_activity')
                        return false
                    }
                    setRecoveryStage('new_password')
                    return true
                }
                else {
                    setVerificationCodeError('Код введён неверно')
                    return false
                }
            }
        }
        catch(e: any) {
            setVerificationCodeError('Произошла ошибка')
            return false
        }
    }

    const submitNewPassword = async () => {
        try {
            const data = await recoveryPassword(email, newPassword)
            user.setUser(data)
            user.setRoles(user.user.role)
            user.setCurrentBranch(user.user.branchId)
            user.setBranches(user.user.branches)
            navigate(LOGIN_ROUTE, { state: { password_changed: 'true' } });
        } catch (e: any) {
            setError(e.response.data.message)
        }
    }

    const contactWithUs = () => {
        window.location.href = "mailto:hello@zoostyle.com"
    }

    useEffect(()=>{
        if (!!emailError) {
            setFormValid(false)
        } else {
            setFormValid(true)
        }

    }, [emailError])

    useEffect(() => {
        const inputCode = code.join('')
        if(inputCode.length === 6) {
            checkRecoveryCode()
        }
    }, [code])

    const emailHandler = (e: any) => {
        setEmail(e.target.value)
        setEmailError('')
    }

    const startInterval = () => {
        if (intervalRef.current !== null) return;
        setReSendTime(TIMER_AMOUNT)
        intervalRef.current = window.setInterval(() => {
            setReSendTime((reSendTime) => reSendTime - 1)
        }, 1000);
    };
    const stopInterval = () => {
        if (intervalRef.current) {
            window.clearInterval(intervalRef.current);
            setReSendTime(0);
            intervalRef.current = null;
        }
    };

    useEffect(() => {
        if(reSendTime === 0) {
            stopInterval()
        }
    }, [reSendTime])

    const passwordHandler = (e: any) => {
        setNewPassword(e.target.value)
        setPasswordError('')
    }

    const codeDigitsHandler = (e: any) => {
        if(e.target.value.length > 1) {
            const startInputNumber = parseInt(e.target.name[e.target.name.length-1])-1
            let positionsToFill = startInputNumber + e.target.value.length
            
            if( positionsToFill > 6) positionsToFill = 6

            let newCode = structuredClone(code)
            for(let i = startInputNumber, pastedValueIterator = 0; i < positionsToFill; i++, pastedValueIterator++) {
                newCode[i] = e.target.value[pastedValueIterator]
            }
            setCode(newCode)
        }
        else {
            const currentInputNumber = parseInt(e.target.name[e.target.name.length-1])-1
            let newCode = structuredClone(code)
            newCode[currentInputNumber] = e.target.value
            setCode(newCode)
            if(e.target.value !== '' && currentInputNumber !== 5) {
                refInputCode.current[currentInputNumber+1].focus()
            }
        }
    }
 
    const blurHandler = (e:any) => {
        switch(e.target.name){
            case 'email': {
                if (email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                    setEmailDirty(true)
                }
                else {
                    setEmailError('Введите корректный e-mail')
                }
                break
            }
            case 'password': {
                if(newPassword.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/)) {
                    setPasswordDirty(true)
                    console.log(newPassword)
                }
                else {
                    setPasswordError('Введите корректный пароль')
                }
            }
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
                <Logo className={s.header_logo}/>
                <Button 
                    className='d-flex align-items-center'
                    style={{padding: '22px', height: '54px', borderRadius: '16px'}}
                    variant={"outline-primary"}
                    onClick={() => navigate(REGISTRATION_ROUTE)}
                >
                    Регистрация
                </Button>
            </div>

            <Container className="d-flex h-100 w-100 justify-content-center align-items-center" style={{width: window.innerWidth - 328}}>
                {
                    recoveryStage === 'need_email' &&
                    <motion.div
                        initial={{ opacity: 0, y: 40,  height: "90%" }}
                        animate={{ opacity: 1, y: 0, height: "100%" }}
                        exit={{ opacity: 0, y: 40, height: "90%" }}
                        transition={{ duration: 0.4}}
                        className={s.login_page}
                    >
                        <Card style={{width: '420px', boxSizing:'border-box', border: 'none', background: "none"}} className={`rounded-4 d-flex flex-column align-items-start ${s.card}`}>
                            <div className="d-flex justify-content-start">
                                <Button
                                    className={s.back_button}
                                    onClick={() => navigate(-1)}
                                >
                                    Назад
                                </Button>
                            </div>
                            <h3 style={{fontFamily: "Inter", fontSize: '32px', marginTop:'32px'}} onClick={() => navigate(-1)}>Восстановление пароля</h3>
                            <Form className='d-flex w-100 flex-column'>
                                <Form.Control
                                    name={'login'}
                                    onBlur={e => blurHandler(e)}
                                    style={{ fontSize:'16px', height: 59, marginTop: 32, borderRadius:'23px'}}
                                    placeholder="Ваша почта"
                                    value={email}
                                    onChange={e => emailHandler(e)}
                                />
                                {(emailDirty && emailError) && <div className='text-bg-danger bg-opacity-50 text-lg-start p-1 mt-1 rounded-1'>{emailError}</div>}
                                <Button
                                    disabled={!formValid}
                                    style={{height: 59, marginTop: 22, borderRadius:'23px'}}
                                    variant={"primary"}
                                    onClick={() => submitEmail()}
                                >
                                    Продолжить
                                </Button>
                            </Form>
                        </Card>
                    </motion.div>
                }
                {
                    recoveryStage === "waiting_code" &&
                    <motion.div
                        initial={{ opacity: 0, y: 40,  height: "90%" }}
                        animate={{ opacity: 1, y: 0, height: "100%" }}
                        exit={{ opacity: 0, y: 40, height: "90%" }}
                        transition={{ duration: 0.4}}
                        className={s.login_page}
                    >
                        <Card style={{width: '420px', boxSizing:'border-box', border: 'none', background: "none"}} className={`rounded-4 d-flex flex-column align-items-start ${s.card}`}>
                            <div className="d-flex justify-content-start">
                                <Button
                                    className={s.back_button}
                                    onClick={() => setRecoveryStage("need_email")}
                                >
                                    Назад
                                </Button>
                            </div>
                            <h3 style={{fontFamily: "Inter", fontSize: '32px', marginTop:'32px', background: "none"}} onClick={() => navigate(-1)}>Введите код из письма</h3>
                            <div className={s.info_label}>Мы отправили письмо с кодом на почту</div>
                            <div className={s.info_email}>{email}</div>
                            <Form className='d-flex w-100 flex-column'>
                                <div className="d-flex flex-row w-100 justify-content-between" style={{ marginTop: 32}}>
                                    <Form.Control
                                        name={'code_1'}
                                        ref={(e: any) => refInputCode.current[0] = e}
                                        onBlur={e => blurHandler(e)}
                                        className={s.codeInput}
                                        placeholder="0"
                                        type='number'
                                        min='0'
                                        max='9'
                                        maxLength={1}
                                        value={code[0]}
                                        onFocus={e => {e.target.select()}}
                                        onChange={e => {codeDigitsHandler(e)}}
                                    />
                                    <Form.Control
                                        name={'code_2'}
                                        ref={(e: any) => refInputCode.current[1] = e}
                                        onBlur={e => blurHandler(e)}
                                        className={s.codeInput}
                                        placeholder="0"
                                        type='number'
                                        min='0'
                                        max='9'
                                        maxLength={1}
                                        value={code[1]}
                                        onFocus={e => {e.target.select()}}
                                        onChange={e => codeDigitsHandler(e)}
                                    />
                                    <Form.Control
                                        name={'code_3'}
                                        ref={(e: any) => refInputCode.current[2] = e}
                                        onBlur={e => blurHandler(e)}
                                        className={s.codeInput}
                                        placeholder="0"
                                        type='number'
                                        min='0'
                                        max='9'
                                        maxLength={1}
                                        value={code[2]}
                                        onFocus={e => {e.target.select()}}
                                        onChange={e => codeDigitsHandler(e)}
                                    />
                                    <Form.Control
                                        name={'code_4'}
                                        ref={(e: any) => refInputCode.current[3] = e}
                                        onBlur={e => blurHandler(e)}
                                        className={s.codeInput}
                                        placeholder="0"
                                        type='number'
                                        min='0'
                                        max='9'
                                        maxLength={1}
                                        value={code[3]}
                                        onFocus={e => {e.target.select()}}
                                        onChange={e => codeDigitsHandler(e)}
                                    />
                                    <Form.Control
                                        name={'code_5'}
                                        ref={(e: any) => refInputCode.current[4] = e}
                                        onBlur={e => blurHandler(e)}
                                        className={s.codeInput}
                                        placeholder="0"
                                        type='number'
                                        min='0'
                                        max='9'
                                        maxLength={1}
                                        value={code[4]}
                                        onFocus={e => {e.target.select()}}
                                        onChange={e => codeDigitsHandler(e)}
                                    />
                                    <Form.Control
                                        name={'code_6'}
                                        ref={(e: any) => refInputCode.current[5] = e}
                                        onBlur={e => blurHandler(e)}
                                        className={s.codeInput}
                                        placeholder="0"
                                        type='number'
                                        min='0'
                                        max='9'
                                        maxLength={1}
                                        value={code[5]}
                                        onFocus={e => {e.target.select()}}
                                        onChange={e => codeDigitsHandler(e)}
                                    />
                                </div>
                                <span
                                    className='d-flex justify-content-start'
                                    style={{ color:"#E56384", marginTop: '22px' }}
                                >
                                    {verificationCodeError}
                                </span>
                                {
                                    reSendTime === 0 &&
                                    <Button
                                        disabled={!formValid}
                                        style={{height: 59, marginTop: 22, borderRadius:'23px', backgroundColor: '#EDF3FC', border: 'none', color: '#FF813D'}}
                                        onClick={() => submitEmail()}
                                    >
                                        Повторить отправку
                                    </Button>
                                }
                                {
                                    reSendTime !== 0 &&
                                    <Button
                                        style={{height: 59, marginTop: 22, borderRadius:'23px', backgroundColor: '#F5F6F8', border: 'none', color: 'rgba(67, 88, 117, 0.8)'}}
                                    >
                                        Повторить отправку - {reSendTime} сек.
                                    </Button>
                                }
                            </Form>
                        </Card>
                    </motion.div>
                }
                {
                    recoveryStage === 'new_password' &&
                    <motion.div
                        initial={{ opacity: 0, y: 40,  height: "90%" }}
                        animate={{ opacity: 1, y: 0, height: "100%" }}
                        exit={{ opacity: 0, y: 40, height: "90%" }}
                        transition={{ duration: 0.4}}
                        className={s.login_page}
                    >
                        <Card style={{width: '420px', boxSizing:'border-box', border: 'none', background: 'none'}} className={`rounded-4 d-flex flex-column align-items-start ${s.card}`}>
                            <div className="d-flex justify-content-start">
                                <Button
                                    className={s.back_button}
                                    onClick={() => navigate(-1)}
                                >
                                    Назад
                                </Button>
                            </div>
                            <h3 style={{fontFamily: "Inter", fontSize: '32px', marginTop:'32px'}} onClick={() => navigate(-1)}>Новый пароль</h3>
                            <Form className='d-flex w-100 flex-column'>
                                <Form.Control
                                    name={'password'}
                                    onBlur={e => blurHandler(e)}
                                    style={{ fontSize:'16px', height: 59, marginTop: 32, borderRadius:'23px'}}
                                    placeholder="Пароль"
                                    type="password"
                                    value={newPassword}
                                    onChange={e => passwordHandler(e)}
                                />
                                <Form.Control
                                    name={'passwordRepeat'}
                                    onBlur={e => blurHandler(e)}
                                    style={{ fontSize:'16px', height: 59, marginTop: 12, borderRadius:'23px'}}
                                    placeholder="Подтвердите пароль"
                                    type="password"
                                    value={newPasswordRepeat}
                                    onChange={e => setNewPasswordRepeat(e.target.value)}
                                />
                                { (passwordError && passwordDirty) &&
                                    <span className='d-flex justify-content-start' style={{ color:"#E56384", marginTop: '22px' }}>
                                        {passwordError}
                                    </span>
                                }
                                {error && <div className='text-bg-danger bg-opacity-50 text-lg-start p-1 mt-2 rounded-1'>{error}</div>}
                                <Button
                                    disabled={!formValid}
                                    style={{height: 59, marginTop: 22, borderRadius:'23px'}}
                                    variant={"primary"}
                                    onClick={() => submitNewPassword()}
                                >
                                    Подтвердить
                                </Button>
                            </Form>
                        </Card>
                    </motion.div>
                }
                {
                    recoveryStage === 'suspicious_activity' &&
                    <motion.div
                        initial={{ opacity: 0, y: 40,  height: "90%" }}
                        animate={{ opacity: 1, y: 0, height: "100%" }}
                        exit={{ opacity: 0, y: 40, height: "90%" }}
                        transition={{ duration: 0.4}}
                        className={s.login_page}
                    >
                        <Card style={{width: '445px', boxSizing:'border-box', border: 'none'}} className={`rounded-4 d-flex flex-column align-items-start ${s.card}`}>
                            <div className="d-flex justify-content-start">
                                <Button
                                    className={s.back_button}
                                    onClick={() => navigate(-1)}
                                >
                                    Назад
                                </Button>
                            </div>
                            <h3 style={{fontFamily: "Inter", fontSize: '32px', marginTop:'32px'}} onClick={() => navigate(-1)}>Свяжитесь с нами</h3>
                            <div className={s.info_label} style={{marginTop:'24px'}}>
                                {`Мы зафиксирвоали подозрительную активность, связанную с аккаунтом `}<span className={s.info_email}>{email}</span>
                            </div>
                            <div className={s.info_label} style={{ marginTop: '8px' }}>
                                {`Пожалуйста, свяжитесь с нами для восстановления аккаунта: `}<span className={s.info_email}>hello@zoostyle.com</span>
                            </div>
                            <Button
                                disabled={!formValid}
                                style={{height: 59, width: '100%', marginTop: 32, borderRadius:'23px', backgroundColor: '#EDF3FC', color: '#FF813D', border: 'none'}}
                                onClick={() => contactWithUs()}
                            >
                                hello@zoostyle.com
                            </Button>
                        </Card>
                    </motion.div>
                }
            </Container>
        </motion.div>
    )
})

export default Auth;