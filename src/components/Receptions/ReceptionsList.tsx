import React, {useContext, useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import s from './ReceptionsList.module.scss'
import {Button, Dropdown, Form} from "react-bootstrap";
import "@arco-design/web-react/dist/css/arco.css";
import {Context} from "../../index";
import {getAllReceptions} from "../../http/receptionsAPI";
import Pages from "../Pages/Pages";
import ReceptionRow from "./ReceptionRow/ReceptionRow";
import GroupRow from "@/components/Receptions/GroupRow/GroupRow";

const ReceptionsList = observer(() => {
    const {user} = useContext(Context)

    const {receptions} = useContext(Context)
    const [doctors, setDoctors] = useState([])
    const [procedures, setProcedures] = useState([])
    const [searchDoctor, setSearchDoctor] = useState(false)

    //new reception fields
    const [isNewReception, setIsNewReception] = useState(false)

    //new reception modal
    const [searchDate, setSearchDate] = useState("")
    const [isSearchDate, setIsSearchDate] = useState(false)


    useEffect(() => {
        getAllReceptions(receptions.page, 20, receptions.selectedDoctor, searchDate, user.currentBranch?.id).then((data: any) => {
            receptions.setReceptions(data.data.receptions.rows)
            receptions.setTotalCount(data.data.receptions.count)
            setDoctors(data.data.doctors)
            setProcedures(data.data.procedures)
            setIsNewReception(false)
            setIsSearchDate(false)
            console.log(data.data)
        })
    }, [receptions.page, searchDoctor, isNewReception, isSearchDate])


    let currentDate = new Date()
    const getStatus = (date: any, time: string, endTime: string) => {
        let receptionStartDate = new Date(date + ' ' + time)
        let receptionEndDate = new Date(date + ' ' + endTime)
        if (currentDate < receptionStartDate) {
            return ('Сеанс запланирован')
        } else if (currentDate > receptionEndDate) {
            return ('Сеанс завершен')
        } else if (currentDate < receptionEndDate && currentDate > receptionStartDate) {
            return ("Сеанс идет")
        } else {
            return ("-")
        }
    }


    const chooseDoctor = (doctor: {}) => {
        setSearchDoctor(!searchDoctor)
        receptions.setSelectedDoctor(doctor)
    }

    return (
        <>
            <div className={s.table_buttons_wrapper}>
                <div className={s.buttonsWrapper}>
                    <div className={s.buttonsGroup}>
                        <Dropdown style={{marginLeft: 22, height: 46}}>
                            <Dropdown.Toggle style={{height: 46}}>
                                {receptions.selectedDoctor.surname
                                    ? `${receptions.selectedDoctor.surname} ${receptions.selectedDoctor.first_name} ${receptions.selectedDoctor.middle_name}`
                                    : "Выберите сотрудника"}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item
                                    key={0}
                                    onClick={() => chooseDoctor({})}
                                >
                                    Отменить выбор
                                </Dropdown.Item>
                                {doctors.map((doctor: any) =>
                                    <Dropdown.Item
                                        key={doctor.id}
                                        onClick={() => chooseDoctor(doctor)}
                                    >
                                        {doctor.surname + ' ' + doctor.first_name[0] + '.' + doctor.middle_name[0] + '.'}
                                    </Dropdown.Item>
                                )}
                            </Dropdown.Menu>
                        </Dropdown>

                        <div className={s.input_and_button}>
                            <Form.Control placeholder={'Укажите дату'} style={{
                                height: 42,
                                background: "#EDF3FC",
                                color: "#435875",
                                border: "1px solid #D1D6E1",
                                borderRadius: 8
                            }} value={searchDate} onChange={(event) => setSearchDate(event.target.value)} type={'date'}/>
                            <Button onClick={() => setIsSearchDate(true)}>OK</Button>
                        </div>
                    </div>
                </div>

                <div className={s.table_wrapper}>

                    <div className={s.table}>
                        <table>
                            <thead>
                                <tr className={s.trh}>
                                    <th className={s.tdh}>Клиент/Группа</th>
                                    <th className={s.tdh}>Сотрудник</th>
                                    <th className={s.tdh}>Услуги</th>
                                    <th className={s.tdh}>Дата</th>
                                    <th className={s.tdh}>Время</th>
                                    <th className={s.tdh}>Статус</th>
                                </tr>
                            </thead>
                            <tbody>
                            {receptions.receptions.map((reception: any) =>
                                <>
                                    {reception?.client &&
                                        <ReceptionRow
                                            key={reception.id}
                                            client_name={reception.client.surname + ' ' + reception.client.first_name + ' ' + reception.client.middle_name}
                                            doctor_name={reception.doctor.surname + ' ' + reception.doctor.first_name[0] + '.' + reception.doctor.middle_name[0] + '.'}
                                            procedures={reception.receptionProcedures}
                                            id={reception.id}
                                            date={(reception.date).split("-").reverse().join(".")}
                                            time={reception.time.toString().slice(0, 5)}
                                            endTime={reception.endTime.toString().slice(0, 5)}
                                            status={getStatus(reception.date, reception.time, reception.endTime)}
                                        />
                                    }
                                    {reception?.group &&
                                        <GroupRow
                                            key={reception.id}
                                            group_name={reception.group.name}
                                            doctor_name={reception.doctor.surname + ' ' + reception.doctor.first_name[0] + '.' + reception.doctor.middle_name[0] + '.'}
                                            procedures={reception.receptionProcedures}
                                            id={reception.id}
                                            date={(reception.date).split("-").reverse().join(".")}
                                            time={reception.time.toString().slice(0, 5)}
                                            endTime={reception.endTime.toString().slice(0, 5)}
                                            status={getStatus(reception.date, reception.time, reception.endTime)}
                                        />
                                    }
                                </>
                            )}
                            </tbody>
                        </table>
                    </div>
                    <Pages state={receptions}/>
                </div>
            </div>
        </>
    )
})

export default ReceptionsList