import React, {useState, useContext, useEffect} from "react";
import s from "../Widget.module.scss"
import {ReactComponent as Logo} from '../assets/logo.svg'
import {ReactComponent as SquareLogo} from "@/assets/Logo150.svg"
import {ReactComponent as BackArrow} from '../assets/left_arrow.svg'
import {ReactComponent as LeftArrow} from '../assets/date_time_left_arrow.svg'
import {ReactComponent as RightArrow} from '../assets/date_time_right_arrow.svg'
import {observer} from "mobx-react-lite";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {Context} from "../../../index";
import {getDateTime} from "../../../http/widgetAPI";
import {Notification} from "@arco-design/web-react";
import SimpleBar from "simplebar-react";
import 'simplebar-react/dist/simplebar.min.css';
import "../Simplebar.scss"
import {Button} from "../../../shared/Button";
import {ITenant} from "@/interfaces/interfaces";

interface IBranch {
  id: number,
  name: string,
  city: string,
  street: string,
  lat: number,
  lon: number
}

interface IService {
  id: number,
  name: string,
  duration: number,
  price: number,
  selected: boolean,
  doctorProcedures: any,
  doctors: any,
}

interface IEmployee {
  id: number,
  first_name: string,
  surname: string,
  middle_name: string,
  position: { name: "" },
}

interface ISelectedDay {
  dateString: string,
  date: string,
  morningTime: string[],
  dayTime: string[],
  eveningTime: string[],
  serviceDuration: number
}

