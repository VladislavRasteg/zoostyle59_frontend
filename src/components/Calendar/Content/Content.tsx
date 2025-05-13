import React, {useState, useEffect, useContext} from "react"
import s from "./Content.module.scss";
import DoctorCard from "./DoctorCard"
import DoctorReceptions from './DoctorReceptions/DoctorReceptions'
import {observer} from "mobx-react-lite";
import {Dropdown, Form, Modal} from "react-bootstrap";
import {Notification} from "@arco-design/web-react";
import "@arco-design/web-react/dist/css/arco.css";
import {createReception, updateReception} from "../../../http/receptionAPI";
import {getAllClients} from "../../../http/clientsAPI";
import {listCalendar} from "../../../http/calendarAPI";
import {Context} from "../../..";
import {ReactComponent as RightArrow} from "./assets/right_arrow.svg"
import Multiselect from "../../../shared/Multiselect/Multiselect";
import {Scrollbar} from 'react-scrollbars-custom';
import {AppointmentModal} from "@/widgets/AppointmentModal";
import moment from "moment";
import {parse} from "date-fns";
import {Button} from "@/shared/Button"
import {IClient, IEmployee, IService} from "@/interfaces/interfaces";
import {useNavigate} from "react-router-dom";
import {CLIENTS_ROUTE, DOCTORS_ROUTE, PROCEDURES_ROUTE} from "@/utils/consts";
import {MobileScrollDatePicker} from "@/futures/MobileScrollDatePicker";
import {ReactComponent as IconLogo} from "@/assets/logo_icon_only.svg"
import {ReactComponent as TickIcon} from "@/assets/tick.svg"

