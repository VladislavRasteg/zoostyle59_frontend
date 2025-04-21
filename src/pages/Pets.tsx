import {useEffect} from 'react';
import s from './Page.module.scss'
import { motion } from "framer-motion"
import PetsList from '@/components/Pets/PetsList';

const Pets = () => {

    useEffect(() => {
        document.title = 'Питомцы';
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.3 }}
            transition={{ duration: 0.4}}
            className={s.page_wrapper}
        >
            <PetsList />
        </motion.div>
    )
}

export default Pets;