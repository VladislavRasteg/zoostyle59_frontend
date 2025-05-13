import {useEffect} from 'react';
import s from './Page.module.scss'
import { motion } from "framer-motion"
import SellsList from '@/components/Sells/SellsList';

const Sells = () => {

    useEffect(() => {
        document.title = 'Продажи';
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.3 }}
            transition={{ duration: 0.4}}
            className={s.page_wrapper}
        >
            <SellsList />
        </motion.div>
    )
}

export default Sells;