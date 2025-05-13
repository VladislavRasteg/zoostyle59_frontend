import React, { useState, useContext } from "react"
import s from "./Header.module.scss";
import 'air-datepicker/air-datepicker.css';
import { useEffect, useRef } from "react";
import "react-datepicker/dist/react-datepicker.css";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import {observer} from "mobx-react-lite";
import {Context} from "../../../index";
import 'dayjs/locale/ru';
import { MultiSelect } from 'primereact/multiselect';
//import 'primereact/resources/themes/lara-light-indigo/theme.scss';   
//import 'primereact/resources/primereact.scss';
import './MultiSelect.scss'                       
import { Dropdown } from "react-bootstrap";

const Header = observer(() => {

    const {calendar} = useContext(Context)

    // useEffect(() => {
    //     },[calendar.selectedDate])

    const monthNames = [
                        "января", "февраля", "марта", "апреля", "мая", "июня",
                        "июля", "августа", "сентября", "октября", "ноября", "декабря"
                    ]

    let month 
    if (calendar.selectedDate[5] == '0'){
        month = Number(calendar.selectedDate[6])
    } else {
        month = Number(calendar.selectedDate.slice(5,7))
    }

    let receptionsCount = 0
    if (calendar.doctors.length > 0) {
        calendar.doctors.map((doctor: any) => {
            receptionsCount += doctor.appointments.length
        })
    }

    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        if(window.innerWidth < 500){
            setIsMobile(true)
        }
    }, [])

    const generateName = () => {
        return(
            `${calendar.selectedDoctors[0].surname}`
        )
    }

    console.log(calendar.selectedDoctors)
    console.log(calendar.doctors)
    
    return (
        <div className={s.header}>
            <p className={s.date}>{calendar.selectedDate.slice(8)} {monthNames[month-1]} {!isMobile && `, ${receptionsCount} записи`}</p>
            {
                !isMobile
                ?
                    <MultiSelect value={calendar.selectedDoctors} onChange={(e) => calendar.setSelectedDoctors(e.value)} options={calendar.doctors} optionLabel="surname"
                                placeholder='Выберите сотрудников' maxSelectedLabels={4} className="w-full md:w-20rem"/>
                :
                    <Dropdown>
                        <Dropdown.Toggle className='d-flex w-100 justify-content-between align-items-center' style={{height: 42, background: "#EDF3FC", color: "#435875", border: "1px solid #D1D6E1"}}>{calendar.selectedDoctors[0].surname ? calendar.selectedDoctors[0].surname : "Выберите сотрудника"}</Dropdown.Toggle>
                        <Dropdown.Menu className='w-100'>
                            {calendar.doctors.map((doctor: any) =>
                                <Dropdown.Item
                                    key={doctor.id}
                                    onClick={() => calendar.setSelectedDoctors([doctor])}
                                >
                                    {doctor.surname}
                                </Dropdown.Item>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
            }
        </div>
    )
});

export default Header;
