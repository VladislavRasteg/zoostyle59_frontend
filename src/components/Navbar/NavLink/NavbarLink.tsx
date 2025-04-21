import s from './NavbarLink.module.scss'
import { NavLink, useNavigate } from "react-router-dom"
import Calendar from 'react-calendar';
import './Calendar.scss';
import React, { useState, useContext } from "react"
import {Context} from "../../../index";
import {motion} from "framer-motion";
import { useEffect } from 'react';
import {format, parse} from "date-fns";
import { ABONEMENTS_ROUTE } from '@/utils/consts';

interface NavbarLinkProps {
    link: string;
    name: string;
    icon: any;
    close: any;
  }


const NavbarLink = ({ link, name, icon, close }: NavbarLinkProps) => {

    const {calendar, user} = useContext(Context)
    const [selectedDate, setSelectedDate] = useState(format(parse(calendar.selectedDate, 'yyyy-MM-dd', new Date()), 'yyyy-MM-dd'))
    const navigate  = useNavigate()

    const changeDateHandler = (date: any) => {
        let month = ''
        if(date.getMonth()+1 < 10){
            month = `0${date.getMonth()+1}`
        } else {
            month = date.getMonth()+1
        }
        calendar.setSelectedDate(`${date.getFullYear()}-${month}-${date.getDate()}`)
        setSelectedDate(`${date.getFullYear()}-${month}-${date.getDate()}`)
    }

    useEffect(() => {
        setSelectedDate(format(parse(calendar.selectedDate, 'yyyy-MM-dd', new Date()), 'yyyy-MM-dd'))
    },[calendar.selectedDate])

    const navigateSchedule = () => {
        Promise.resolve()
        .then(() => navigate('/doctors/schedule'));
    }

    const navigatePositions = () => {
        Promise.resolve()
        .then(() => navigate('/doctors/positions'));
    }

    const navigateList = () => {
        Promise.resolve()
        .then(() => navigate('/doctors'));
    }

    const navigateUsersList = () => {
        Promise.resolve()
        .then(() => navigate('/users'));
    }

    const navigateRoles = () => {
        Promise.resolve()
        .then(() => navigate('/users/roles'));
    }

    return (
        <NavLink to={link} onClick={() => {close(false)}} className = { navData => navData.isActive ? s.active : s.linkWrapper }>
            {navData =>
            link === '/'
            ?
            <div className={s.calendar_container}>
                <div className={s.linkText}>{icon} {name}</div>
                <motion.div
                    initial={{ y: 30, opacity: 0.3 }}
                    animate={{ y: 0, opacity: 1}}
                    exit={{ y: 30, opacity: 0.3 }}
                    transition={{ type: "spring", bounce: 0, duration: 0.4}}
                    className={s.calendar_wrapper}>
                    <Calendar
                        onChange={(e: any) => changeDateHandler(e)}
                        value={selectedDate}
                    />
                </motion.div>
            </div>
            :
            navData.isActive && link.slice(0,8)==='/clients' && !!user?.currentBranch?.groupReceptions
            ?
            <div className={s.employeeWrapper}>
                <div className={s.linkText}>{icon} {name}</div>
                <motion.div
                initial={{ y: 30, opacity: 0.3 }}
                animate={{ y: 0, opacity: 1}}
                exit={{ y: 30, opacity: 0.3 }}
                transition={{ type: "spring", bounce: 0, duration: 0.4}}
                className={s.navbarSubPointsWrapper}>
                    <div onClick={() => {Promise.resolve().then(() => navigate('/clients'))}} className={window.location.pathname === '/clients' ? `${s.navbarSubPoint} ${s.activeLink}` : s.navbarSubPoint}>Клиенты</div>
                    <div onClick={() => {Promise.resolve().then(() => navigate('/clients/groups'))}} className={window.location.pathname === '/clients/groups' ? `${s.navbarSubPoint} ${s.activeLink}` : s.navbarSubPoint}>Группы</div>
                </motion.div>
            </div>
            :
            navData.isActive && link.slice(0,10)==='/abonement' && !!user?.currentBranch?.abonements
            ?
            <div className={s.employeeWrapper}>
                <div className={s.linkText}>{icon} {name}</div>
                <motion.div
                initial={{ y: 30, opacity: 0.3 }}
                animate={{ y: 0, opacity: 1}}
                exit={{ y: 30, opacity: 0.3 }}
                transition={{ type: "spring", bounce: 0, duration: 0.4}}
                className={s.navbarSubPointsWrapper}>
                    <div onClick={() => {Promise.resolve().then(() => navigate(ABONEMENTS_ROUTE))}} className={window.location.pathname === ABONEMENTS_ROUTE ? `${s.navbarSubPoint} ${s.activeLink}` : s.navbarSubPoint}>Типы абонементов</div>
                    <div onClick={() => {Promise.resolve().then(() => navigate(ABONEMENTS_ROUTE + '/list'))}} className={window.location.pathname === ABONEMENTS_ROUTE + '/list' ? `${s.navbarSubPoint} ${s.activeLink}` : s.navbarSubPoint}>Проданные абонементы</div>
                </motion.div>
            </div>
            :
            navData.isActive && link.slice(0,8)==='/doctors'
            ?
            <div className={s.employeeWrapper}>
                <div className={s.linkText}>{icon} {name}</div>
                <motion.div
                    initial={{ y: 30, opacity: 0.3 }}
                    animate={{ y: 0, opacity: 1}}
                    exit={{ y: 30, opacity: 0.3 }}
                    transition={{ type: "spring", bounce: 0, duration: 0.4}}
                    className={s.navbarSubPointsWrapper}>
                    <div onClick={navigateList} className={window.location.pathname === '/doctors' ? `${s.navbarSubPoint} ${s.activeLink}` : s.navbarSubPoint}>Список сотрудников</div>
                    <div onClick={navigatePositions} className={window.location.pathname === '/doctors/positions' ? `${s.navbarSubPoint} ${s.activeLink}` : s.navbarSubPoint}>Должности сотрудников</div>
                </motion.div>
            </div>
            :
            // navData.isActive && link.slice(0,6)==='/users'
            // ?
            // <div className={s.employeeWrapper}>
            //     <div className={s.linkText}>{icon} {name}</div>
            //     <motion.div
            //         initial={{ y: 30, opacity: 0.3 }}
            //         animate={{ y: 0, opacity: 1}}
            //         exit={{ y: 30, opacity: 0.3 }}
            //         transition={{ type: "spring", bounce: 0, duration: 0.4}}
            //         className={s.navbarSubPointsWrapper}>
            //         <div onClick={navigateUsersList} className={window.location.pathname === '/users' ? `${s.navbarSubPoint} ${s.activeLink}` : s.navbarSubPoint}>Пользователи</div>
            //         {/*<div onClick={navigateRoles} className={window.location.pathname === '/users/roles' ? `${s.navbarSubPoint} ${s.activeLink}` : s.navbarSubPoint}>Роли</div>*/}
            //         {/*<div style={{ opacity: '0.5', cursor: 'not-allowed' }} className={window.location.pathname === '/users/roles' ? `${s.navbarSubPoint} ${s.activeLink}` : s.navbarSubPoint}>Роли (В разработке)</div>*/}
            //     </motion.div>
            // </div>
            // :
            navData.isActive && link.slice(0,9) === '/settings' ?
                <div className={s.employeeWrapper}>
                    <div className={s.linkText}>{icon} {name}</div>
                    <motion.div
                        initial={{ y: 30, opacity: 0.3 }}
                        animate={{ y: 0, opacity: 1}}
                        exit={{ y: 30, opacity: 0.3 }}
                        transition={{ type: "spring", bounce: 0, duration: 0.4}}
                        className={s.navbarSubPointsWrapper}>
                        <div onClick={() => {Promise.resolve().then(() => navigate('/settings/branches'))}} className={window.location.pathname === '/settings/branches' ? `${s.navbarSubPoint} ${s.activeLink}` : s.navbarSubPoint}>Мои филиалы</div>
                        <div onClick={() => {Promise.resolve().then(() => navigate('/settings'))}} className={window.location.pathname === '/settings' ? `${s.navbarSubPoint} ${s.activeLink}` : s.navbarSubPoint}>Настройки филиала</div>
                        <div onClick={() => {Promise.resolve().then(() => navigate('/settings/company'))}} className={window.location.pathname == '/settings/company' ? `${s.navbarSubPoint} ${s.activeLink}` : s.navbarSubPoint}>Настройки компании</div>
                    </motion.div>
                </div>
            :
            <div className={s.linkText}>{icon} {name}</div>}

        </NavLink>
    )
}




export default NavbarLink;