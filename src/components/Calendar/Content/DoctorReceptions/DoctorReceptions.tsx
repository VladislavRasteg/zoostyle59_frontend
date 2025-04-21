import React, {useContext, useEffect, useState} from "react"
import s from "./DoctorReceptions.module.scss";
import ReceptionCard from "./ReceptionCard/ReceptionCard";
import {observer} from "mobx-react-lite";
import {Context} from "../../../../index";
import BreakCard from "@/components/Calendar/Content/DoctorReceptions/BreakCard/BreakCard";
import { IClient, IEmployee, IService } from "@/interfaces/interfaces";

interface DoctorReceptionsProps {
  workDayMinutes: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  receptions: [];
  create: any;
  updateTime: any;
  doctor: any;
  realStartTime: string;
  realEndTime: string;
  currentReception: any;
  setCurrentReception: any;
  isDayWeekend: boolean;
  showAppointmentModalHandler: (client: IClient, employee: number, startTime: string, endTime: string, services: IService[], appointmentId: number, propsDate: string, polisOMS: string, isAbonement: boolean) => void
  refetchCalendar: () => void;
}

const DoctorReceptions = ({
  workDayMinutes,
  isDayWeekend,
  dayOfWeek,
  receptions,
  startTime,
  endTime,
  create,
  updateTime,
  doctor,
  realStartTime,
  realEndTime,
  currentReception,
  setCurrentReception,
  refetchCalendar,
  showAppointmentModalHandler
}: DoctorReceptionsProps) => {


  //ПЕРЕНЕСТИ НА БЕК
  //Создается массив расписания сотрудника, берется цифра дня недели и достает из массива расписания.
  //Если день недели выходной, то для startTime и endTime закидываем одинаковое время => день закрыт

  //В будущем нужно сделать так, чтобы сотрудники, у которых не проставлено расписание в этот день вообще не присылались на фронт

  const doctorWorkTime = []
  if (!isDayWeekend) {
    if (doctor.schedule) {
      doctorWorkTime.push({
        'startTime': doctor.schedule.isSun ? doctor.schedule.sunFrom.slice(0, 5) : doctor.schedule.sunTo.slice(0, 5),
        'endTime': doctor.schedule.sunTo.slice(0, 5)
      })
      doctorWorkTime.push({
        'startTime': doctor.schedule.isMon ? doctor.schedule.monFrom.slice(0, 5) : doctor.schedule.monTo.slice(0, 5),
        'endTime': doctor.schedule.monTo.slice(0, 5)
      })
      doctorWorkTime.push({
        'startTime': doctor.schedule.isTue ? doctor.schedule.tueFrom.slice(0, 5) : doctor.schedule.tueTo.slice(0, 5),
        'endTime': doctor.schedule.tueTo.slice(0, 5)
      })
      doctorWorkTime.push({
        'startTime': doctor.schedule.isWed ? doctor.schedule.wedFrom.slice(0, 5) : doctor.schedule.wedTo.slice(0, 5),
        'endTime': doctor.schedule.wedTo.slice(0, 5)
      })
      doctorWorkTime.push({
        'startTime': doctor.schedule.isThu ? doctor.schedule.thuFrom.slice(0, 5) : doctor.schedule.thuTo.slice(0, 5),
        'endTime': doctor.schedule.thuTo.slice(0, 5)
      })
      doctorWorkTime.push({
        'startTime': doctor.schedule.isFri ? doctor.schedule.friFrom.slice(0, 5) : doctor.schedule.friTo.slice(0, 5),
        'endTime': doctor.schedule.friTo.slice(0, 5)
      })
      doctorWorkTime.push({
        'startTime': doctor.schedule.isSat ? doctor.schedule.satFrom.slice(0, 5) : doctor.schedule.satTo.slice(0, 5),
        'endTime': doctor.schedule.satTo.slice(0, 5)
      })
    }

    if (doctor.schedule) {
      if (realStartTime < doctorWorkTime[dayOfWeek].startTime) {
        realStartTime = doctorWorkTime[dayOfWeek].startTime
      }
      if (realEndTime > doctorWorkTime[dayOfWeek].endTime) {
        realEndTime = doctorWorkTime[dayOfWeek].endTime
      }
    }
  } else {
    realStartTime = realEndTime;
  }

  const dragOverHandler = (e: any) => {
    e.preventDefault()
    e.target.style.background = '#EDF3FC'
    //e.target.innerHTML = e.target.id
  }

  const dropHandler = (e: any, time: string) => {
    e.preventDefault()
    e.target.style.background = 'none'
    //e.target.innerHTML = ''
    updateTime(currentReception.time, e.target.id, currentReception, JSON.parse(e.target.getAttribute('data-doctor')))
  }

  const dragLeaveHandler = (e: any) => {
    e.preventDefault()
    //e.target.innerHTML = ''
    e.target.style.background = 'none'
  }

  const dragEndHandler = (e: any) => {
    e.preventDefault()
    //e.target.innerHTML = ''
    e.target.style.background = 'none'
  }

  const minutesToTime = (minutes: number) => {
    var m = minutes % 60;
    var h = (minutes - m) / 60;
    var HHMM = (h < 10 ? "0" : "") + h.toString() + ":" + (m < 10 ? "0" : "") + m.toString();
    return (HHMM)
  }

  const cardsCount = (workDayMinutes / 15);


  let time = startTime.toString().slice(0, 5)


  const workTime = []

  for (let i = 0; i < cardsCount; i++) {

    workTime.push(time)
    time = minutesToTime(Number(time.slice(0, 2)) * 60 + Number(time.slice(3)) + 15)
  }

  const timeToDate = (time: string) => {
    var chunks = time.split(':');
    var date = new Date();
    date.setHours(Number(chunks[0]));
    date.setMinutes(Number(chunks[1]));
    return date
  }

  const isInRealDay = (startTime: string, endTime: string, currentTime: string) => {
    var startTimeDate = timeToDate(startTime)
    var endTimeDate = timeToDate(endTime)
    var currentTimeDate = timeToDate(currentTime)

    if (currentTimeDate < startTimeDate || currentTimeDate >= endTimeDate) {
      return false
    } else {
      return true
    }

  }

  return (
    <div className={s.doctor_receptions}>
      {workTime.map((element: any) =>
        isInRealDay(realStartTime, realEndTime, element) ?
          <div
            onDragOver={(e) => dragOverHandler(e)}
            onDrop={(e) => dropHandler(e, element.time)}
            onDragLeave={(e) => dragLeaveHandler(e)}
            onDragEnd={(e) => dragEndHandler(e)}
            className={s.reception}

            id={element}
            data-doctor={JSON.stringify(doctor)}

            onClick={(e) => create(element, doctor)}
          ></div>
          :
          <div className={s.receptionInactive}></div>
      )}
      {
        receptions.map((element: any) =>
          <>
            {element?.isBreak
              ? <BreakCard startTime={startTime} workDayMinutes={workDayMinutes} breakEntity={element} refetchCalendar={refetchCalendar}/>
              : <ReceptionCard showAppointmentModalHandler={showAppointmentModalHandler} setCurrentReception={setCurrentReception} startTime={startTime} workDayMinutes={workDayMinutes} reception={element}/>
            }
          </>
        )
      }
    </div>
  )
};

export default DoctorReceptions;
