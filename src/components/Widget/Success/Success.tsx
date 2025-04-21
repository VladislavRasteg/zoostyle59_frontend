import React, {useState, useEffect} from "react";
import s from "../Widget.module.scss"
import {ReactComponent as Logo} from '../assets/logo.svg'
import {ReactComponent as SquareLogo} from "@/assets/Logo150.svg"
import {observer} from "mobx-react-lite";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {createRecord, getRecord, getSummary} from "../../../http/widgetAPI";
import {Notification} from "@arco-design/web-react";
import SimpleBar from "simplebar-react";
import 'simplebar-react/dist/simplebar.min.css';
import SuccessVideo from '../assets/success.mp4';
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

const Success = observer(() => {

  const navigate = useNavigate()
  const {id} = useParams()

  const [branch, setBranch] = useState<IBranch>({id: 0, name: '', city: '', street: '', lat: 0, lon: 0})
  const [tenant, setTenant] = useState<ITenant>()
  const [services, setServices] = useState(Array<IService>)
  const [dateString, setDateString] = useState('')
  const [employee, setEmployee] = useState<IEmployee>({
    id: 0,
    first_name: '',
    surname: '',
    middle_name: '',
    position: {name: ''}
  })
  const [reception, setReception] = useState({date: '', time: '', endTime: ''})

  const [searchParams, setSearchParams] = useSearchParams()
  const branchId = searchParams.get("branchId")

  useEffect(() => {

    getRecord(id, branchId)
      .then((data: any) => {
        document.title = data.tenant.name + ' | Вы записаны!';
        setBranch(data.branch)
        setTenant(data.tenant)
        setReception(data.reception)
        setDateString(data.dateString)
        const receptionProcedures = data.reception.receptionProcedures
        setServices(receptionProcedures.map((rp: any) => rp.procedure))
        setEmployee(data.reception.doctor)
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
          <div className={s.branchInfo} style={{padding: '12px 32px 0'}}>
            <p className={s.summaryBranchName}>{branch.name}</p>
            <p className={s.branchAddress}>{branch.city}, {branch.street}</p>
          </div>
          <div className={s.summaryWidgetContent}>
            <div className={s.section}>
              <div className={s.summaryList}>
                <div className={s.successBlockWrapper}>
                  <div className={s.successBlock}>
                    <video width="140" height="140" autoPlay playsInline muted>
                      <source src={SuccessVideo} type="video/mp4"/>
                    </video>
                    <p className={s.successText}>Вы записаны</p>
                  </div>
                  <Button fullWidth onClick={() => navigate("/widget/" + tenant?.id)}>Записаться еще</Button>
                </div>
                <div className={s.detailsList}>
                  <div className={s.summaryDetailLight}>
                    <p className={s.summaryHeading}>
                      {employee.position && employee.position.name}
                    </p>
                    <p className={s.employeeName}>
                      {employee.surname} {employee.first_name} {employee.middle_name}
                    </p>
                  </div>
                  <div className={s.summaryDetailLight}>
                    <p className={s.summaryHeading}>
                      Дата и время
                    </p>
                    <p className={s.employeeName}>
                      {dateString}<span>, {reception.time.slice(0, 5)} - {reception.endTime.slice(0, 5)}</span>
                    </p>
                  </div>
                  <div className={s.summaryDetailLight}>
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
                                <span className={s.summaryServiceDuration}> {service.duration} минут</span>
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
        </SimpleBar>
      </div>
    </div>
  )
})

export default Success;
