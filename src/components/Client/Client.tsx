import React, {useContext, useEffect, useState} from "react";
import SimpleBar from 'simplebar-react';
import {observer} from "mobx-react-lite";
import s from './Client.module.scss'
import {Route, useNavigate} from "react-router-dom";
import {CLIENT_ROUTE, CLIENTS_ROUTE, RECEPTION_ROUTE} from "../../utils/consts";
import {Form, Button, FormGroup, Modal} from "react-bootstrap";
import {getOneClient, updateClient, deleteClient} from "../../http/clientAPI";
import {useParams} from 'react-router-dom'
import {Context} from "../../index";
import {Notification} from "@arco-design/web-react";


const Client = observer(() => {

    const {user} = useContext(Context)
    const navigate = useNavigate()

    const [receptions, setReceptions] = useState([])
    const [editMode, setEditMode] = useState(false);


    const {id} = useParams()

    const [surname, setSurname] = useState("")
    const [first_name, setFirst_name] = useState("")
    const [middle_name, setMiddle_name] = useState("")
    const [birth, setBirth] = useState("")
    const [phone, setPhone] = useState("")
    const [mail, setMail] = useState("")

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const {clients} = useContext(Context)

    useEffect(() => {
        getOneClient(id, user.currentBranch?.id).then((data: any) => {
            setSurname(data.data.client.surname)
            setFirst_name(data.data.client.first_name)
            setMiddle_name(data.data.client.middle_name)
            setBirth(data.data.client.birth)
            setPhone(data.data.client.phone)
            setMail(data.data.client.mail)
            setReceptions(data.data.receptions)

        })
    }, [editMode])


    const update = async () => {
        if (surname != "" && first_name != "") {
            await updateClient(id, surname, first_name, middle_name, birth, phone, user.currentBranch?.id, mail)
            toggleEditMode()
        } else alert("Недостаточно данных: фамилия или имя не могут быть пустыми")
    }


    const toggleEditMode = () => {
        setEditMode(current => !current);
        if (editMode) {
            window.location.reload();
        }
    };

    const delClient = async () => {
        try {
            await deleteClient(id, user.currentBranch?.id)
            navigate(CLIENTS_ROUTE)
            return (Notification.success({
                title: 'Сообщение',
                content: 'Клиент удален',
            }))
        } catch (e) {
            alert(e)
        }
    }

    const backHandler = () => {
        clients.setPage(1)
        navigate(CLIENTS_ROUTE)
    }

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Подтверждение удаления</Modal.Title>
                </Modal.Header>
                <Modal.Body>Вы дейсивтельно хотите удалить клиента: {surname} {first_name} {middle_name}?</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        Отменить
                    </Button>
                    <Button variant="danger" onClick={delClient}>
                        Удалить
                    </Button>
                </Modal.Footer>
            </Modal>
            <div className={s.client_wrapper}>
                <div className={s.buttons_wrapper}>
                    <Button className="rounded-3" style={{height: 50, marginTop: 22}}
                            variant={"outline-secondary"} onClick={backHandler}>Назад</Button>
                    <div className={s.buttons_together}>
                        {user.isAdmin && editMode && (<Button className="rounded-3 " style={{
                            height: 50,
                            paddingRight: 32,
                            paddingLeft: 32,
                            width: '100%'
                        }}
                          variant={"outline-danger"}
                          onClick={handleShow}>
                            Удалить
                        </Button>)}
                        {user.isAdmin &&
                            (<Button className="rounded-3 "
                                     style={{height: 50, marginTop: 22, textAlign: 'center', width: '100%'}}
                                     variant={"outline-primary"}
                                     onClick={toggleEditMode}>
                                    {editMode ? "Отменить" : "Редактировать"}
                                </Button>
                            )}
                    </div>
                </div>
                {!editMode ? (
                        <Form className='d-flex flex-column' style={{width: "100%", borderRadius: 12}}>
                            <Form.Label style={{textAlign: "left"}}>Фамилия</Form.Label>
                            <Form.Control placeholder={surname} value={surname} style={{height: 50}} readOnly/>
                            <Form.Label style={{textAlign: "left", marginTop: 12}}>Имя</Form.Label>
                            <Form.Control placeholder={first_name} defaultValue={first_name} style={{height: 50}} readOnly/>
                            <Form.Label style={{textAlign: "left", marginTop: 12}}>Отчество</Form.Label>
                            <Form.Control placeholder={middle_name} defaultValue={middle_name} style={{height: 50}}
                                          readOnly/>
                            <Form.Label style={{textAlign: "left", marginTop: 12}}>Дата рождения</Form.Label>
                            <Form.Control placeholder={birth} defaultValue={birth} type={'date'} style={{height: 50}}
                                          readOnly/>
                            <FormGroup className='d-flex flex-row rounded-3 gap-3'>
                                <FormGroup className='d-flex flex-column w-100'>
                                    <Form.Label style={{textAlign: "left", marginTop: 12}}>Почта</Form.Label>
                                    <Form.Control placeholder={mail} defaultValue={mail} style={{height: 50}} readOnly/>
                                </FormGroup>
                                <FormGroup className='d-flex flex-column w-100'>
                                    <Form.Label style={{textAlign: "left", marginTop: 12}}>Номер телефона</Form.Label>
                                    <Form.Control placeholder={phone} defaultValue={phone} style={{height: 50}} readOnly/>
                                </FormGroup>
                            </FormGroup>
                        </Form>)
                    : (
                        <Form className='d-flex flex-column rounded-3' style={{width: "100%"}}>
                            <Form.Label style={{textAlign: "left"}}>Фамилия</Form.Label>
                            <Form.Control className="rounded-3" placeholder={surname} value={surname}
                                          onChange={e => setSurname(e.target.value)}
                                          style={{height: 50, background: "#EDF3FC"}}/>
                            <Form.Label style={{textAlign: "left", marginTop: 12}}>Имя</Form.Label>
                            <Form.Control className="rounded-3" placeholder={first_name} defaultValue={first_name}
                                          onChange={e => setFirst_name(e.target.value)}
                                          style={{height: 50, background: "#EDF3FC"}}/>
                            <Form.Label style={{textAlign: "left", marginTop: 12}}>Отчество</Form.Label>
                            <Form.Control className="rounded-3" placeholder={middle_name} defaultValue={middle_name}
                                          onChange={e => setMiddle_name(e.target.value)}
                                          style={{height: 50, background: "#EDF3FC"}}/>
                            <Form.Label style={{textAlign: "left", marginTop: 12}}>Дата рождения</Form.Label>
                            <Form.Control className="rounded-3" placeholder={birth} defaultValue={birth}
                                          onChange={e => setBirth(e.target.value)}
                                          style={{height: 50, background: "#EDF3FC"}} type={'date'}/>
                            <FormGroup className='d-flex flex-row rounded-3 gap-3'>
                                <FormGroup className='d-flex flex-column w-100'>
                                    <Form.Label style={{textAlign: "left", marginTop: 12}}>Почта</Form.Label>
                                    <Form.Control className="rounded-3" placeholder={mail} defaultValue={mail}
                                                  onChange={e => setMail(e.target.value)}
                                                  style={{height: 50, background: "#EDF3FC"}}/>
                                </FormGroup>
                                <FormGroup className='d-flex flex-column w-100'>
                                    <Form.Label style={{textAlign: "left", marginTop: 12}}>Номер телефона</Form.Label>
                                    <Form.Control className="rounded-3" placeholder={phone} defaultValue={phone}
                                                  onChange={e => setPhone(e.target.value)}
                                                  style={{height: 50, background: "#EDF3FC"}}/>
                                </FormGroup>
                            </FormGroup>
                            <Button variant={"primary"} style={{height: 60, marginTop: 32}} className="rounded-3"
                                    onClick={update}>Сохранить</Button>
                        </Form>)
                }

                {(!editMode && receptions.length != 0) && (<div className={s.table_wrapper}>
                    <p className={s.table_header}>Записи клиента</p>
                    <table>
                        <thead>
                        <tr style={{height: 40}} className={s.trh}>
                            <th style={{width: "25%"}} className={s.tdh}>Сотрудник</th>
                            <th style={{width: "25%"}} className={s.tdh}>Услуги</th>
                            <th style={{width: "25%"}} className={s.tdh}>Дата</th>
                            <th style={{width: "25%"}} className={s.tdh}>Время</th>
                        </tr>
                        </thead>
                    </table>
                    <SimpleBar className={s.table_content_wrapper}>
                        <table>

                            <tbody className={s.tb}>
                            {
                                receptions.map((reception: any) => {
                                        const dataProcedures = reception.receptionProcedures.map((pecProc: any) => {
                                            return (pecProc.procedure.name)
                                        })
                                        return (
                                            <tr className={s.trb}
                                                onClick={() => navigate(RECEPTION_ROUTE + '/' + reception.id)}>
                                                <td style={{width: "25%"}}
                                                    className={s.tdb}>{reception.doctor.surname + ' ' + reception.doctor.first_name[0] + '.' + reception.doctor.middle_name[0] + '.'}</td>
                                                <td style={{width: "25%"}}
                                                    className={s.tdb}>{dataProcedures.join(', ')}</td>
                                                <td style={{width: "25%"}}
                                                    className={s.tdb}>{reception.date && (reception.date).split("-").reverse().join(".")}</td>
                                                <td style={{width: "25%"}} className={s.tdb}>{reception.time}</td>
                                            </tr>
                                        )
                                    }
                                )}


                            </tbody>
                        </table>
                    </SimpleBar>
                </div>)}

            </div>
        </>
    )
})

export default Client