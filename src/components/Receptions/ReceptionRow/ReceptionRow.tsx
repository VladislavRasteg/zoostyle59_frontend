import s from "./ReceptionRow.module.scss";
import {RECEPTION_ROUTE} from "../../../utils/consts";
import React from "react";
import {useNavigate} from "react-router-dom";
interface ReceptionRowProps {
    client_name: string;
    doctor_name: string;
    procedures: [];
    id: number;
    date: string;
    time: string;
    endTime: string;
    status: string;

}

const ReceptionRow = ({ id, client_name, doctor_name, procedures, date, time, endTime, status }: ReceptionRowProps) => {
    const navigate  = useNavigate()
    const realProcedures = procedures.map((recProc: {"procedure" : {"name": ""}}) => {return(recProc.procedure.name)})
    return(
        <tr className={(status === 'Сеанс идет') ? `${s.trb} ${s.active}` : s.trb} onClick={() => navigate(RECEPTION_ROUTE + '/' + id)}>
            <td className={s.tdb}>{client_name}</td>
            <td className={s.tdb}>{doctor_name}</td>
            <td className={s.tdb}>{realProcedures.join(', ')}</td>
            <td className={s.tdb}>{date}</td>
            <td className={s.tdb}>{time}-{endTime}</td>
            <td className={s.tdb}>{status}</td>
        </tr>
    )
}

export default ReceptionRow