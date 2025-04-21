import React, {useEffect} from 'react';
import s from "./Page.module.scss";
import DoctorsList from "../components/Doctors/DoctorsList";
import {motion} from "framer-motion";

const Doctors = () => {

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
            <DoctorsList />
        </motion.div>
    )
}

export default Doctors;