const SelectDateTime = observer(() => {

  const navigate = useNavigate()
  const {widget} = useContext(Context)
  const {id} = useParams()

  const [branch, setBranch] = useState<IBranch>({id: 0, name: '', city: '', street: '', lat: 0, lon: 0})
  const [services, setServices] = useState(Array<IService>)
  const [employee, setEmployee] = useState<IEmployee>({
    id: 0,
    first_name: '',
    surname: '',
    middle_name: '',
    position: {name: ''}
  })
  const [tenant, setTenant] = useState<ITenant>()
  const [schedule, setSchedule] = useState(Array<any>)
  const [currentDayStep, setCurrentDayStep] = useState(0)
  const [maxCurrentDayStep, setMaxCurrentDayStep] = useState(0)
  const [monthName, setMonthName] = useState('')

  const [selectedDay, setSelectedDay] = useState<ISelectedDay>({
    dateString: '',
    date: '',
    eveningTime: [],
    morningTime: [],
    dayTime: [],
    serviceDuration: 0
  })

  const [searchParams, setSearchParams] = useSearchParams();

  const servicesTemp = searchParams.get("services")?.split(',').map(function (item) {
    return Number(item);
  });

  useEffect(() => {
    getDateTime(Number(id), Number(searchParams.get("branchId")), servicesTemp, Number(searchParams.get("employee"))).then((data: any) => {
      document.title = data.tenant.name + ' | Онлайн-запись';
      let selectedFound = false;
      data.schedule.map((day: any) => {
        if (day.isActive && !selectedFound) {
          setSelectedDay(day)
          day.isSelected = true;
          selectedFound = true;
        }
      })
      setBranch(data.branch)
      setTenant(data.tenant)
      setServices(data.services)
      setEmployee(data.employee)
      setSchedule(data.schedule)
      setMaxCurrentDayStep((data.schedule.length / 7) - 1)
      const firstMonth = new Date(data.schedule[0].date)
      setMonthName(firstMonth.toLocaleDateString('ru', {month: 'long'}))
    }).catch((e) => {
      return (Notification.error({
        title: 'Ошибка',
        content: e.response.data.message,
      }))
    })
  }, [])

  const moveForward = () => {
    if (currentDayStep != maxCurrentDayStep) {
      const currentDayStepNext = currentDayStep + 1
      setCurrentDayStep(currentDayStepNext)
      const firstDayMonthName = new Date(schedule.slice(currentDayStepNext * 7, currentDayStepNext * 7 + 7)[0].date).toLocaleDateString('ru', {month: 'long'})
      const lastDayMonthName = new Date(schedule.slice(currentDayStepNext * 7, currentDayStepNext * 7 + 7)[6].date).toLocaleDateString('ru', {month: 'long'})
      if (firstDayMonthName === lastDayMonthName) {
        setMonthName(firstDayMonthName)
      } else {
        setMonthName(`${firstDayMonthName} - ${lastDayMonthName}`)
      }
    }
  }

  const moveBackward = () => {
    if (currentDayStep != 0) {
      const currentDayStepPast = currentDayStep - 1
      setCurrentDayStep(currentDayStepPast)
      const firstDayMonthName = new Date(schedule.slice(currentDayStepPast * 7, currentDayStepPast * 7 + 7)[0].date).toLocaleDateString('ru', {month: 'long'})
      const lastDayMonthName = new Date(schedule.slice(currentDayStepPast * 7, currentDayStepPast * 7 + 7)[6].date).toLocaleDateString('ru', {month: 'long'})
      if (firstDayMonthName === lastDayMonthName) {
        setMonthName(firstDayMonthName)
      } else {
        setMonthName(`${firstDayMonthName} - ${lastDayMonthName}`)
      }
    }
  }

  const dayClickHandle = (day: any) => {
    if (day.isActive && !day.isSelected) {
      schedule.map((day: any) => {
        day.isSelected = false;
        return (day)
      })
      setSelectedDay(day)
      day.isSelected = true;
    }
  }

  return (
    <div className={s.widget}>
      <div className={s.widget_wrapper}>
        <SimpleBar className={s.widget_scroll}>
          <div className={tenant?.bannerUrl ? s.branchSwitcher : s.branchSwitcherNoBanner}>
            {tenant?.bannerUrl &&
                <img
                    className={s.banner}
                    src={`${process.env.PUBLIC_S3_BUCKET_URL}${tenant?.bannerUrl}`}
                    alt='Баннер'
                ></img>
            }
            {tenant?.imageUrl
              ?
              <img className={tenant?.bannerUrl ? s.logo : s.logoNoBanner}
                   src={`${process.env.PUBLIC_S3_BUCKET_URL}${tenant?.imageUrl}`}
                   alt='Логотип'></img>
              :
              <div className={tenant?.bannerUrl ? s.logo : s.logoNoBanner}>
                <SquareLogo/>
              </div>
            }
          </div>
          <div className={s.widgetContent}>
            <div className={s.section}>
              <div className={s.section_name}>
                <a className={s.back_arrow}
                   onClick={() => navigate(`/widget/employees/${tenant.id}?branchId=${branch.id}&services=${servicesTemp}`)}><BackArrow/></a>
                <p className={s.text}>Выбор даты и времени</p>
              </div>
              <div className={`${s.servicesList}`}>
                <div className={`${s.employeeServices}`}>
                  <div className={s.employeeImageContent}>
                    <div className={s.employeeImage}>
                      {employee.surname[0]}{employee.first_name[0]}
                    </div>
                    <div className={s.employeeContent}>
                      <p className={s.employeePosition}>
                        {employee.position && employee.position.name}
                      </p>
                      <p className={s.employeeName}>
                        {employee.surname} {employee.first_name} {employee.middle_name}
                      </p>
                    </div>
                  </div>
                  {
                    services && services.map((service) => {
                      return (
                        <div key={service.id} className={s.serviceContentWithDot}>
                          <p className={s.serviceNameSmall}>-</p>
                          <p className={s.serviceNameSmall}>
                            {service.name}
                            &nbsp;<span
                            className={s.serviceDurationSmall}>{service.duration} минут</span>
                          </p>
                        </div>
                      )
                    })
                  }
                  <div className={s.dateTimeBlock}>
                    <div className={s.weekSwitcherWrapper}>
                      <p className={s.month}>{monthName}</p>
                      <div className={s.weekSwitcher}>
                        <a
                          className={`${s.weekSwitcherButtonWrapper} ${currentDayStep === 0 ? s.inactiveArrow : ''}`}
                          onClick={() => {
                            moveBackward()
                          }}><LeftArrow className={s.weekSwitcherButton}/></a>
                        <a
                          className={`${s.weekSwitcherButtonWrapper} ${currentDayStep === maxCurrentDayStep ? s.inactiveArrow : ''}`}
                          onClick={() => {
                            moveForward()
                          }}><RightArrow className={s.weekSwitcherButton}/></a>
                      </div>
                    </div>
                    <div className={s.daysWrapper}>
                      <div className={s.daysOfWeekList}>
                        <p className={s.dayOfWeek}>Пн</p>
                        <p className={s.dayOfWeek}>Вт</p>
                        <p className={s.dayOfWeek}>Ср</p>
                        <p className={s.dayOfWeek}>Чт</p>
                        <p className={s.dayOfWeek}>Пт</p>
                        <p className={s.dayOfWeek}>Сб</p>
                        <p className={s.dayOfWeek}>Вс</p>
                      </div>
                      <div className={s.daysList}>
                        {
                          schedule.slice(currentDayStep * 7, currentDayStep * 7 + 7).map((schedule_day: any) => {
                            return (
                              <p
                                key={schedule_day.date}
                                className={`${s.dayNumber} ${schedule_day.isActive ? s.active : s.inactive} ${schedule_day.isSelected ? s.selectedDay : ''}`}
                                onClick={() => {
                                  dayClickHandle(schedule_day)
                                }}
                              >
                                {schedule_day.date.slice(-2)}
                              </p>
                            )
                          })
                        }
                      </div>
                      <div className={s.dayTimeList}>
                        {
                          selectedDay.morningTime.length ?
                            <div className={s.timeTypeWrapper}>
                              <p className={s.timeType}>Утро</p>
                              <SimpleBar>
                                <div className={s.timeString}>
                                  {
                                    selectedDay.morningTime.map((time) => {
                                      const date = new Date()
                                      date.setHours(Number(time.slice(0, 2)))
                                      date.setMinutes(Number(time.slice(3, 5)) + selectedDay.serviceDuration)
                                      return (
                                        <a
                                          className={s.recordTimeButton}
                                          onClick={() => {
                                            navigate(`/widget/summary/${tenant.id}?branchId=${branch.id}&services=${servicesTemp}&employee=${employee.id}&date=${selectedDay.date}&time=${time}`)
                                          }}
                                        >
                                          {time} - {date.toLocaleTimeString('en-GB', {
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })}
                                        </a>
                                      )
                                    })
                                  }
                                </div>
                              </SimpleBar>
                            </div>
                            :
                            <></>
                        }
                        {
                          selectedDay.dayTime.length ?
                            <div className={s.timeTypeWrapper}>
                              <p className={s.timeType}>День</p>
                              <SimpleBar>
                                <div className={s.timeString}>
                                  {
                                    selectedDay.dayTime.map((time) => {
                                      const date = new Date()
                                      date.setHours(Number(time.slice(0, 2)))
                                      date.setMinutes(Number(time.slice(3, 5)) + selectedDay.serviceDuration)
                                      return (
                                        <a
                                          className={s.recordTimeButton}
                                          onClick={() => {
                                            navigate(`/widget/summary/${tenant.id}?branchId=${branch.id}&services=${servicesTemp}&employee=${employee.id}&date=${selectedDay.date}&time=${time}`)
                                          }}
                                        >
                                          {time} - {date.toLocaleTimeString('en-GB', {
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })}
                                        </a>
                                      )
                                    })
                                  }
                                </div>
                              </SimpleBar>
                            </div>
                            :
                            <></>
                        }
                        {
                          selectedDay.eveningTime.length ?
                            <div className={s.timeTypeWrapper}>
                              <p className={s.timeType}>Вечер</p>
                              <SimpleBar>
                                <div className={s.timeString}>
                                  {
                                    selectedDay.eveningTime.map((time: string) => {
                                      const date = new Date()
                                      date.setHours(Number(time.slice(0, 2)))
                                      date.setMinutes(Number(time.slice(3, 5)) + selectedDay.serviceDuration)
                                      return (
                                        <a
                                          className={s.recordTimeButton}
                                          onClick={() => {
                                            navigate(`/widget/summary/${tenant.id}?branchId=${branch.id}&services=${servicesTemp}&employee=${employee.id}&date=${selectedDay.date}&time=${time}`)
                                          }}
                                        >
                                          {time} - {date.toLocaleTimeString('en-GB', {
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })}
                                        </a>
                                      )
                                    })
                                  }
                                </div>
                              </SimpleBar>
                            </div>
                            :
                            <></>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <a href='https://www.zoostyle.com' className={s.zoostyleFootnoteWrapper}>
              <p className={s.zoostyleFootnote}>Работает на</p>
              <Logo/>
            </a>
          </div>
        </SimpleBar>
      </div>
    </div>
  )
})

export default SelectDateTime;
