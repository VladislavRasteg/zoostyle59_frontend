import React, {useContext, useEffect, useState} from "react";
import 'simplebar-react/dist/simplebar.min.css';
import {observer} from "mobx-react-lite";
import s from './Reception.module.scss'
import {Route, useNavigate} from "react-router-dom";
import {RECEPTIONS_ROUTE} from "../../utils/consts";
import {getOneReception, deleteReception, updateReception} from "../../http/receptionAPI";
import {useParams} from 'react-router-dom'
import {Context} from "../../index";
import {Notification} from "@arco-design/web-react";
import {Button, Dropdown, Form, FormGroup, Modal} from "react-bootstrap";
import {getAllClients} from "../../http/clientsAPI";
import {listProcedures} from "../../http/proceduresAPI";
import Multiselect from "../../shared/Multiselect/Multiselect";


const Client = observer(() => {
    const {user, tenant} = useContext(Context)
    const navigate  = useNavigate()
    const [editMode, setEditMode] = useState(false);

    const {id} = useParams()

    const [procedures, setProcedures] = useState([])
    const [searchName, setSearchName] = useState("")
    const [searchResult, setSearchResult] = useState([])

    //reception fields
    const [client, setClient] = useState({id: 0, "first_name": "", "surname": "", "middle_name": ""})
    const [doctor, setDoctor] = useState({id: 0, "first_name": "", "surname": "", "middle_name": ""})
    const [date, setDate] = useState("")
    const [time, setTime] = useState("")
    const [endTime, setEndTime] = useState("")
    const [receptionProcedures, setReceptionProcedure] = useState([])
    const [note, setNote] = useState("")
    const [polisOMS, setPolisOMS] = useState("")
    const [isUpdated, setIsUpdated] = useState(false)

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const {receptions} = useContext(Context)

    useEffect(() => {
        getOneReception(id, user.currentBranch?.id).then((data: any) => {
            setClient(data.data.client)
            setDoctor(data.data.doctor)
            setDate(data.data.date)
            setTime(data.data.time)
            setEndTime(data.data.endTime)
            setNote(data.data.note)
            setPolisOMS(data.data.polisOMS)
            const dataProcedures = data.data.receptionProcedures.map((pecProc: any) => {
                return(pecProc.procedure)
              })
            setReceptionProcedure(dataProcedures)
            setSearchName(data.data.client.surname + ' ' + data.data.client.first_name + ' ' + data.data.client.middle_name)
            setIsUpdated(false)
            listProcedures(1, 100, user.currentBranch?.id).then((data: any) => {
                setProcedures(data.data.rows)
            })
        }
        )
    }, [isUpdated])

    useEffect(() => {
        if(searchName.length > 2) {
            const delayDebounceFn = setTimeout(() => {
                getAllClients(1, 100, searchName, user.currentBranch?.id).then((data: any) => {
                    setSearchResult(data.data.rows)
                })
            }, 300)
            return () => clearTimeout(delayDebounceFn)
        }
    }, [searchName])

    const toggleEditMode = () => {
        setEditMode(current => !current);
        if (editMode) {
            setIsUpdated(true)
        }
    };

    const setClientHandler = (client: any) => {
        setSearchResult([])
        setClient(client)
        setSearchName(client.surname + ' ' + client.first_name + ' ' + client.middle_name)
    }

    const delReception = async () => {
        try{
            await deleteReception(id, user.currentBranch?.id)
            navigate(RECEPTIONS_ROUTE)
            return( Notification.success({
                title: 'Сообщение',
                content: 'Сеанс отменен успешно!',
            }))
        } catch(e) {
            alert(e)
        }
    }

    const updateReceptionHandler = () => {
        updateReception(Number(id), date, time, endTime, client.id, doctor.id, receptionProcedures, note, user.currentBranch?.id, polisOMS).then((data: any) => {
            toggleEditMode()
            return( Notification.success({
                title: 'Сообщение',
                content: data,
            }))
        })
    }

    const backHandler = () => {
        receptions.setPage(1)
        navigate(RECEPTIONS_ROUTE)
    }

    return(
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Отмена записи</Modal.Title>
                </Modal.Header>
                <Modal.Body>Вы дейсивтельно хотите отменить запись?</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        Не отменять
                    </Button>
                    <Button variant="danger" onClick={delReception}>
                        Отменить запись
                    </Button>
                </Modal.Footer>
            </Modal>

            <div className={s.client_wrapper}>
                <div className={s.buttons_wrapper}>
                    <Button className="rounded-3" style={{height: 50, marginTop: 22, width: 240}} variant={"outline-secondary"} onClick={backHandler}>Назад</Button>
                    <div className={s.buttons_together}>
                        {editMode && user.isAdmin && (<Button className="rounded-3 " style={{height: 50, paddingRight: 32, paddingLeft: 32, width: 200}}
                                                              variant={"outline-danger"}
                                                              onClick={handleShow}> Отменить сеанс</Button>)}
                        <Button className="rounded-3 " style={{height: 50,  marginTop: 22, paddingRight: 64, paddingLeft: 64, width: 340}}
                                 variant={"outline-primary"}
                                 onClick={toggleEditMode}>{editMode ? "Отменить" : "Редактировать"}</Button>
                    </div>
                </div>



                {!editMode ? (
                        <Form className='d-flex flex-column' style={{width: "100%", borderRadius: 12}}>
                            <Form.Label style={{textAlign:"left"}}>Дата сеанса</Form.Label>
                            <Form.Control value={date} style={{height: 50, background: "#EDF3FC"}} type={'date'} readOnly />
                            <Form.Label style={{textAlign:"left",  marginTop: 12}}>Время сеанса</Form.Label>
                            <Form.Control className="rounded-3" value={time.slice(0,5) + " - " + endTime.slice(0,5)} style={{height: 50, background: "#EDF3FC"}} readOnly />
                            <Form.Label style={{textAlign:"left",  marginTop: 12}}>Пациент</Form.Label>
                            <Form.Control className="rounded-3" value={client.surname + ' ' + client.first_name + ' ' + client.middle_name} style={{height: 50, background: "#EDF3FC"}}  readOnly />
                            <Form.Label style={{textAlign:"left",  marginTop: 12}}>Врач</Form.Label>
                            <Form.Control className="rounded-3" value={doctor.surname + ' ' + doctor.first_name + ' ' + doctor.middle_name} style={{height: 50, background: "#EDF3FC"}} readOnly />
                            <Form.Label style={{textAlign:"left",  marginTop: 12}}>Услуги</Form.Label>
                            <Form.Control className="rounded-3" value={receptionProcedures.map((a: {id: number, name: string}) => a.name).join(', ')} style={{height: 50, background: "#EDF3FC"}} readOnly />
                            <Form.Label value={note} style={{textAlign:"left",  marginTop: 12}}>Заметка</Form.Label>
                            <Form.Control as="textarea" className="rounded-3" rows={3} value={note} style={{background: "#EDF3FC"}} readOnly />
                            {tenant?.tenant.polisOMS &&
                              <>
                                <Form.Label value={note} style={{textAlign:"left",  marginTop: 12}}>Номер полиса ОМС</Form.Label>
                                <Form.Control className="rounded-3" value={polisOMS} style={{height: 50, background: "#EDF3FC"}} readOnly />
                              </>
                            }
                        </Form>)
                    : (
                        <Form className='d-flex flex-column rounded-3' style={{width: "100%"}} >
                            <Form.Label style={{textAlign:"left"}}>Дата сеанса</Form.Label>
                            <Form.Control value={date} onChange={e => setDate(e.target.value)} style={{height: 50, background: "#EDF3FC"}} type={'date'} readOnly = {!user.isAdmin} />
                            <Form.Label style={{textAlign:"left",  marginTop: 12}}>Начало сеанса</Form.Label>
                            <Form.Control className="rounded-3" value={time} onChange={e => setTime(e.target.value)} style={{height: 50, background: "#EDF3FC"}} type={'time'} readOnly = {!user.isAdmin} />
                            <Form.Label style={{textAlign:"left",  marginTop: 12}}>Конец сеанса</Form.Label>
                            <Form.Control className="rounded-3" value={endTime} onChange={e => setEndTime(e.target.value)} style={{height: 50, background: "#EDF3FC"}} type={'time'} readOnly = {!user.isAdmin} />
                            <div className={s.client_field_wrapper}>
                                <Form.Label style={{textAlign:"left",  marginTop: 12}}>Клиент</Form.Label>
                                {user.isAdmin ?
                                    (<>
                                        <Form.Control className="rounded-3" placeholder={'Начните вводить фамилию'} value={searchName} onChange={e => setSearchName(e.target.value)} style={{height: 42, background: "#EDF3FC"}} />
                                        <div className={(searchResult.length > 0 && searchName.length > 2) ? s.searchResultsList : s.invisible}>
                                            {
                                                searchResult.map((search: {surname: "", first_name: "", middle_name: ""}) => {
                                                    return(
                                                        <>
                                                            <a className={s.searchResult} onClick={() => setClientHandler(search)}>
                                                                <h2>{search.surname + ' ' + search.first_name + ' ' + search.middle_name}</h2>
                                                            </a>
                                                            <div className={s.divider}></div>
                                                        </>
                                                    )
                                                })
                                            }
                                    </div>
                                    </>)
                                    :
                                    (<Form.Control className="rounded-3" value={searchName} style={{height: 42, background: "#EDF3FC"}} />)
                                }
                            </div>
                            <Form.Label style={{textAlign:"left",  marginTop: 12}}>Сотрудник</Form.Label>
                            <Form.Control className="rounded-3" value={doctor.surname + ' ' + doctor.first_name + ' ' + doctor.middle_name} style={{height: 50, background: "#EDF3FC"}} readOnly />
                            <Form.Label style={{textAlign:"left",  marginTop: 12}}>Услуги</Form.Label>
                            <Multiselect
                                placeholder={"Выберите услуги"}
                                displayValue={"name"}
                                onRemove={(event) => {
                                    setReceptionProcedure(event)
                                }}
                                onSelect={(event) => {
                                    setReceptionProcedure(event)
                                }}
                                options={procedures}
                                selectedValues={receptionProcedures}
                                matchValue={"id"}
                                secondaryDisplayValue={"duration"}
                                secondaryDisplayValueName={"минут"}
                            />

                            <Form.Label value={note} style={{textAlign:"left",  marginTop: 12}}>Заметка</Form.Label>
                            <Form.Control as="textarea" className="rounded-3" rows={3} value={note} onChange={e => setNote(e.target.value)} style={{background: "#EDF3FC"}} />
                            {tenant?.tenant.polisOMS &&
                                <>
                                    <Form.Label value={note} style={{textAlign:"left",  marginTop: 12}}>Номер полиса ОМС</Form.Label>
                                    <Form.Control className="rounded-3" value={polisOMS} onChange={e => setPolisOMS(e.target.value)} style={{height: 50, background: "#EDF3FC"}} />
                                </>
                            }
                            <Button variant={"primary"} style={{height: 60, marginTop: 32}} className="rounded-3" onClick={updateReceptionHandler}>Сохранить</Button>
                        </Form>)
                }
            </div>
        </>
    )
})

export default Client