import React, {useState, useContext, useEffect} from "react";
import s from "../Widget.module.scss"
import {ReactComponent as Logo} from '../assets/logo.svg'
import {ReactComponent as SquareLogo} from "@/assets/Logo150.svg"
import {ReactComponent as Employee} from '../assets/employee.svg'
import {ReactComponent as Plus} from '../assets/plus.svg'
import {ReactComponent as LeftArrow} from '../assets/left_arrow.svg'
import {ReactComponent as Selected} from '../assets/selected.svg'
import {observer} from "mobx-react-lite";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {Context} from "../../../index";
import {getServices} from "../../../http/widgetAPI";
import {Notification} from "@arco-design/web-react";
import SimpleBar from "simplebar-react";
import "./Simplebar.scss"
import {IGroup, IService, ITenant} from "@/interfaces/interfaces";
import { Typography } from "@/shared/Typography";

interface IBranch {
  id: number,
  name: string,
  city: string,
  street: string,
  lat: number,
  lon: number
}

const SelectServices = observer(() => {

  const navigate = useNavigate()
  const {widget} = useContext(Context)
  const {id} = useParams()

  const [branch, setBranch] = useState<IBranch>({id: 0, name: '', city: '', street: '', lat: 0, lon: 0})
  const [services, setServices] = useState(Array<IService>)
  const [groups, setGroups] = useState(Array<IGroup>)
  const [tenant, setTenant] = useState<ITenant>()

  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedServices, setSelectedServices] = useState(Array<IService>)
  const [selectedDoctors, setSelectedDoctors] = useState(Array<number>)

  useEffect(() => {
    getServices(Number(id), Number(searchParams.get("branchId"))).then((data: any) => {
      document.title = data.tenant.name + ' | Онлайн-запись';
      setBranch(data.branch)
      setTenant(data.tenant)
      setServices(data.services.ungroupedServices)
      setGroups(data.services.groups)
    }).catch((e) => {
      return (Notification.error({
        title: 'Ошибка',
        content: e.response.data.message,
      }))
    })
  }, [])

  services.map((service: IService) => {
    service.doctors = service.doctorProcedures.map(({doctorId}: any) => doctorId)
  })

  groups.map((group) => {
    group.procedures.map((service: IService) => {
      service.doctors = service.doctorProcedures.map(({doctorId}: any) => doctorId)
    })
  })

  const intersect = (first: Array<number> = [], ...rest: any) => {
    rest = rest.map((array: any) => new Set(array))
    return first.filter(e => rest.every((set: any) => set.has(e)))
  }

  const selectServiceHandler = (service: IService) => {

    let selectedServicesCopy = selectedServices

    if (selectedServices.findIndex(x => x.id === service.id) === -1) {
      selectedServicesCopy = selectedServices.concat(service)
      setSelectedServices(selectedServicesCopy)
      service.selected = true;
    } else {
      const index = selectedServices.indexOf(service);
      selectedServicesCopy = selectedServices.slice(0, index).concat(selectedServices.slice(index + 1))
      setSelectedServices(selectedServicesCopy)
      service.selected = false;
    }

    const servicesSelectedDoctors = selectedServicesCopy.map(({doctors}) => doctors)
    const selectedDoctorsTemp = intersect(...servicesSelectedDoctors)
    setSelectedDoctors(selectedDoctorsTemp)
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
                <a className={s.back_arrow} onClick={() => navigate(`/widget/${tenant?.id}`)}><LeftArrow/></a>
                <p className={s.text}>Выбор услгуги</p>
              </div>
              {
                (groups && groups.length > 0) &&
                <div className={s.group_selector}>
                  {
                    groups.map((group) => 
                      <a className={s.group_link} href={`#group_${group.id}`}>
                        <Typography variant="h3" className={s.group_name}>{group.name}</Typography>
                      </a>
                    )
                  }
                </div>
              }
              <div className={`${s.servicesList} ${selectedServices.length ? s.servicesListShorter : ''}`}>
              {
                  groups.map((group) => {
                    return(
                      <div id={`group_${group.id}`} className={s.group_wrapper}>
                        <div className={s.group_info}>
                          <Typography variant="h2">{group.name}</Typography>
                        </div>
                        {
                          group.procedures.map((service) => {
                            const intersect = selectedDoctors.filter(x => service.doctors.indexOf(x) !== -1)
                            return (
                              <div
                                className={`${s.service} ${service.selected ? s.selectedService : ""} ${selectedServices.length && !intersect.length ? s.disabledService : ""}`}
                                onClick={() => selectedServices.length && !intersect.length ? {} : selectServiceHandler(service)}
                              >
                                <div className={s.serviceContent}>
                                  <p className={s.serviceName}>
                                    {service.name}
                                    &nbsp;<span className={s.serviceDuration}>{service.duration} минут</span>
                                  </p>
                                  <p className={s.servicePrice}>{service.price} ₽</p>
                                </div>
                                <div className={s.serviceSelectButton}>
                                  <div className={s.iconWrapper}>
                                    <Plus className={s.servicePlusIcon}/>
                                    <Selected className={s.serviceSelectedIcon}/>
                                  </div>
                                </div>
                              </div>
                            )
                          })
                        }
                        
                      </div>  
                    )
                  })
                }
                <div className={s.group_wrapper}>
                  {
                    services.map((service) => {
                      const intersect = selectedDoctors.filter(x => service.doctors.indexOf(x) !== -1)
                      return (
                        <div
                          className={`${s.service} ${service.selected ? s.selectedService : ""} ${selectedServices.length && !intersect.length ? s.disabledService : ""}`}
                          onClick={() => selectedServices.length && !intersect.length ? {} : selectServiceHandler(service)}
                        >
                          <div className={s.serviceContent}>
                            <p className={s.serviceName}>
                              {service.name}
                              &nbsp;<span className={s.serviceDuration}>{service.duration} минут</span>
                            </p>
                            <p className={s.servicePrice}>{service.price} ₽</p>
                          </div>
                          <div className={s.serviceSelectButton}>
                            <div className={s.iconWrapper}>
                              <Plus className={s.servicePlusIcon}/>
                              <Selected className={s.serviceSelectedIcon}/>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            </div>
            <a href='https://www.zoostyle.com' className={s.zoostyleFootnoteWrapper}>
              <p className={s.zoostyleFootnote}>Работает на</p>
              <Logo/>
            </a>
          </div>
          {
            !!selectedServices.length &&
              <div className={`${s.selectedServices} ${selectedServices.length ? s.showSelectedServices : ''}`}>
                  <div className={s.selectedServicesInfo}>
                      <p>{selectedServices.length} услуг{selectedServices.length === 1 ? "а " : selectedServices.length === 2 || selectedServices.length === 3 || selectedServices.length === 4 ? 'и ' : ''}
                          <span>{selectedServices.reduce((accum, item) => accum + item.duration, 0)} минут</span></p>
                      <p>{selectedServices.reduce((accum, item) => accum + item.price, 0)} ₽</p>
                  </div>
                  <a className={s.nextStepButton}
                     onClick={() => navigate(`/widget/employees/${tenant?.id}?branchId=${branch.id}&services=${selectedServices.map(({id}: any) => id)}`)}
                  ><Employee className={s.calendarIcon}/>&nbsp;&nbsp;Выбрать специалиста</a>
              </div>
          }
        </SimpleBar>
      </div>
    </div>
  )
})

export default SelectServices;
