import {useEffect} from 'react';
import s from './Page.module.scss'
import { motion } from "framer-motion"
import PurchasesList from '@/components/Purchases/PurchasesList';

const Purchases = () => {

    useEffect(() => {
        document.title = 'Закупки';
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.3 }}
            transition={{ duration: 0.4}}
            className={s.page_wrapper}
        >
            <PurchasesList />
        </motion.div>
    )
}

export default Purchases;