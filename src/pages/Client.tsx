import React, {useEffect} from 'react';
import s from "./Page.module.scss";
import Client from "../components/Client/Client";
import {motion} from "framer-motion";

const ClientPage = () => {

    useEffect(() => {
        document.title = 'Клиенты';
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.3 }}
            transition={{ duration: 0.4}}
            className={s.page_wrapper}
        >
            <Client />
        </motion.div>
    )
}

export default ClientPage;