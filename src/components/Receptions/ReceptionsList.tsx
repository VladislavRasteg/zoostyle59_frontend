import React, {useContext, useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import s from './ReceptionsList.module.scss'
import "@arco-design/web-react/dist/css/arco.css";
import {Context} from "../../index";
import {getAllReceptions} from "../../http/receptionsAPI";
import Pages from "../Pages/Pages";
import ReceptionRow from "./ReceptionRow/ReceptionRow";
import GroupRow from "@/components/Receptions/GroupRow/GroupRow";
import { listDoctors } from "@/http/doctorsAPI";
import { listProcedures } from "@/http/proceduresAPI";
import { Datepicker } from "@/shared/Datepicker";
import { MenuItem, Select } from "@/shared/Select";
import { IAppointment, IEmployee } from "@/interfaces/interfaces";
import { Button } from "@/shared/Button";
import { Title } from "@/shared/Title";

const ReceptionsList = observer(() => {
    const {user} = useContext(Context)

    const {receptions} = useContext(Context)
    const [doctors, setDoctors] = useState([])
    const [procedures, setProcedures] = useState([])
    const [searchDoctor, setSearchDoctor] = useState<number>()

    //new reception fields
    const [isNewReception, setIsNewReception] = useState(false)

    //new reception modal
    const [searchDate, setSearchDate] = useState<Date>()
    const [isSearchDate, setIsSearchDate] = useState(false)


    useEffect(() => {
        listDoctors(1, 1000).then((data: any) => {
            setDoctors(data.data.rows)
        })

        listProcedures(1, 999, 0).then((data: any) => {
            setProcedures(data.data)
        })

        getAllReceptions(receptions.page, 20, searchDoctor, searchDate).then((data: any) => {
            receptions.setReceptions(data.data.rows)
            receptions.setTotalCount(data.data.count)
            setIsNewReception(false)
            setIsSearchDate(false)
        })
    }, [receptions.page, searchDoctor, searchDate])


    let currentDate = new Date()
    const getStatus = (date: any, time: string, endTime: string) => {
        let receptionStartDate = new Date(date + ' ' + time)
        let receptionEndDate = new Date(date + ' ' + endTime)
        if (currentDate < receptionStartDate) {
            return ('Запланирована')
        } else if (currentDate > receptionEndDate) {
            return ('Завершена')
        } else if (currentDate < receptionEndDate && currentDate > receptionStartDate) {
            return ("В процессе")
        } else {
            return ("-")
        }
    }


    const chooseDoctor = (employee: number) => {
        setSearchDoctor(employee)
    }

    const formatName = (obj: {surname: string, firstName: string, middleName: string}) => {
        return `${obj.surname}${obj.firstName ? " " + obj.firstName[0] + "." : ""}${obj.middleName ? " " + obj.middleName[0] + "." : ""}`
    }

    return (
        <>
            <div className={s.table_buttons_wrapper}>
                <div className={s.buttonsWrapper}>
                    <div className={s.buttonsGroup}>
                        <div className={s.input_group}>
                            <Title title="Сотрудник"/>
                            <Select
                                value={searchDoctor || ''}
                                onChange={(e: any) => chooseDoctor(e.target.value)}
                            >
                                <MenuItem key={0} value={undefined}>
                                    Отменить выбор
                                </MenuItem>
                                {
                                doctors && doctors.map((variant: IEmployee) => (
                                    <MenuItem key={variant.id} value={variant.id}>
                                    {variant.surname} {variant.firstName} {variant.middleName}
                                    </MenuItem>
                                ))
                                }
                            </Select>
                        </div>
                        
                        <div className={s.input_group}>
                            <Title title="Дата"/>
                            <Datepicker date={searchDate} setDate={setSearchDate}/>
                        </div>
                    </div>
                </div>

                <div className={s.table_wrapper}>

                    <div className={s.table}>
                        <table>
                            <thead>
                                <tr className={s.trh}>
                                    <th className={s.tdh}>Клиент/Питомец</th>
                                    <th className={s.tdh}>Сотрудник</th>
                                    <th className={s.tdh}>Услуги</th>
                                    <th className={s.tdh}>Дата и время</th>
                                    <th className={s.tdh}>Сумма</th>
                                    <th className={s.tdh}>Статус</th>
                                </tr>
                            </thead>
                            <tbody>
                            {receptions.receptions.map((appointment: IAppointment) =>
                                <tr className={s.trb} key={appointment.id}>
                                    <td className={s.tdb}>{formatName(appointment.client)}<br/>{appointment.pet.breed} {appointment.pet.name}</td>
                                    <td className={s.tdb}>{formatName(appointment.user)}</td>
                                    <td className={s.tdb}>{
                                        appointment.appointmentServices.map((service) =>
                                            <p className={s.appointment_date} key={service.id}>
                                                {service.service.name} <span>{service.service.price}₽</span>
                                            </p>
                                            )    
                                    }</td>
                                    <td className={s.tdb}>{appointment.date}<br/>{appointment.time} — {appointment.endTime}</td>
                                    <td className={s.tdb}>{appointment.sum} ₽</td>
                                    <td className={s.tdb}>{getStatus(appointment.date, appointment.time, appointment.endTime)}</td>
                                </tr>
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