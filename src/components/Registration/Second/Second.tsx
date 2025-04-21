import React, { useEffect, useState } from 'react';
import { Container, Form, Card, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { ReactComponent as Logo } from '../../../assets/logo.svg';
import s from "../Registration.module.scss";
import { motion } from "framer-motion";
import { showRegistration, secondRegistration } from '../../../http/registrationAPI';
import { Notification } from '@arco-design/web-react';
import { Scrollbar } from 'react-scrollbars-custom';
import { LOGIN_ROUTE } from '../../../utils/consts';
import ym from 'react-yandex-metrika';
import {Title} from "@/shared/Title";
import {Input} from "@/shared/Input";

const Second = () => {
    const {id} = useParams()
    const navigate = useNavigate()

    const [tenantId, setTenantId] = useState(0)
    const [branchId, setBranchId] = useState(0)
    const [pageError, setPageError] = useState(false)

    const [companyName, setCompanyName] = useState<string>('')
    const [position, setPosition] = useState<string>('')

    useEffect(()=>{
        showRegistration(id).then((data: any) => {
            if(data.registration){
                ym('hit', '/registration/second');
                setTenantId(data.registration.tenantId)
                setBranchId(data.registration.branchId)
                setPageError(false)
            } else {
                setPageError(true)
            }
        })
    }, [])

    const onSubmit = async () => {
        await secondRegistration(id, tenantId, companyName, position, branchId)
        .then(() => {
			      ym('reachGoal','reg2')
            navigate(`/registration/third/${id}`)
        })
        .catch((e: any) => {
            console.log(e)
            Notification.error({
                title: 'Ошибка',
                content: e.response.data.message || e.message,
            })
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
                    <h3>Добро пожаловать!</h3>
                    <Scrollbar style={{height: "100%", maxHeight: 600, width: "100%"}}>
                        <p style={{margin: 0, padding: 0, marginTop: 0, fontSize: 18, color: '#000', width: "100%"}}>Давайте знакомиться, это займет не дольше минуты, расскажите нам о себе и своей компании.</p>
                        <br></br>
                        <Form className='d-flex flex-column'>
                            <Title className={s.field_title} title="Наименование компании" required/>
                            <Input placeholder="Ваша компания..." offAutoComplite value={companyName} onChange={setCompanyName}/>
                            <br></br>

                            <Title className={s.field_title} title="Ваша должность" required/>
                            <Input placeholder="Ваша должность..." offAutoComplite value={position} onChange={setPosition}/>

                            <Button
                                disabled={!companyName || !position}
                                style={{height: 60, marginTop: 26, width: "100%"}}
                                className={s.next_step_button}
                                variant={"primary"}
                                onClick={onSubmit}
                            >
                                <p style={{fontFamily: 'Inter',fontWeight: 400, fontSize: 16, padding: 0, margin: 0}}>Следующий шаг</p>
                            </Button>
                        </Form>
                    </Scrollbar>
                </div>
            </div>
        </div>
    )}
}


export default Second;
