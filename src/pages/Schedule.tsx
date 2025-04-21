import React, {useEffect} from 'react';
import s from "./Page.module.scss";
import DoctorSchedule from "../components/Schedule/Schedule";
import {motion} from "framer-motion";

const Schedule = () => {

    useEffect(() => {
        document.title = 'Сотрудники';
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.3 }}
            transition={{ duration: 0.4}}
            className={s.page_wrapper}
        >
            <DoctorSchedule />
        </motion.div>
    )
}

export default Schedule;