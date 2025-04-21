import React, {useEffect, useState} from "react"
import s from "./BreakCard.module.scss";
import {motion} from "framer-motion";
import {IconClose} from "@arco-design/web-react/icon";
import {deleteBreak} from "@/http/breaksAPI";

interface DoctorReceptionsProps {
  breakEntity: any,
  workDayMinutes: number,
  startTime: string,
  refetchCalendar: () => void,
}

const BreakCard = ({breakEntity, workDayMinutes, startTime, refetchCalendar}: DoctorReceptionsProps) => {

  const receptionDuration = (Number(breakEntity.endTime.slice(0, 2)) * 60 + Number(breakEntity.endTime.slice(3, 5))) - (Number(breakEntity.time.slice(0, 2)) * 60 + Number(breakEntity.time.slice(3, 5)))

  const [isMobile, setIsMobile] = useState(Boolean)

  useEffect(() => {
    if (window.innerWidth < 500) {
      setIsMobile(true)
    } else {
      setIsMobile(false)
    }
  }, [])

  const removeBreak = async () => {
    await deleteBreak(breakEntity.id)
    refetchCalendar()
  }

  const TimeDiff = Number(breakEntity.time.slice(0, 2)) * 60 + Number(breakEntity.time.slice(3, 5)) - Number(startTime.slice(0, 2)) * 60 + Number(startTime.slice(3, 5))
  return (
    <motion.div
      initial={{y: 50, opacity: 0.3}}
      animate={{y: 0, opacity: 1}}
      exit={{y: 50, opacity: 0.3}}
      transition={{type: "spring", bounce: 0, duration: 0.7}}
      drag-class="dragClass"
      className={s.reception_filled}
      style={{
        height: `calc((${isMobile ? "100% - 16px" : "100vh - 200px - 24px"}) / ${workDayMinutes} * ${receptionDuration} )`,
        top: `calc((${isMobile ? "100% - 16px" : "100vh - 200px - 24px"}) / ${workDayMinutes} * ${TimeDiff})`,
        background: `#ECEEF5`,
        color: 'black'
      }}
      key={breakEntity.time}
    >
      <div className={s.reception_body_small}>
        <div className={s.reception_time}>
          {breakEntity?.isDayOff
            ? <b>Рабочий день отменён</b>
            : <>{breakEntity.time.slice(0, 5)} - {breakEntity.endTime.slice(0, 5)} | <b>Перерыв</b></>
          }
        </div>
        <div onClick={() => removeBreak()}>
          <IconClose />
        </div>
      </div>
    </motion.div>
  )
};

export default BreakCard;
