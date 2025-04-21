import React, {useState, useContext, useEffect} from "react";
import s from "../Widget.module.scss"
import {ReactComponent as Logo} from '../assets/logo.svg'
import {ReactComponent as SquareLogo} from "@/assets/Logo150.svg"
import {ReactComponent as LeftArrow} from '../assets/left_arrow.svg'
import {observer} from "mobx-react-lite";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {Context} from "../../../index";
import {getEmployees} from "../../../http/widgetAPI";
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

interface INearestTime {
  dateString: string,
  date: string,
  morningTime: string[],
  dayTime: string[],
  eveningTime: string[],
  serviceDuration: number
}

const SelectEmployee = observer(() => {

  const navigate = useNavigate()
  const {widget} = useContext(Context)
  const {id} = useParams()

  const [branch, setBranch] = useState<IBranch>({id: 0, name: '', city: '', street: '', lat: 0, lon: 0})
  const [services, setServices] = useState(Array<IService>)
  const [employees, setEmployees] = useState([])
  const [tenant, setTenant] = useState<ITenant>()

  const [searchParams, setSearchParams] = useSearchParams();

  const [nearestTime, setNearestTime] = useState(Array<INearestTime>)

  const servicesTemp = searchParams.get("services")?.split(',').map(function (item) {
    return Number(item);
  });

  useEffect(() => {
    getEmployees(Number(id), Number(searchParams.get("branchId")), servicesTemp).then((data: any) => {
      document.title = data.tenant.name + ' | Онлайн-запись';
      setBranch(data.branch)
      setTenant(data.tenant)
      setServices(data.services)
      setEmployees(data.employees)
      setNearestTime(data.employeesTime)
    }).catch((e) => {
      return (Notification.error({
        title: 'Ошибка',
        content: e.response.data.message,
      }))
    })
  }, [])

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
                   onClick={() => navigate(`/widget/services/${tenant.id}?branchId=${branch.id}`)}><LeftArrow/></a>
                <p className={s.text}>Выбор специалиста</p>
              </div>
              <div className={`${s.servicesList}`}>
                {
                  employees.map((employee: any, index) => {
                    return (
                      <div
                        className={`${s.employee}`}
                      >
                        <div className={s.employeeImageContent}
                             onClick={() => navigate(`/widget/datetime/${tenant.id}?branchId=${branch.id}&services=${servicesTemp}&employee=${employee.id}`)}
                        >
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
                        <p className={s.employeeNearestDate}>
                          Ближайшее время <span>{nearestTime[index].dateString}:</span>
                        </p>
                        <div className={s.timeList}>
                          {
                            nearestTime[index].morningTime.length ?
                              <div className={s.timeTypeWrapper}>
                                <p className={s.timeType}>Утро</p>
                                <SimpleBar>
                                  <div className={s.timeString}>
                                    {
                                      nearestTime[index].morningTime.map((time) => {
                                        const date = new Date()
                                        date.setHours(Number(time.slice(0, 2)))
                                        date.setMinutes(Number(time.slice(3, 5)) + nearestTime[index].serviceDuration)
                                        return (
                                          <a
                                            className={s.recordTimeButton}
                                            onClick={() => {
                                              navigate(`/widget/summary/${tenant.id}?branchId=${branch.id}&services=${servicesTemp}&employee=${employee.id}&date=${nearestTime[index].date}&time=${time}`)
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
                            nearestTime[index].dayTime.length ?
                              <div className={s.timeTypeWrapper}>
                                <p className={s.timeType}>День</p>
                                <SimpleBar>
                                  <div className={s.timeString}>
                                    {
                                      nearestTime[index].dayTime.map((time) => {
                                        const date = new Date()
                                        date.setHours(Number(time.slice(0, 2)))
                                        date.setMinutes(Number(time.slice(3, 5)) + nearestTime[index].serviceDuration)
                                        return (
                                          <a
                                            className={s.recordTimeButton}
                                            onClick={() => {
                                              navigate(`/widget/summary/${tenant.id}?branchId=${branch.id}&services=${servicesTemp}&employee=${employee.id}&date=${nearestTime[index].date}&time=${time}`)
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
                            nearestTime[index].eveningTime.length ?
                              <div className={s.timeTypeWrapper}>
                                <p className={s.timeType}>Вечер</p>
                                <SimpleBar>
                                  <div className={s.timeString}>
                                    {
                                      nearestTime[index].eveningTime.map((time: string) => {
                                        const date = new Date()
                                        date.setHours(Number(time.slice(0, 2)))
                                        date.setMinutes(Number(time.slice(3, 5)) + nearestTime[index].serviceDuration)
                                        return (
                                          <a
                                            className={s.recordTimeButton}
                                            onClick={() => {
                                              navigate(`/widget/summary/${tenant.id}?branchId=${branch.id}&services=${servicesTemp}&employee=${employee.id}&date=${nearestTime[index].date}&time=${time}`)
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
                          <br/>
                          <Button theme='tetrinary'
                                  onClick={() => navigate(`/widget/datetime/${tenant.id}?branchId=${branch.id}&services=${servicesTemp}&employee=${employee.id}`)}>Выбрать
                            дату</Button>
                        </div>
                      </div>
                    )
                  })
                }
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

export default SelectEmployee;
