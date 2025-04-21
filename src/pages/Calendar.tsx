import React, {useEffect} from 'react';
import s from "./Page.module.scss";
import CalendarHeader from "../components/Calendar/Header/Header";
import CalendarContent from "../components/Calendar/Content/Content";

import {motion} from "framer-motion";

const CalendarPage = () => {

    useEffect(() => {
        document.title = 'Календарь записей';
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.3 }}
            transition={{ duration: 0.4}}
            className={s.column_content}
        >
            <CalendarHeader />
            <CalendarContent />
        </motion.div>
    )
}

export default CalendarPage;