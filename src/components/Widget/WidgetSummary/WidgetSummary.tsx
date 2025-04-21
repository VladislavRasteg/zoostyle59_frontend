import React, {useState, useContext, useEffect} from "react";
import s from "../Widget.module.scss"
import {ReactComponent as Logo} from '../assets/logo.svg'
import {ReactComponent as BackArrow} from '../assets/left_arrow.svg'
import {ReactComponent as SquareLogo} from "@/assets/Logo150.svg"
import {observer} from "mobx-react-lite";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {Context} from "../../../index";
import {createRecord, getSummary} from "../../../http/widgetAPI";
import {Checkbox, Notification} from "@arco-design/web-react";
import SimpleBar from "simplebar-react";
import 'simplebar-react/dist/simplebar.min.css';
import "./Simplebar.scss"
import InputMask from "react-input-mask"
import {Dropdown, Form} from "react-bootstrap";
import {useForm} from "react-hook-form";
import {MenuItem, Select} from "@/shared/Select";
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

const sendEmailForDict = [
  {value: 2, label: '2 часа'},
  {value: 4, label: '4 часа'},
  {value: 8, label: '8 часов'},
  {value: 12, label: '12 часов'},
  {value: 24, label: '24 часа'},
]

const WidgetSummary = observer(() => {

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

  const [dateString, setDateString] = useState("")

  const [searchParams, setSearchParams] = useSearchParams();

  const servicesTemp = searchParams.get("services")?.split(',').map(function (item) {
    return Number(item);
  });

  const [duration, setDuration] = useState(0)
  const [sendEmailFor, setSendEmailFor] = useState(12)
  const [polisOMS, setPolisOMS] = useState(false)

  const time = searchParams.get("time")
  const date = searchParams.get("date")

  useEffect(() => {
    getSummary(Number(id), Number(searchParams.get("branchId")), servicesTemp, Number(searchParams.get("employee")), searchParams.get("date"))
      .then((data: any) => {
        document.title = data.tenant.name + ' | Онлайн-запись';
        setBranch(data.branch)
        setTenant(data.tenant)
        setServices(data.services)
        setEmployee(data.employee)
        setDateString(data.dateString)
        setDuration(data.serviceDuration)
      }).catch((e) => {
      return (Notification.error({
        title: 'Ошибка',
        content: e.response.data.message,
      }))
    })
  }, [])

  const {
    register,
    formState: {
      isValid,
    },
    handleSubmit,
    setValue,
    watch
  } = useForm({
    mode: "onBlur"
  });

  const formValues = watch()

  const endTime = new Date()

  if (time) {
    endTime.setHours(Number(time.slice(0, 2)))
    endTime.setMinutes(Number(time.slice(3, 5)) + duration)
  }

  const handleRecord = async (data: any) => {
    if (isValid && tenant?.id) {
      await createRecord(tenant.id, branch.id, data.surname, data.name, data.middle_name, data.phone, data.mail, data.comment, employee.id, date, time, endTime.toLocaleTimeString().slice(0, 5), services, true, sendEmailFor, polisOMS, polisOMS ? data.polisOMSnumber : '')
        .then((data: any) => {
          navigate(`/widget/success/${data.id}?branchId=${branch.id}`)
        })
    } else return (Notification.error({
      title: 'Ошибка',
      content: 'Заполните основные поля!',
    }))
  }

  return (
    <div className={s.widget}>
      <div className={s.widget_wrapper_light}>
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

          <div className={s.summaryWidgetContent}>

            <div className={s.section}>
              <div className={s.section_name}>
                <a className={s.back_arrow}
                   onClick={() => navigate(`/widget/datetime/${tenant?.id}?branchId=${branch.id}&services=${servicesTemp}&employee=${employee.id}`)}><BackArrow/></a>
                <div className={s.branchInfo}>
                  <p className={s.summaryBranchName}>{branch.name}</p>
                  <p className={s.branchAddress}>{branch.city}, {branch.street}</p>
                </div>
              </div>

              <p className={s.text}>Ваши данные</p>

              <div className={s.servicesList}>
                <div className={s.summaryClientDataWrapper}>
                  <div className={s.fieldGroup}>
                    <p className={s.fieldName}>Фамилия</p>
                    <Form.Control
                      placeholder="Ваша фамилия"
                      className={s.summaryInput}
                      {...register('surname', {required: false, pattern: /^[a-zA-Zа-яёА-ЯЁ]+$/u})}
                    />
                  </div>

                  <div className={s.fieldGroup}>
                    <p className={s.fieldName}>Имя *</p>
                    <Form.Control
                      placeholder="Ваше имя"
                      className={s.summaryInput}
                      {...register('name', {required: true, pattern: /^[a-zA-Zа-яёА-ЯЁ ]+$/u})}
                    />
                  </div>

                  <div className={s.fieldGroup}>
                    <p className={s.fieldName}>Отчество</p>
                    <Form.Control
                      placeholder="Ваше отчество"
                      className={s.summaryInput}
                      {...register('middle_name', {
                        required: false,
                        pattern: /^[a-zA-Zа-яёА-ЯЁ]+$/u
                      })}
                    />
                  </div>

                  <div className={s.fieldGroup}>
                    <p className={s.fieldName}>Телефон *</p>
                    <InputMask
                      // mask options
                      mask={"+9 999 999-99-99"}
                      alwaysShowMask={true}
                      maskPlaceholder=''
                      className={s.summaryInput}
                      type={'text'}
                      defaultValue='+7'
                      {...register("phone", {
                        required: true,
                        pattern: /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{14}$/
                      })}
                    />
                  </div>

                  <div className={s.fieldGroup}>
                    <p className={s.fieldName}>Почта</p>
                    <Form.Control
                      placeholder="Ваша почта"
                      className={s.summaryInput}
                      {...register('mail', {
                        required: false,
                        pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                      })}
                    />
                  </div>

                  <div className={s.fieldGroup}>
                    <p className={s.fieldName}>Отправить напоминание за:</p>

                    <Select
                      value={sendEmailFor}
                      onChange={e => setSendEmailFor(Number(e.target.value))}
                    >
                      {sendEmailForDict.map((value, index) =>
                        <MenuItem key={index} value={value.value}>
                          {value.label}
                        </MenuItem>
                      )}
                    </Select>
                  </div>

                  <p className={s.fieldName} style={{opacity: 0.6}}>На почту придёт напоминание
                    за {sendEmailForDict.find(x => x.value === sendEmailFor)?.label} до записи</p>

                  <div className={s.fieldGroup}>
                    <p className={s.fieldName}>Ваш комментарий</p>
                    <Form.Control
                      placeholder="Ваш комментарий"
                      className={s.summaryInput}
                      {...register('comment', {required: false})}
                    />
                  </div>

                  {tenant?.polisOMS &&
                      <>
                          <div
                              className={s.fieldGroup}
                              onClick={() =>
                                setPolisOMS(prevState => {
                                  prevState && setValue('polisOMSnumber', '')
                                  return !prevState
                                })
                              }
                          >
                              <div style={{display: 'flex', gap: '10px', flexDirection: 'row', marginTop: '10px'}}>
                                  <Checkbox checked={polisOMS}/>
                                  <p className={s.fieldName}>Оплата по полису ОМС</p>
                              </div>
                          </div>
                        {polisOMS &&
                            <div className={s.fieldGroup}>
                                <p className={s.fieldName}>Номер полиса</p>
                                <Form.Control
                                    placeholder="Введите номер полиса"
                                    className={s.summaryInput}
                                    {...register('polisOMSnumber', {
                                      onChange: (e) => {
                                        e.target.value = e.target.value.replace(/\D/g, '');
                                      },
                                      valueAsNumber: false,
                                    })}
                                />
                            </div>
                        }
                      </>
                  }
                </div>

                <p className={s.text}>Детали записи</p>

                <div className={s.detailsList}>
                  <div className={s.summaryDetail}>
                    <p className={s.summaryHeading}>
                      {employee.position && employee.position.name}
                    </p>
                    <p className={s.employeeName}>
                      {employee.surname} {employee.first_name} {employee.middle_name}
                    </p>
                  </div>
                  <div className={s.summaryDetail}>
                    <p className={s.summaryHeading}>
                      Дата и время
                    </p>
                    <p
                      className={s.employeeName}>{dateString}<span>, {time} - {endTime.toLocaleTimeString('en-GB', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span></p>
                  </div>
                  <div className={s.summaryDetail}>
                    <p className={s.summaryHeading}>
                      Услуги
                    </p>
                    <div className={s.summaryServices}>
                      {
                        services && services.map((service) => {
                          return (
                            <div key={service.id} className={s.summaryServiceWrapper}>
                              <p className={s.summaryServicePrice}>{service.price} ₽</p>
                              <p className={s.summaryServiceName}>
                                {service.name}
                                <span
                                  className={s.summaryServiceDuration}> {service.duration} минут</span>
                              </p>
                            </div>
                          )
                        })
                      }
                    </div>
                    <p className={s.summaryTotalWrapper}>
                      <p>Итого</p>
                      <p>{services.reduce((accum, item) => accum + item.price, 0)} ₽</p>
                    </p>
                  </div>
                </div>
              </div>


            </div>
            <a href='https://www.zoostyle.com' className={s.zoostyleFootnoteWrapper}>
              <p className={s.zoostyleFootnote}>Работает на</p>
              <Logo/>
            </a>
          </div>
          <div className={`${s.selectedServices} ${isValid && ((polisOMS && formValues?.polisOMSnumber?.length >= 4) || (!polisOMS)) ? s.showSelectedServices : ''}`}>

            <a className={s.nextStepButton}
               onClick={handleSubmit(handleRecord)}
            >Записаться</a>
          </div>
        </SimpleBar>
      </div>
    </div>
  )
})

export default WidgetSummary;
