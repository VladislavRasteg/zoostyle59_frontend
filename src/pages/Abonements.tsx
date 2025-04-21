import React, {useEffect} from 'react';
import s from "./Page.module.scss";
import {motion} from "framer-motion";
import { AbonementsList } from '@/futures/Abonement/ui/AbonementsList';

const Abonements = () => {

    useEffect(() => {
        document.title = 'Проданные абонементы';
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.3 }}
            transition={{ duration: 0.4}}
            className={s.page_wrapper}
        >
            <AbonementsList />
        </motion.div>
    )
}

export default Abonements;