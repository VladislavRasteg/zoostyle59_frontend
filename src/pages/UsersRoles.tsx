import React, {useEffect} from 'react';
import s from "./Page.module.scss";
import UserRoles from "../components/UserRoles/UserRoles";
import {motion} from "framer-motion";

const UsersRoles = () => {

    useEffect(() => {
        document.title = 'Роли пользователей';
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.3 }}
            transition={{ duration: 0.4}}
            className={s.page_wrapper}
        >
            <UserRoles />
        </motion.div>
    )
}

export default UsersRoles;