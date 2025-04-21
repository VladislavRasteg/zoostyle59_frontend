import React, {useEffect} from 'react';
import s from "./Page.module.scss";
import {motion} from "framer-motion";
import Positions from '../components/Positions/Positions';

const Doctors = () => {

    useEffect(() => {
        document.title = 'Должности сотрудников';
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.3 }}
            transition={{ duration: 0.4}}
            className={s.page_wrapper}
        >
            <Positions />
        </motion.div>
    )
}

export default Doctors;