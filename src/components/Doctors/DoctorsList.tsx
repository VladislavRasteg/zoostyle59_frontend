import {useContext, useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import s from './DoctorsList.module.scss'
import {Context} from "../../index";
import Pages from "../Pages/Pages";
import {listDoctors} from "../../http/doctorsAPI";
import {listPositions} from "../../http/positionsAPI";
import '../../custom_css/multiselect.css'
import { useSearchParams } from "react-router-dom";
import { EmployeeModal } from "@/widgets/EmployeeModal";
import { IEmployee } from "@/interfaces/interfaces";
import { Button } from "@/shared/Button";

const DoctorsList = observer(() => {
    const {user} = useContext(Context)
    const {doctors} = useContext(Context)

    const [show, setShow] = useState(false);
    const [employee, setEmployee] = useState<IEmployee>()
    const [isDoctorEdited, setIsDoctorEdited] = useState(false)
    const [services, setServices] = useState([])
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        listDoctors(doctors.page, 20).then((data: any) => {
            doctors.setDoctors(data.data.rows)
            doctors.setTotalCount(data.data.count)
            setIsDoctorEdited(false)
            if(searchParams.get("isNew") === "true" && data.data.doctors.count === 0){
                handleShow()
            }
        })
        listPositions(1, 1000, user.currentBranch?.id).then((data: any) => {
            setServices(data.data.positions.services)
        })
    }, [doctors.page, isDoctorEdited])

    const handleClose = () => {
        setShow(false)
        setIsDoctorEdited(true)
    }

    const handleShow = (doctor?: IEmployee) => {
        setEmployee(doctor)
        setShow(true)
    };

    return (
        <>
            {show && <EmployeeModal mode='create' show={show} onClose={handleClose} employee={employee}/>}
            <div className={s.table_buttons_wrapper}>
                <Button size="small" onClick={() => handleShow()}>Добавить сотрудника</Button>
                <div className={s.table_wrapper}>
                    <div className={s.table}>
                        <table>
                            <thead>
                                <tr className={s.trh}>
                                    <th className={s.tdh}>Фамилия</th>
                                    <th className={s.tdh}>Имя</th>
                                    <th className={s.tdh}>Отчество</th>
                                    <th className={s.tdh}>Должность</th>
                                    <th className={s.tdh}>Дата рождения</th>
                                    <th className={s.tdh}>Почта</th>
                                    <th className={s.tdh}>Номер телефона</th>
                                </tr>
                            </thead>
                            <tbody>
                            {doctors.doctors.map((doctor: any) =>
                                <tr className={s.trb} onClick={() => handleShow(doctor)} key={doctor.id}>
                                    <td className={s.tdb}>{doctor.surname}</td>
                                    <td className={s.tdb}>{doctor.firstName}</td>
                                    <td className={s.tdb}>{doctor.middleName}</td>
                                    <td className={s.tdb}>{doctor.position?.name}</td>
                                    <td className={s.tdb}>{doctor.birth && (doctor.birth).split("-").reverse().join(".")}</td>
                                    <td className={s.tdb}>{doctor.mail}</td>
                                    <td className={s.tdb}>{doctor.phone}</td>
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

export default DoctorsList