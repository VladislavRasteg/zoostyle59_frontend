import React, { useEffect, useState } from 'react';
import { Container, Form, Card, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { ReactComponent as Logo } from '../../../assets/logo.svg';
import s from "../Registration.module.scss";
import { motion } from "framer-motion";
import { showRegistration, thirdRegistration } from '../../../http/registrationAPI';
import { Notification } from '@arco-design/web-react';
import { LOGIN_ROUTE } from '../../../utils/consts';
import { Scrollbar } from 'react-scrollbars-custom';
import ym from 'react-yandex-metrika';
import {Title} from "@/shared/Title";
import {Input} from "@/shared/Input";

const Third = () => {
    const {id} = useParams()
    const navigate = useNavigate()

    const [branchId, setBranchId] = useState(0)
    const [pageError, setPageError] = useState(false)

    const [branchName, setBranchName] = useState<string>('')
    const [branchCity, setBranchCity] = useState<string>('')
    const [branchStreet, setBranchStreet] = useState<string>('')

    useEffect(()=>{
        showRegistration(id).then((data: any) => {
            if(data.registration){
                ym('hit', '/registration/third');
                setBranchId(data.registration.branchId)
                setPageError(false)
            } else {
                setPageError(true)
            }
        })
    }, [])

    const onSubmit = async () => {
        await thirdRegistration(id, branchId, branchName, branchCity, branchStreet)
        .then(() => {
            ym('reachGoal','reg3')
            navigate(`/registration/fourth/${id}`)
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
                    <h3>Добавим филиал</h3>
                        <Scrollbar style={{height: "100%", maxHeight: 600, width: "100%"}}>
                            <div className={s.fields_group}>
                            <p style={{margin: 0, padding: 0, marginTop: 0, fontSize: 18, color: '#000'}}>В Зоостиль можно добавить несколько филиалов, остальные филиалы вы сможете добавить в настройках.</p>
                            <br></br>
                            <Form className='d-flex flex-column'>

                                <Title className={s.field_title} title="Название филиала" required/>
                                <Input placeholder="Название филиала..." offAutoComplite value={branchName} onChange={setBranchName}/>
                                <br></br>

                                <Title className={s.field_title} title="Город филиала" required/>
                                <Input placeholder="Город..." offAutoComplite value={branchCity} onChange={setBranchCity}/>
                                <br></br>

                                <Title className={s.field_title} title="Улица филиала" required/>
                                <Input placeholder="Улица..." offAutoComplite value={branchStreet} onChange={setBranchStreet}/>

                                <Button
                                    disabled={!branchName || !branchCity || !branchStreet}
                                    style={{height: 60, marginTop: 26, width: "100%"}}
                                    className={s.next_step_button}
                                    variant={"primary"}
                                    onClick={onSubmit}
                                >
                                    <p style={{fontFamily: 'Inter',fontWeight: 400, fontSize: 16, padding: 0, margin: 0}}>Следующий шаг</p>
                                </Button>
                            </Form>
                        </div>
                    </Scrollbar>
                </div>
            </div>
        </div>
    )}
}


export default Third;
