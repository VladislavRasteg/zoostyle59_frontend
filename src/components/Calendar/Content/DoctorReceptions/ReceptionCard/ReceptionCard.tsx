import React, {useEffect, useState} from "react"
import s from "./ReceptionCard.module.scss";
import uniqolor from 'uniqolor';
import {motion} from "framer-motion";
import {Context} from "../../../../../index";
import {OverlayTrigger, Popover} from 'react-bootstrap';
import { IAppointment, IClient, IEmployee, IService } from "@/interfaces/interfaces";

let blend = require('color-blending')

interface DoctorReceptionsProps {
    reception: IAppointment,
    setCurrentReception: any,
    workDayMinutes: number,
    startTime: string
    showAppointmentModalHandler: (client: IClient, employee: number, startTime: string, endTime: string, services: IService[], appointmentId: number, propsDate: string, polisOMS: string, isAbonement: boolean) => void
}

const ReceptionCard = ({reception, setCurrentReception, workDayMinutes, startTime, showAppointmentModalHandler}: DoctorReceptionsProps) => {

    const receptionDuration = (Number(reception.endTime.slice(0, 2)) * 60 + Number(reception.endTime.slice(3, 5))) - (Number(reception.time.slice(0, 2)) * 60 + Number(reception.time.slice(3, 5)))

    const receptionProcedures = reception.receptionProcedures.map((pecProc: any) => {
        return (pecProc.procedure.name)
    })

    const [isMobile, setIsMobile] = useState(Boolean)

    useEffect(() => {
        if (window.innerWidth < 500) {
            setIsMobile(true)
        } else {
            setIsMobile(false)
        }
    }, [])

    const popover = (endTime: string) => (
        <Popover id="popover-basic" className={s.popover}>
            <motion.div
                initial={{x: 30, opacity: 0.3}}
                animate={{x: 0, opacity: 1}}
                exit={{x: 30, opacity: 0.3}}
                transition={{type: "spring", bounce: 0, duration: 0.5}}>
                <Popover.Header as="h5"
                                style={{background: '#fff'}}>{reception.time.slice(0, 5)} - {endTime.slice(0, 5)}</Popover.Header>
                <Popover.Body style={{fontSize: 14, lineHeight: '110%'}} className='d-flex flex-column gap-1'>
                    {reception?.client &&
                        <>
                            <p style={{ marginTop: 0, marginBottom: 0, fontWeight: 400 }}>
                                {reception.client.surname} {reception.client.first_name} {reception.client.middle_name}
                            </p>
                            <p style={{marginTop: 2, marginBottom: 4, fontWeight: 400}}>{reception.client.phone}</p>
                        </>
                    }
                    {reception?.group &&
                      <>
                          <p style={{marginTop: 0, marginBottom: 0, fontWeight: 400}}>
                              Группа: {reception?.group?.name}
                          </p>
                          <p style={{marginTop: 2, marginBottom: 4, fontWeight: 400}}>{reception?.group?.clients?.length} участинков</p>
                      </>
                    }
                    {
                        receptionProcedures.map((procedure: any) => {
                            return (<p style={{marginTop: 0, marginBottom: 0, fontWeight: 500}}>{procedure}</p>)
                        })
                    }
                </Popover.Body>
            </motion.div>
        </Popover>
    );

    const dragOverHandler = (e: any) => {
        e.preventDefault()
    }
    const dragLeaveHandler = (e: any) => {
        e.target.style.display = 'flex'
    }
    const dragStartHandler = (e: any, reception: any) => {
        setCurrentReception(reception)
        e.target.style.opacity = 1.0
        e.target.style.webkitOpacity = 1.0

        //e.target.style.zIndex = -1
        setTimeout(function () {
            e.target.style.display = 'none'
        }, 0.1);
    }
    const dragEndHandler = (e: any, reception: any) => {
        e.target.style.display = 'flex'
    }
    const dropHandler = (e: any, reception: any) => {
        e.preventDefault()
    }

    const TimeDiff = Number(reception.time.slice(0, 2)) * 60 + Number(reception.time.slice(3, 5)) - Number(startTime.slice(0, 2)) * 60 + Number(startTime.slice(3, 5))
    if (receptionDuration <= 30) {
        const color = uniqolor(receptionProcedures[0])
        const textColor = blend(color.color, '#000000');
        const bgColor50 = blend(color.color, '#ffffff');
        const bgColor25 = blend(bgColor50, '#ffffff')

        return (
            <OverlayTrigger trigger="hover" placement="auto" overlay={popover(reception.endTime)}>
                <motion.div
                    draggable={true}
                    onDragOver={(e) => dragOverHandler(e)}
                    onDragLeave={(e) => dragLeaveHandler(e)}
                    onDragStart={(e) => dragStartHandler(e, reception)}
                    onDragEnd={(e) => dragEndHandler(e, reception)}
                    onDrop={(e) => dropHandler(e, reception)}

                    onClick={() => showAppointmentModalHandler(reception.client, reception.doctorId, reception.time, reception.endTime, reception.receptionProcedures.map((rp) => JSON.parse(JSON.stringify(rp.procedure))), reception.id, reception.date, reception?.polisOMS, reception.is_abonement_reception)}

                    initial={{y: 50, opacity: 0.3}}
                    animate={{y: 0, opacity: 1}}
                    exit={{y: 50, opacity: 0.3}}
                    transition={{type: "spring", bounce: 0, duration: 0.7}}
                    drag-class="dragClass"
                    className={s.reception_filled}
                    style={{
                        height: `calc((${isMobile ? "100% - 16px" : "100vh - 200px - 24px"}) / ${workDayMinutes} * ${receptionDuration} )`,
                        top: `calc((${isMobile ? "100% - 16px" : "100vh - 200px - 24px"}) / ${workDayMinutes} * ${TimeDiff})`,
                        background: `${bgColor25}`,
                        border: `1.4px solid ${color.color}60`,
                        color: textColor
                    }}
                    key={reception.time}
                >
                    <div className={s.reception_body_small}>
                        <div className={s.reception_time}> {reception.time.slice(0, 5)} - {reception.endTime.slice(0, 5)}</div>
                        {reception?.client && <>{reception.client.surname} {reception.client.first_name} {reception.client.middle_name}</>}
                        {reception?.group && <p>Группа: {reception?.group?.name}</p>}
                    </div>
                </motion.div>
            </OverlayTrigger>
        )
    } else if (receptionDuration < 60) {
        const color = uniqolor(receptionProcedures[0])
        const textColor = blend(color.color, '#000000');
        const bgColor50 = blend(color.color, '#ffffff');
        const bgColor25 = blend(bgColor50, '#ffffff')
        return (
            <OverlayTrigger trigger="hover" placement="auto" overlay={popover(reception.endTime)}>
                <motion.div
                    draggable={true}
                    onDragOver={(e) => dragOverHandler(e)}
                    onDragLeave={(e) => dragLeaveHandler(e)}
                    onDragStart={(e) => dragStartHandler(e, reception)}
                    onDragEnd={(e) => dragEndHandler(e, reception)}
                    onDrop={(e) => dropHandler(e, reception)}

                    onClick={() => showAppointmentModalHandler(reception.client, reception.doctorId, reception.time, reception.endTime, reception.receptionProcedures.map((rp) => JSON.parse(JSON.stringify(rp.procedure))), reception.id, reception.date, reception?.polisOMS, reception.is_abonement_reception)}

                    initial={{y: 50, opacity: 0.3}}
                    animate={{y: 0, opacity: 1}}
                    exit={{y: 50, opacity: 0.3}}
                    transition={{type: "spring", bounce: 0, duration: 0.7}}
                    className={s.reception_filled} style={{
                    height: `calc((${isMobile ? "100% - 16px" : "100vh - 200px - 24px"}) / ${workDayMinutes} * ${receptionDuration} )`,
                    top: `calc((${isMobile ? "100% - 16px" : "100vh - 200px - 24px"}) / ${workDayMinutes} * ${TimeDiff})`,
                    background: `${bgColor25}`,
                    border: `1.4px solid ${color.color}60`,
                    color: textColor
                }} key={reception.time}>
                    <div className={s.reception_body}>
                        <div className={s.reception_time}> {reception.time.slice(0, 5)} - {reception.endTime.slice(0, 5)} </div>
                        {reception?.client &&
                            <p style={{marginTop: 4, marginBottom: 0, fontWeight: 400}}>
                                {reception.client.surname} {reception.client.first_name} {reception.client.middle_name}
                            </p>
                        }
                        {reception?.group &&
                            <p style={{marginTop: 4, marginBottom: 0, fontWeight: 400}}>
                              Группа: {reception?.group?.name}
                            </p>
                        }

                        {!isMobile &&
                            <>
                                {reception?.client &&
                                  <p style={{
                                      marginTop: 4,
                                      marginBottom: 4,
                                      fontWeight: 400
                                  }}>{reception.client.phone}</p>
                                }
                                {reception?.group &&
                                  <p style={{
                                      marginTop: 4,
                                      marginBottom: 4,
                                      fontWeight: 400
                                  }}>{reception?.group?.clients?.length} участинков</p>
                                }

                                {receptionProcedures.map((procedure: any) => {
                                    return (<p style={{marginTop: 0, marginBottom: 0, fontWeight: 500}}>{procedure}</p>)
                                })}
                            </>
                        }
                    </div>
                </motion.div>
            </OverlayTrigger>
        )
    } else {
        const color = uniqolor(receptionProcedures[0])
        const textColor = blend(color.color, '#000000');
        const bgColor50 = blend(color.color, '#ffffff');
        const bgColor25 = blend(bgColor50, '#ffffff')
        return (
            <OverlayTrigger trigger="hover" placement="auto" overlay={popover(reception.endTime)}>
                <motion.div
                    draggable={true}
                    onDragOver={(e) => dragOverHandler(e)}
                    onDragLeave={(e) => dragLeaveHandler(e)}
                    onDragStart={(e) => dragStartHandler(e, reception)}
                    onDragEnd={(e) => dragEndHandler(e, reception)}
                    onDrop={(e) => dropHandler(e, reception)}

                    onClick={() => showAppointmentModalHandler(reception.client, reception.doctorId, reception.time, reception.endTime, reception.receptionProcedures.map((rp) => JSON.parse(JSON.stringify(rp.procedure))), reception.id, reception.date, reception?.polisOMS, reception.is_abonement_reception)}

                    initial={{y: 50, opacity: 0.3}}
                    animate={{y: 0, opacity: 1}}
                    exit={{y: 50, opacity: 0.3}}
                    transition={{type: "spring", bounce: 0, duration: 0.7}}
                    className={s.reception_filled} style={{
                    height: `calc((${isMobile ? "100% - 16px" : "100vh - 200px - 24px"}) / ${workDayMinutes} * ${receptionDuration} )`,
                    top: `calc((${isMobile ? "100% - 16px" : "100vh - 200px - 24px"}) / ${workDayMinutes} * ${TimeDiff})`,
                    background: `${bgColor25}`,
                    border: `1.4px solid ${color.color}60`,
                    color: textColor
                }} key={reception.time}>

                    <div className={s.reception_body}>
                        <div className={s.reception_time}>
                            {reception.time.slice(0, 5)} - {reception.endTime.slice(0, 5)}
                        </div>
                        {reception?.client &&
                          <p style={{marginTop: 4, marginBottom: 0, fontWeight: 400}}>
                              {reception.client.surname} {reception.client.first_name} {reception.client.middle_name}
                          </p>
                        }
                        {reception?.group &&
                          <p style={{marginTop: 4, marginBottom: 0, fontWeight: 400}}>
                              Группа: {reception?.group?.name}
                          </p>
                        }
                        {!isMobile &&
                            <>
                                {reception?.client &&
                                  <p style={{
                                      marginTop: 4,
                                      marginBottom: 4,
                                      fontWeight: 400
                                  }}>{reception.client.phone}</p>
                                }
                                {reception?.group &&
                                  <p style={{
                                      marginTop: 4,
                                      marginBottom: 4,
                                      fontWeight: 400
                                  }}>{reception?.group?.clients?.length} участинков</p>
                                }
                                {receptionProcedures.map((procedure: any) => {
                                    return (<p style={{marginTop: 0, marginBottom: 0, fontWeight: 500}}>{procedure}</p>)
                                })}
                            </>
                        }
                    </div>
                </motion.div>
            </OverlayTrigger>
        )
    }
};

export default ReceptionCard;
