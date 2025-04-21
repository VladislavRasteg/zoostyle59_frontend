import React, {useState, useContext} from 'react';
import s from "./ReportCard.module.scss";
import {getMonthReceptions} from "../../http/receptionsAPI";
import {Context} from "../../index";
import {utils, writeFile} from "xlsx"

interface ReportCardProps {
    active: boolean;
    action: string;
    name: string;
    icon: any;
}

const ReportCard = ({ action, name, icon, active }: ReportCardProps) => {

    const {user} = useContext(Context)
    const clickHandler = async () => {
        await getMonthReceptions(user.currentBranch?.id).then((data:any) => {
            let result = [{}]
            data.data.forEach((row: any) => {
                const receptionProcedures = row.receptionProcedures.map((pecProc: any) => {
                    return(pecProc.procedure.name)
                })
                result.push({"Дата": row.date, "Время": `${row.time}-${row.endTime}`, "Врач": row.doctor.surname + ' ' + row.doctor.first_name + ' ' + row.doctor.middle_name, "Пациент": row.client.surname + ' ' + row.client.first_name + ' ' + row.client.middle_name, "Процедура": receptionProcedures.join(', ')})
            })

            let wb = utils.book_new()
            let ws = utils.json_to_sheet(result)
            const today = new Date()
            const name = "Приемы за месяц | " + today.toString().slice(4, 24)
            utils.book_append_sheet(wb, ws, today.toString().slice(4, 15))
            writeFile(wb, name+'.xlsx')


        })

    }

    return (
        <div className={active ? s.reportCard : s.reportCardinWork}
             onClick={clickHandler}>
            <div className={s.icon}>{icon}</div>
            {name}
        </div>
    )
}

export default ReportCard;