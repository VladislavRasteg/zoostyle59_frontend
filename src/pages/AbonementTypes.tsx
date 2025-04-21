import React, {useEffect} from 'react';
import s from "./Page.module.scss";
import {motion} from "framer-motion";
import { AbonementTypesList } from '@/futures/Abonement/ui/AbonementTypesList';

const AbonementTypes = () => {

    useEffect(() => {
        document.title = 'Типы абонементов';
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.3 }}
            transition={{ duration: 0.4}}
            className={s.page_wrapper}
        >
            <AbonementTypesList />
        </motion.div>
    )
}

export default AbonementTypes;