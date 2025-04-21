import React, {useEffect} from 'react';
import s from "./Page.module.scss";
import CurrentReception from "../components/Reception/Reception";
import {motion} from "framer-motion";

const Reception = () => {

    useEffect(() => {
        document.title = 'Записи';
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.3 }}
            transition={{ duration: 0.4}}
            className={s.page_wrapper}
        >
            <CurrentReception />
        </motion.div>
    )
}

export default Reception;