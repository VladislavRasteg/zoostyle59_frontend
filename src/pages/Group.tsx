import React, {useEffect} from 'react';
import s from "./Page.module.scss";
import {motion} from "framer-motion";
import Group from "@/components/Group/Group";

const GroupPage = () => {

  useEffect(() => {
    document.title = 'Группа';
  }, []);

  return (
    <motion.div
      initial={{opacity: 0.3}}
      animate={{opacity: 1}}
      exit={{opacity: 0.3}}
      transition={{duration: 0.4}}
      className={s.page_wrapper}
    >
      <Group/>
    </motion.div>
  )
}

export default GroupPage;