const Content = observer(() => {

  const {user, calendar} = useContext(Context)

  const [startWorkTime, setStartWorkTime] = useState('09:00:00')
  const [endWorkTime, setEndWorkTime] = useState('22:00:00')

  const [isDayWeekend, setIsDayWeekend] = useState(false)

  const [doctors, setDoctors] = useState([])
  const [selectedDoctors, setSelectedDoctors] = useState(Array<any>)
  const [procedures, setProcedures] = useState([])
  const [page, setPage] = useState(1)
  const [appointmentId, setAppointmentId] = useState<number>()
  const [polisOMSnumber, setPolisOMSnumber] = useState<string>('')
  const [isAbonement, setIsAbonement] = useState(false)
  
  const [propsSum, setPropsSum] = useState<number>()
  const [petId, setPetId] = useState<number>()
  const [loading, setLoading] = useState(true)
  const [client, setClient] = useState<IClient>()
  const [doctor, setDoctor] = useState<Partial<IEmployee>>()
  const [date, setDate] = useState("")
  const [receptionTime, setReceptionTime] = useState("")
  const [receptionEndTime, setReceptionEndTime] = useState("")
  const [isEndTimeSetManually, setIsEndTimeSetManually] = useState(false)
  const [selectedProcedures, setSelectedProcedures] = useState<IService[]>()
  const [note, setNote] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [isNewReception, setIsNewReception] = useState(false)

  const [showUpdateTime, setShowUpdateTime] = useState(false)
  const [show, setShow] = useState(false)

  const [selectedReception, setSelectedReception] = useState({
    id: "",
    date: "",
    time: "",
    endTime: "",
    duration: 0,
    name: "",
    client: "",
    clientId: -1,
    doctorId: -1,
    appointmentServices: []
  })

  const [initialTime, setInitialTime] = useState('')
  const [newTime, setNewTime] = useState('')
  const [newDoctor, setNewDoctor] = useState('')
  const [newDoctorId, setNewDoctorId] = useState(-1)

  const [realStartTime, setRealStartTime] = useState('')
  const [realEndTime, setRealEndTime] = useState('')
  const [isMobile, setIsMobile] = useState(false)

  const [currentReception, setCurrentReception] = useState({time: "", duration: 0, name: "", client: ""})

  const workDayMinutes = Number(endWorkTime.slice(0, 2)) * 60 + Number(endWorkTime.slice(3, 5)) - Number(startWorkTime.slice(0, 2)) * 60 + Number(startWorkTime.slice(3, 5))

  const handleShow = (time: string, doctor: any) => {
    setIsEndTimeSetManually(false)
    setReceptionTime(time)
    setReceptionEndTime(`${(Number(time.slice(0, 2)) + 1) < 10 ? `0${Number(time.slice(0, 2)) + 1}` : `${Number(time.slice(0, 2)) + 1}`}:${time.slice(3, 5)}`)
    setDate(calendar.selectedDate)
    setDoctor(doctor)
    setShow(true)
  };

  const selectedDate = parse(calendar.selectedDate, 'yyyy-MM-dd', new Date())

  const minutesToTime = (minutes: number) => {
    var m = minutes % 60;
    var h = (minutes - m) / 60;
    var HHMM = (h < 10 ? "0" : "") + h.toString() + ":" + (m < 10 ? "0" : "") + m.toString();
    return (HHMM)
  }

  const initialFetchListCalendar = () => {
    listCalendar(page, 100, calendar.selectedDate)
      .then((data: any) => {
        const users = data.data.calendar.map((item: any) => {
          item['user'].appointments = item['appointments']
          return item['user']
        })
        calendar.setDoctors(users)
        calendar.setSelectedDoctors(users.slice(0, 4))
        if (window.innerWidth < 500) {
          setSelectedDoctors([users[0]])
          calendar.setSelectedDoctors([users[0]])
        }
        setSelectedDoctors(users.slice(0, 4))
        setDoctors(users)
        setProcedures(data.data.services)
        setLoading(false)
      })
  }

  useEffect(() => {
    initialFetchListCalendar()
  }, [user.currentBranch?.id])

  useEffect(() => {
    listCalendar(page, 100, calendar.selectedDate)
      .then((data: any) => {
        const users = data.data.calendar.map((item: any) => {
          item['user'].appointments = item['appointments']
          return item['user']
        })

        calendar.setDoctors(users)

        // const doctors2 =  calendar.selectedDoctors && calendar.selectedDoctors.map((doctor: any) => {
        //   const findedDoctor = users.find((doc: any) => doc.id === doctor.id)
        //   return findedDoctor
        // })

        // console.log(doctors)
        
        calendar.setSelectedDoctors(
          calendar.selectedDoctors && calendar.selectedDoctors.map((doctor: any) => {
            const findedDoctor = users.find((doc: any) => doc.id === doctor.id)
            return findedDoctor
          })
        )
        

        setProcedures(data.data.services)

        setIsNewReception(false)


        let _realStartTime = "08:00"
        let _realEndTime = "22:00"
        const day = selectedDate.getDay()

        setRealStartTime(_realStartTime)
        setRealEndTime(_realEndTime)

        if (_realStartTime.slice(3) !== '00:00') {
          setStartWorkTime(`${_realStartTime.slice(0, 2)}:00:00`)
        } else {
          setStartWorkTime(_realStartTime)
        }

        if (_realEndTime.slice(3) !== '00:00') {
          let openH
          if (_realEndTime[0] !== '0') {
            openH = Number(_realEndTime.slice(0, 2))
            setEndWorkTime(`${openH + 1}:00:00`)
          } else {
            openH = Number(_realEndTime[1])
            setEndWorkTime(`0${openH + 1}:00:00`)
          }
        } else {
          setEndWorkTime(_realEndTime)
        }
      })

    if (window.innerWidth < 500) {
      setIsMobile(true)
    }
  }, [isNewReception, calendar.selectedDate])

  const contains = (where: any, what: any) => {
    const whereId = []
    const whatId = []
    for (let i = 0; i < what.length; i++) {
      whatId.push(what[i].id)
    }
    for (let i = 0; i < where.length; i++) {
      whereId.push(where[i].id)
    }
    for (let i = 0; i < whatId.length; i++) {
      if (whereId.indexOf(whatId[i]) == -1) return false;
    }
    return true;
  }

  useEffect(() => {
    listCalendar(page, 100, calendar.selectedDate).then((data: any) => {
      const doctors = data.data.calendar.map((item: any) => {
        item['user'].appointments = item['appointments']
        return item['user']
      })
      if (contains(doctors, calendar.selectedDoctors)) {
        setSelectedDoctors(calendar.selectedDoctors)
      }
    })
  }, [calendar.selectedDoctors])


  const handleClose = () => {
    console.log("close")
    setClient(undefined)
    setDoctor(undefined)
    setDate("")
    setReceptionTime("")
    setReceptionEndTime("")
    setSelectedProcedures([])
    setNote("")
    setShow(false)
    setSearchResult([])
    setPropsSum(0)
    setPetId(undefined)
    setIsNewReception(true)
  };

  const handleShowUpdateTime = (initial_time: string, new_time: string, reception: any, doctor: any) => {
    setInitialTime(initial_time)
    setNewTime(new_time)

    let newDoctorName = `${doctor.surname} ${doctor.first_name[0]}. ${doctor.middle_name[0]}.`
    setNewDoctor(newDoctorName)
    setNewDoctorId(doctor.id)
    setSelectedReception(reception)
    setShowUpdateTime(true)
  }

  const handleCloseUpdateTime = () => {
    setInitialTime("")
    setNewTime("")
    setNewDoctorId(-1)
    setNewDoctor('')
    setShowUpdateTime(false)
  }

  const updateReceptionTime = async () => {
    const timeDifferenceWhenUpdateReception = Number(selectedReception.time.slice(0, 2)) * 60 + Number(selectedReception.time.slice(3, 5)) - Number(newTime.slice(0, 2)) * 60 - Number(newTime.slice(3, 5))
    const oldEndDateTime = new Date()
    oldEndDateTime.setHours(Number(selectedReception.endTime.slice(0, 2)))
    oldEndDateTime.setMinutes(Number(selectedReception.endTime.slice(3, 5)))
    const newEndDateTime = new Date(oldEndDateTime.getTime() + -timeDifferenceWhenUpdateReception * 60000)
    selectedReception.endTime = newEndDateTime.toTimeString().slice(0, 5)

    selectedReception.time = newTime
    const selectedReceptionProcedures = selectedReception.appointmentServices.map((pecProc: any) => {
      return (pecProc.procedure)
    })
    setIsNewReception(true)
    try {
      await updateReception(Number(selectedReception.id), selectedReception.date, selectedReception.time, selectedReception.endTime, selectedReception.clientId, newDoctorId, selectedReceptionProcedures, note, user.currentBranch?.id)
        .then((data: any) => {
          return (Notification.success({
            title: 'Сообщение',
            content: 'Запись успешно обновлена',
          }))
        })
    } catch (e) {
      alert(e)
    }

    handleCloseUpdateTime()
  }

  let time = startWorkTime.slice(0, 5)

  let timecolumn = []

  while (time != endWorkTime.slice(0, 5)) {
    timecolumn.push(time)
    time = minutesToTime(Number(time.slice(0, 2)) * 60 + Number(time.slice(3)) + 30)
  }

  timecolumn.push(time)

  const currentTime = new Date()
  const compareStartTime = new Date()
  compareStartTime.setHours(Number(startWorkTime.slice(0, 2)))
  compareStartTime.setMinutes(Number(startWorkTime.slice(3, 5)))
  compareStartTime.setSeconds(0)
  const comapreEndTime = new Date()
  comapreEndTime.setHours(Number(endWorkTime.slice(0, 2)))
  comapreEndTime.setMinutes(Number(endWorkTime.slice(3, 5)))
  comapreEndTime.setSeconds(0)


  const TimeDiff = currentTime.getHours() * 60 + currentTime.getMinutes() - Number(startWorkTime.slice(0, 2)) * 60 + Number(startWorkTime.slice(3, 5))

  const showAppointmentModalHandler = (client: IClient, propsSum: number, petId: number, employee: number, startTime: string, endTime: string, services: IService[], appointmentId: number, propsDate: string, polisOMSnumber: string, isAbonement = false) => {
    setShow(true)
    setClient(client)
    setDoctor({id: employee})
    setPropsSum(propsSum)
    setPetId(petId)
    setDate(propsDate)
    setReceptionTime(startTime)
    setReceptionEndTime(endTime)
    setSelectedProcedures(services)
    setAppointmentId(appointmentId)
    setPolisOMSnumber(polisOMSnumber)
    setIsAbonement(isAbonement)
  }

  const navigate = useNavigate()

  if (!loading && (!selectedDoctors || selectedDoctors.length === 0 || !procedures || procedures.length === 0)) {
    return (
      <div className={s.setup_wrapper}>
        <div className={s.setup_steps}>
          <div className={s.setup_title_wrapper}>
            <div className={s.circular_progress}>
              <IconLogo className={s.setup_icon}/>
              <svg className={s.progress_svg}>
                <circle cx="70" cy="70" r="70"></circle>
                <circle cx="70" cy="70" r="70"></circle>
              </svg>
            </div>
            <p className={s.setup_heading}>Быстрая настройка Зоостиль</p>
          </div>
          <a className={`${s.setup_step} ${procedures.length > 0 ? s.enabled : ""}`}
             onClick={() => navigate(PROCEDURES_ROUTE + "/?isNew=true")}>
            <div className={s.step_info}>
              <p className={s.step_name}>Создайте услугу</p>
              {
                procedures.length > 0 &&
                  <div className={s.tick}>
                      <TickIcon/>
                  </div>
              }
            </div>
          </a>
          <a className={`${s.setup_step} ${selectedDoctors.length > 0 ? s.enabled : ""}`}
             onClick={() => navigate(DOCTORS_ROUTE + "/?isNew=true")}>
            <div className={s.step_info}>
              <p className={s.step_name}>Добавьте специалиста</p>
              {
                selectedDoctors.length > 0 &&
                  <div className={s.tick}>
                      <TickIcon/>
                  </div>
              }
            </div>
          </a>
          <a className={s.setup_step} onClick={() => navigate(CLIENTS_ROUTE + "/?isNew=true")}>
            <div className={s.step_info}>
              <p className={s.step_name}>Первая запись</p>
            </div>
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className={s.content}>
      {show &&
          <AppointmentModal
              date={date}
              show={show}
              employeeId={doctor?.id}
              mode="create"
              propsSum={propsSum}
              petId={petId}
              startTime={receptionTime}
              endTime={receptionEndTime}
              onClose={handleClose}
              client={client}
              propsSelectedServices={selectedProcedures}
              updateReceptions={() => setIsNewReception(true)}
              appointmentId={appointmentId}
              polisOMSnumber={polisOMSnumber}
              isAbonement={isAbonement}
          />
      }

      <Modal
        show={showUpdateTime}
        onHide={handleCloseUpdateTime}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Перенести сеанс?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className='d-flex flex-column rounded-3 mt-3 mb-3 gap-3' style={{
            width: "100%",
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 22,
            paddingBottom: 22
          }}>
            <div className="d-flex flex-row gap-4" style={{alignItems: 'center'}}>
              <Form.Control className="rounded-3" placeholder='С' value={initialTime.slice(0, 5)}
                            onChange={e => setInitialTime(e.target.value)}
                            style={{height: 42, width: 72, background: "#EDF3FC"}}/>
              <RightArrow className={s.svg} style={{width: 32, height: 32}}/>
              <Form.Control className="rounded-3" placeholder='На' value={newTime}
                            onChange={e => setNewTime(e.target.value)}
                            style={{height: 42, width: 72, background: "#EDF3FC"}}/>
            </div>
            <Form.Control className="rounded-3" placeholder='Сотрудник' value={newDoctor}
                          onChange={e => setNewDoctor(e.target.value)}
                          style={{height: 42, width: 224, background: "#EDF3FC"}}/>
          </Form>
        </Modal.Body>
        <Modal.Footer className='d-flex flex-row'>
          <Button fullWidth onClick={updateReceptionTime}>
            Перенести
          </Button>
        </Modal.Footer>
      </Modal>

      <div className={s.doctors}>
        {selectedDoctors && selectedDoctors.map((doctor: any) =>
          <DoctorCard
            key={doctor.id}
            breakData={{doctor: doctor, date: calendar.selectedDate, branchId: user.currentBranch?.id}}
            surname={doctor.surname}
            first_name={doctor.first_name}
            last_name={doctor.middle_name}
            refetchCalendar={initialFetchListCalendar}
          />
        )}
      </div>

      {
        !isMobile ?
          <div className={s.calendar_wrapper}>
            {currentTime >= compareStartTime && currentTime <= comapreEndTime &&
                <div className={s.currentTime}
                     style={{top: `calc((100vh - 200px - 24px) / ${workDayMinutes} * ${TimeDiff} - 6px + 104px)`}}>
                    <div className={s.currentTimeTime}>
                      {(currentTime.getHours() < 10 ? '0' : '') + currentTime.getHours()}:{(currentTime.getMinutes() < 10 ? '0' : '') + currentTime.getMinutes()}
                    </div>
                    <div className={s.currentTimeLine}>

                    </div>
                </div>
            }
            <div className={s.time_column}>
              {timecolumn.map((time: any) =>
                time.slice(-2) == '30' ? <p key={time} className={s.half}>30</p> : <p className={s.time}>{time}</p>)
              }
            </div>
            <div className={s.receptions}>
              {
                selectedDoctors.map((doctor: any) =>
                  doctor.appointments &&
                    <DoctorReceptions key={doctor.id} showAppointmentModalHandler={showAppointmentModalHandler}
                                      refetchCalendar={initialFetchListCalendar} isDayWeekend={isDayWeekend}
                                      dayOfWeek={selectedDate.getDay()} workDayMinutes={workDayMinutes} doctor={doctor}
                                      updateTime={handleShowUpdateTime} create={handleShow}
                                      receptions={doctor.appointments} startTime={startWorkTime} endTime={endWorkTime}
                                      realStartTime={realStartTime} realEndTime={realEndTime}
                                      currentReception={currentReception} setCurrentReception={setCurrentReception}/>
                )
              }
            </div>
          </div>
          :
          <Scrollbar style={{width: "100%", height: "100%"}}>
            <div className={s.calendar_wrapper}>
              {currentTime >= compareStartTime && currentTime <= comapreEndTime &&
                  <div className={s.currentTime} style={{top: `calc(100% / ${workDayMinutes} * ${TimeDiff})`}}>
                      <div className={s.currentTimeTime}>
                        {(currentTime.getHours() < 10 ? '0' : '') + currentTime.getHours()}:{(currentTime.getMinutes() < 10 ? '0' : '') + currentTime.getMinutes()}
                      </div>
                      <div className={s.currentTimeLine}>

                      </div>
                  </div>
              }
              <div className={s.time_column}>
                {timecolumn.map((time: any) =>
                  time.slice(-2) == '30' ? <p key={time} className={s.half}>30</p> : <p className={s.time}>{time}</p>)
                }
              </div>
              <div className={s.receptions}>
                {
                  selectedDoctors.map((doctor: any) =>
                    doctor.appointments &&
                      <DoctorReceptions key={doctor.id} showAppointmentModalHandler={showAppointmentModalHandler}
                                        refetchCalendar={initialFetchListCalendar} isDayWeekend={isDayWeekend}
                                        dayOfWeek={selectedDate.getDay()} workDayMinutes={workDayMinutes}
                                        doctor={doctor} updateTime={handleShowUpdateTime} create={handleShow}
                                        receptions={doctor.appointments} startTime={startWorkTime} endTime={endWorkTime}
                                        realStartTime={realStartTime} realEndTime={realEndTime}
                                        currentReception={currentReception} setCurrentReception={setCurrentReception}/>
                  )
                }
              </div>
            </div>
            <MobileScrollDatePicker/>
            <div className={s.mobile_day_switcher_freespace}>

            </div>
          </Scrollbar>
      }
    </div>
  )
});

export default Content;
