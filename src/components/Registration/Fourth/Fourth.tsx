import React, { useEffect, useState } from 'react';
import { Container, Form, Card, Button, Dropdown } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import s from "../Registration.module.scss";
import { motion } from "framer-motion";
import { showRegistration, fourthRegistration } from '../../../http/registrationAPI';
import { Notification } from '@arco-design/web-react';
import { ReactComponent as Logo } from '../../../assets/logo.svg';
import { LOGIN_ROUTE } from '../../../utils/consts';
import { Scrollbar } from 'react-scrollbars-custom';
import ym from 'react-yandex-metrika';
import {Title} from "@/shared/Title";
import {Input} from "@/shared/Input";
import {MenuItem, Select} from "@/shared/Select";

const Fourth = () => {
    const {id} = useParams()
    const navigate = useNavigate()

    const [tenantId, setTenantId] = useState(0)
    const [pageError, setPageError] = useState(false)

    const [businessType, setBusinessType] = useState('')
    const [employeeCount, setEmployeeCount] = useState('')

    useEffect(()=>{
        showRegistration(id).then((data: any) => {
            if(data.registration){
                ym('hit', '/registration/fourth');
                setTenantId(data.registration.tenantId)
                setPageError(false)
            } else {
                setPageError(true)
            }
        })
    }, [])

    const onSubmit = async () => {
        await fourthRegistration(id, businessType, employeeCount)
        .then(() => {
            ym('reachGoal','reg4')
            navigate(`/`)
        })
        .catch(e => {
            return( Notification.error({
                title: 'Ошибка',
                content: e.response.data.message || e.message,
            }))
        })
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
                <Container className="d-flex h-100 w-100 justify-content-center align-items-center" style={{width: window.innerWidth - 328}}>
                    <Card style={{width: 600, background: "rgba(222, 31, 91, 0.08)", border: '1px solid #DE1F5B'}} className="p-5 rounded-4">
                        <h3 style={{fontFamily: "Inter", color: '#DE1F5B'}} className='m-auto'>Ошибка</h3>
                        <p style={{margin: 0, padding: 0, marginTop: 12, fontSize: 16, color: '#000'}}>Такой страницы не существует</p>
                    </Card>
                </Container>
            </motion.div>
        )
    } else {
    return (
        <div className={s.login_page}>
            <div className={s.header}>
                <Logo className={s.header_logo}/>
                <Button
                    style={{padding: '18px 22px', borderRadius: '16px'}}
                    variant={"outline-primary"}
                    onClick={() => navigate(LOGIN_ROUTE)}
                >
                    Войти
                </Button>
            </div>
            <div className={s.registration_background}>
                <div className={s.card_container}>
                    <h3>Последний шаг</h3>
                    <Scrollbar style={{height: "100%", maxHeight: 600, width: "100%"}}>
                        <div className={s.fields_group}>
                            <p style={{margin: 0, padding: 0, marginTop: 0, fontSize: 18, color: '#000'}}>Это поможет нам улучшить систему и настроить её для вас.</p>
                            <br></br>
                            <Form className='d-flex flex-column'>
                                <Title className={s.field_title} title="Сфера вашего бизнеса" required/>
                                <Input placeholder="Сфера бизнеса..." offAutoComplite value={businessType} onChange={setBusinessType}/>
                                <br></br>

                                <Title className={s.field_title} title="Сколько сотрудников в вашей компании?" required/>
                                <Select
                                  value={employeeCount || ''}
                                  onChange={(e: any) => setEmployeeCount(e.target.value)}
                                >
                                    <MenuItem value={'1'}>1</MenuItem>
                                    <MenuItem value={'2-4'}>2-4</MenuItem>
                                    <MenuItem value={'5-7'}>5-7</MenuItem>
                                    <MenuItem value={'8-14'}>8-14</MenuItem>
                                    <MenuItem value={'15+'}>15+</MenuItem>
                                </Select>
                                <Button
                                    disabled={!businessType || !employeeCount}
                                    style={{height: 60, marginTop: 26, width: "100%"}}
                                    className={s.next_step_button}
                                    variant={"primary"}
                                    onClick={onSubmit}
                                >
                                    <p style={{fontFamily: 'Inter',fontWeight: 400, fontSize: 16, padding: 0, margin: 0}}>Завершить регистрацию</p>
                                </Button>
                                
                            </Form>
                        </div>
                    </Scrollbar>
                </div>
            </div>
        </div>
    )}
}


export default Fourth;
