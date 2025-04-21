import React, {useContext, useEffect, useState} from 'react';
import s from "./Page.module.scss";
import {motion} from "framer-motion";
import { Context } from '../index';
import { ReportsLayout } from '../components/Reports/ReportsLayout';

const Reports = () => {

    useEffect(() => {
        document.title = 'Отчеты';
      }, []);

      const {user} = useContext(Context)

    return (
        <motion.div
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.3 }}
            transition={{ duration: 0.4}}
            className={s.page_wrapper}
        >

           
           <ReportsLayout />
        </motion.div>
    )
}

export default Reports;