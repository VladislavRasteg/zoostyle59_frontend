import React, {useContext, useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import s from './Schedule.module.scss'
import {Context} from "../../index";
import Pages from "../Pages/Pages";
import {listDoctors, updateSchedule} from "../../http/doctorsAPI";
import {Button, Form, Modal} from "react-bootstrap";
import {Notification} from "@arco-design/web-react";
import { Checkbox } from "@arco-design/web-react";
import "../../shared/Checkbox/Checkbox.css"
const Schedule = observer(() => {
    const {user} = useContext(Context)
    const {doctors} = useContext(Context)

    const [show, setShow] = useState(false);

    const [doctorId, setDoctorId] = useState(0)
    const [fullName, setFullName] = useState('')

    const [schedule, setSchedule] = useState({} || null)

    const [isEdited, setIsEdited] = useState(false)

    const [monFrom, setMonFrom] = useState('')
    const [monTo, setMonTo] = useState('')
    const [tueFrom, setTueFrom] = useState('')
    const [tueTo, setTueTo] = useState('')
    const [wedFrom, setWedFrom] = useState('')
    const [wedTo, setWedTo] = useState('')
    const [thuFrom, setThuFrom] = useState('')
    const [thuTo, setThuTo] = useState('')
    const [friFrom, setFriFrom] = useState('')
    const [friTo, setFriTo] = useState('')
    const [satFrom, setSatFrom] = useState('')
    const [satTo, setSatTo] = useState('')
    const [sunFrom, setSunFrom] = useState('')
    const [sunTo, setSunTo] = useState('')
    const [isMon, setIsMon] = useState(true)
    const [isTue, setIsTue] = useState(true)
    const [isWed, setIsWed] = useState(true)
    const [isThu, setIsThu] = useState(true)
    const [isFri, setIsFri] = useState(true)
    const [isSat, setIsSat] = useState(true)
    const [isSun, setIsSun] = useState(true)

    useEffect(() => {
        listDoctors(doctors.page, 20).then((data: any) => {
            doctors.setDoctors(data.data.doctors.rows)
            doctors.setTotalCount(data.data.doctors.count)
            setIsEdited(false)
        })
    }, [doctors.page, isEdited])

    const handleClose = () => {
        setShow(false)
    }

    const updateScheduleHandler = async () => {
        try{
            await updateSchedule(doctorId,
                isMon,
                isMon ? monFrom : "00:00",
                isMon ? monTo : "23:59",
                isTue,
                isTue ? tueFrom : "00:00",
                isTue ? tueTo : "23:59",
                isWed,
                isWed ? wedFrom : "00:00",
                isWed ? wedTo : "23:59",
                isThu,
                isThu ? thuFrom : "00:00",
                isThu ? thuTo : "23:59",
                isFri,
                isFri ? friFrom : "00:00",
                isFri ? friTo : "23:59",
                isSat,
                isSat ? satFrom : "00:00",
                isSat ? satTo : "23:59",
                isSun,
                isSun ? sunFrom : "00:00",
                isSun ? sunTo : "23:59",
                user.currentBranch?.id)
                .then(() => {
                    setIsEdited(true)
                    handleClose()
                    return( Notification.success({
                        title: 'Сообщение',
                        content: 'Расписание изменено успешно!',
                        }))
                })
        } catch(e) {
            alert(e)
        }
    }

    const setMonTime = (time: string, type: string) => {
        if (time.slice(4) === '0' && type === 'from' && !tueFrom && !wedFrom && !thuFrom && !friFrom && !satFrom && !sunFrom) {
            setMonFrom(time)
            setTueFrom(time)
            setWedFrom(time)
            setThuFrom(time)
            setFriFrom(time)
            setSatFrom(time)
            setSunFrom(time)
        } else if (time.slice(4) === '0' && type === 'to' && !tueTo && !wedTo && !thuTo && !friTo && !satTo && !sunTo){
            setMonTo(time)
            setTueTo(time)
            setWedTo(time)
            setThuTo(time)
            setFriTo(time)
            setSatTo(time)
            setSunTo(time)
        } else if (type === 'from') {
            setMonFrom(time)
        } else {
            setMonTo(time)
        }

    }

    const handleShow = (doctor = {id: 0, surname: "",
                        first_name: "",
                        middle_name: "",
                        schedule: {isMon: Boolean, monFrom: '', monTo: '', isTue:Boolean, tueFrom: '', tueTo: '', isWed:Boolean, wedFrom: '', wedTo: '', isThu:Boolean, thuFrom: '',  thuTo: '', isFri:Boolean, friFrom: '', friTo: '', isSat:Boolean, satFrom: '', satTo: '', isSun:Boolean, sunFrom: '', sunTo: ''} || null}) => {
        setDoctorId(doctor.id)
        setFullName(doctor.surname + ' ' + doctor.first_name[0] + '.' + doctor.middle_name[0] + '.')
        setSchedule(doctor.schedule)
        if (doctor.schedule) {
            setMonFrom(doctor.schedule.monFrom)
            setMonTo(doctor.schedule.monTo)
            setTueFrom(doctor.schedule.tueFrom)
            setTueTo(doctor.schedule.tueTo)
            setWedFrom(doctor.schedule.wedFrom)
            setWedTo(doctor.schedule.wedTo)
            setThuFrom(doctor.schedule.thuFrom)
            setThuTo(doctor.schedule.thuTo)
            setFriFrom(doctor.schedule.friFrom)
            setFriTo(doctor.schedule.friTo)
            setSatFrom(doctor.schedule.satFrom)
            setSatTo(doctor.schedule.satTo)
            setSunFrom(doctor.schedule.sunFrom)
            setSunTo(doctor.schedule.sunTo)
            setIsMon(doctor.schedule.isMon)
            setIsTue(doctor.schedule.isTue)
            setIsWed(doctor.schedule.isWed)
            setIsThu(doctor.schedule.isThu)
            setIsFri(doctor.schedule.isFri)
            setIsSat(doctor.schedule.isSat)
            setIsSun(doctor.schedule.isSun)
        } else {
            setMonFrom('')
            setMonTo('')
            setTueFrom('')
            setTueTo('')
            setWedFrom('')
            setWedTo('')
            setThuFrom('')
            setThuTo('')
            setFriFrom('')
            setFriTo('')
            setSatFrom('')
            setSatTo('')
            setSunFrom('')
            setSunTo('')
            setIsMon(true)
            setIsTue(true)
            setIsWed(true)
            setIsThu(true)
            setIsFri(true)
            setIsSat(true)
            setIsSun(true)
        }
        setShow(true)
    };


    return (
        <>
            <Modal show={show}
                   onHide={handleClose}
                   aria-labelledby="contained-modal-title-vcenter"
                   centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>{schedule ? "Расписание сотрудника" : "Создание расписания"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Label style={{textAlign:"left", marginTop: 12}}>Сотрудник</Form.Label>
                    <Form.Control className="rounded-3" placeholder='Врач' value={fullName} onChange={event => setFullName(event.target.value)} style={{height: 42, background: "#EDF3FC"}} disabled readOnly />
                    <div className={s.scheduleWrapper}>
                        <div className={s.timeGroup}>
                            <Form.Label style={{textAlign:"left", padding: 0, marginBottom: 0, cursor: "pointer"}}>Понедельник</Form.Label>
                            <div className={s.timeField}>
                                <Checkbox checked={isMon} onChange={() => setIsMon(!isMon)} />
                                <Form.Control className={isMon ? s.field : s.inactive} placeholder='Начало смены' value={isMon ? monFrom : ''}  type="time" onChange={event => setMonTime(event.target.value, 'from')} disabled={!isMon}/>
                                <Form.Control className={isMon ? s.field : s.inactive} placeholder='Конец смены' value={isMon ? monTo : ''}  type="time" onChange={event => setMonTime(event.target.value, 'to')} disabled={!isMon}/>
                            </div>
                        </div>
                        <div className={s.timeGroup}>
                            <Form.Label style={{textAlign:"left", marginTop: 0, padding: 0, marginBottom: 0, cursor: "pointer"}}>Вторник</Form.Label>
                            <div className={s.timeField}>
                                <Checkbox checked={isTue} onChange={() => setIsTue(!isTue)} />
                                <Form.Control className={isTue ? s.field : s.inactive} placeholder='Начало смены' value={isTue ? tueFrom : ''}  type="time" onChange={event => setTueFrom(event.target.value)} disabled={!isTue}/>
                                <Form.Control className={isTue ? s.field : s.inactive} placeholder='Конец смены' value={isTue ? tueTo : ''}  type="time" onChange={event => setTueTo(event.target.value)} disabled={!isTue}/>
                            </div>
                        </div>
                        <div className={s.timeGroup}>
                            <Form.Label style={{textAlign:"left", marginTop: 0, padding: 0, marginBottom: 0, cursor: "pointer"}}>Среда</Form.Label>
                            <div className={s.timeField}>
                                <Checkbox checked={isWed} onChange={() => setIsWed(!isWed)}/>
                                <Form.Control className={isWed ? s.field : s.inactive} placeholder='Начало смены' value={isWed ? wedFrom: ''}  type="time" onChange={event => setWedFrom(event.target.value)} disabled={!isWed}/>
                                <Form.Control className={isWed ? s.field : s.inactive} placeholder='Конец смены' value={isWed ? wedTo: ''}  type="time" onChange={event => setWedTo(event.target.value)} disabled={!isWed}/>
                            </div>
                        </div>
                        <div className={s.timeGroup}>
                            <Form.Label style={{textAlign:"left", marginTop: 0, padding: 0, marginBottom: 0, cursor: "pointer"}}>Четверг</Form.Label>
                            <div className={s.timeField}>
                                <Checkbox checked={isThu} onChange={() => setIsThu(!isThu)} />
                                <Form.Control className={isThu ? s.field : s.inactive} placeholder='Начало смены' value={isThu ? thuFrom : ''}  type="time" onChange={event => setThuFrom(event.target.value)} disabled={!isThu}/>
                                <Form.Control className={isThu ? s.field : s.inactive} placeholder='Конец смены' value={isThu ? thuTo : ''}  type="time" onChange={event => setThuTo(event.target.value)}disabled={!isThu} />
                            </div>
                        </div>
                        <div className={s.timeGroup}>
                            <Form.Label style={{textAlign:"left", marginTop: 0, padding: 0, marginBottom: 0, cursor: "pointer"}}>Пятница</Form.Label>
                            <div className={s.timeField}>
                                <Checkbox checked={isFri} onChange={() => setIsFri(!isFri)} />
                                <Form.Control className={isFri ? s.field : s.inactive} placeholder='Начало смены' value={isFri ? friFrom : ''}  type="time" onChange={event => setFriFrom(event.target.value)} disabled={!isFri}/>
                                <Form.Control className={isFri ? s.field : s.inactive} placeholder='Конец смены' value={isFri ? friTo : ''}  type="time" onChange={event => setFriTo(event.target.value)} disabled={!isFri}/>
                            </div>
                        </div>
                        <div className={s.timeGroup}>
                            <Form.Label style={{textAlign:"left", marginTop: 0, padding: 0, marginBottom: 0, cursor: "pointer"}}>Суббота</Form.Label>
                            <div className={s.timeField}>
                                <Checkbox checked={isSat} onChange={() => setIsSat(!isSat)} />
                                <Form.Control className={isSat ? s.field : s.inactive} placeholder='Начало смены' value={isSat ? satFrom : ''}  type="time" onChange={event => setSatFrom(event.target.value)} disabled={!isSat}/>
                                <Form.Control className={isSat ? s.field : s.inactive} placeholder='Конец смены' value={isSat ? satTo : ''}  type="time" onChange={event => setSatTo(event.target.value)} disabled={!isSat}/>
                            </div>
                        </div>
                        <div className={s.timeGroup}>
                            <Form.Label style={{textAlign:"left", marginTop: 0, padding: 0, marginBottom: 0, cursor: "pointer"}}>Воскресенье</Form.Label>
                            <div className={s.timeField}>
                                <Checkbox checked={isSun} onChange={() => setIsSun(!isSun)} />
                                <Form.Control className={isSun ? s.field : s.inactive} placeholder='Начало смены' value={isSun ? sunFrom : ''}  type="time" onChange={event => setSunFrom(event.target.value)} disabled={!isSun}/>
                                <Form.Control className={isSun ? s.field : s.inactive} placeholder='Конец смены' value={isSun ? sunTo : ''}  type="time" onChange={event => setSunTo(event.target.value)} disabled={!isSun}/>
                            </div>
                        </div>
                        <p>Уберите галочку слева от времени, чтобы пометить день как выходной</p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                    disabled={(!monFrom && isMon)
                        || (!monTo && isMon)
                        || (!tueFrom && isTue)
                        || (!tueTo && isTue)
                        || (!wedFrom && isWed)
                        || (!wedTo && isWed)
                        || (!thuFrom && isThu)
                        || (!thuTo && isThu)
                        || (!friFrom && isFri)
                        || (!friTo && isFri)
                        || (!satFrom && isSat)
                        || (!satTo && isSat)
                        || (!sunFrom && isSun)
                        || (!sunTo && isSun)
                        || (isMon && (monFrom >= monTo))
                        || (isTue && (tueFrom >= tueTo))
                        || (isWed && (wedFrom >= wedTo))
                        || (isThu && (thuFrom >= thuTo))
                        || (isFri && (friFrom >= friTo))
                        || (isSat && (satFrom >= satTo))
                        || (isSun && (sunFrom >= sunTo)) }
                    variant="primary" className='ps-4 pe-4 pb-3 pt-3 w-100' onClick={updateScheduleHandler}>
                        Сохранить
                    </Button>
                </Modal.Footer>
            </Modal>
            <div className={s.table_buttons_wrapper}>
                <div className={s.table_wrapper}>
                    <div className={s.table}>
                        <table>
                            <thead>
                                <tr className={s.trh}>
                                    <th className={s.tdh}>Фамилия</th>
                                    <th className={s.tdh}>Имя</th>
                                    <th className={s.tdh}>Отчество</th>
                                    <th className={s.tdh}>Пн.</th>
                                    <th className={s.tdh}>Вт.</th>
                                    <th className={s.tdh}>Ср.</th>
                                    <th className={s.tdh}>Чт.</th>
                                    <th className={s.tdh}>Пт.</th>
                                    <th className={s.tdh}>Сб.</th>
                                    <th className={s.tdh}>Вс.</th>
                                </tr>
                            </thead>
                            <tbody>
                            {doctors.doctors.map((doctor: any) =>
                                <tr className={s.trb} onClick={() => handleShow(doctor)} key={doctor.id}>
                                    <td className={s.tdb}>{doctor.surname}</td>
                                    <td className={s.tdb}>{doctor.first_name}</td>
                                    <td className={s.tdb}>{doctor.middle_name}</td>
                                    <td className={s.tdb}>{doctor.schedule && doctor.schedule.isMon ? doctor.schedule.monFrom.slice(0, 5) : '-'}<br/>{doctor.schedule && doctor.schedule.isMon ? doctor.schedule.monTo.slice(0, 5) : '-'}
                                    </td>
                                    <td className={s.tdb}>{doctor.schedule && doctor.schedule.isTue ? doctor.schedule.tueFrom.slice(0, 5) : '-'}<br/>{doctor.schedule && doctor.schedule.isTue ? doctor.schedule.tueTo.slice(0, 5) : '-'}
                                    </td>
                                    <td className={s.tdb}>{doctor.schedule && doctor.schedule.isWed ? doctor.schedule.wedFrom.slice(0, 5) : '-'}<br/>{doctor.schedule && doctor.schedule.isWed ? doctor.schedule.wedTo.slice(0, 5) : '-'}
                                    </td>
                                    <td className={s.tdb}>{doctor.schedule && doctor.schedule.isThu ? doctor.schedule.thuFrom.slice(0, 5) : '-'}<br/>{doctor.schedule && doctor.schedule.isThu ? doctor.schedule.thuTo.slice(0, 5) : '-'}
                                    </td>
                                    <td className={s.tdb}>{doctor.schedule && doctor.schedule.isFri ? doctor.schedule.friFrom.slice(0, 5) : '-'}<br/>{doctor.schedule && doctor.schedule.isFri ? doctor.schedule.friTo.slice(0, 5) : '-'}
                                    </td>
                                    <td className={s.tdb}>{doctor.schedule && doctor.schedule.isSat ? doctor.schedule.satFrom.slice(0, 5) : '-'}<br/>{doctor.schedule && doctor.schedule.isSat ? doctor.schedule.satTo.slice(0, 5) : '-'}
                                    </td>
                                    <td className={s.tdb}>{doctor.schedule && doctor.schedule.isSun ? doctor.schedule.sunFrom.slice(0, 5) : '-'}<br/>{doctor.schedule && doctor.schedule.isSun ? doctor.schedule.sunTo.slice(0, 5) : '-'}
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                    <Pages state={doctors}/>
                </div>
            </div>
        </>
    )
})

export default Schedule;