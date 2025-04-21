import React, {useState, useContext, useEffect} from "react";
import s from "./Widget.module.scss"
import {ReactComponent as Logo} from "./assets/logo.svg"
import {ReactComponent as SquareLogo} from "@/assets/Logo150.svg"
import {observer} from "mobx-react-lite";
import {useNavigate, useParams} from "react-router-dom";
import {Context} from "../../index";
import {getBranches} from "../../http/widgetAPI";
import {Notification} from "@arco-design/web-react";
import {YMaps, Map, Placemark} from '@pbe/react-yandex-maps';
import SimpleBar from "simplebar-react";
import "./Simplebar.scss"
import {ITenant} from "@/interfaces/interfaces";

interface IBranch {
  id: number,
  name: string,
  city: string,
  street: string,
  lat: number,
  lon: number,
  mapImgUrl: string | null
}

interface IService {
  id: number,
  name: string,
  duration: number,
  price: number
}

const Widget = observer(() => {

  const navigate = useNavigate()
  const {widget} = useContext(Context)
  const {id} = useParams()

  const [branches, setBranches] = useState(Array<IBranch>)
  const [services, setServices] = useState(Array<IService>)
  const [tenant, setTenant] = useState<ITenant>()

  useEffect(() => {
    getBranches(Number(id)).then((data: any) => {
      if (data.branches.length === 1) {
        navigate(`/widget/services/${data.tenant.id}?branchId=${data.branches[0].id}`)
      }
      document.title = data.tenant.name + ' | Онлайн-запись';
      setBranches(data.branches)
      setTenant(data.tenant)
      console.log(data)
      if (data.branches.length === 1) {
        setServices(data.services)
      }
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
              <img className={tenant?.bannerUrl ? s.logo : s.logoNoBanner} src={`${process.env.PUBLIC_S3_BUCKET_URL}${tenant?.imageUrl}`}
                   alt='Логотип'></img>
              :
              <div className={tenant?.bannerUrl ? s.logo : s.logoNoBanner}>
                <SquareLogo />
              </div>
            }
          </div>
          <div className={s.branchInfo} style={{padding: '12px 32px 0'}}>
            <p className={s.branchName}>Выберите филиал</p>
            <p className={s.branchName}>«{tenant?.name}»</p>
          </div>
          <div className={s.widgetContent}>
            <div className={s.section}>
              <div className={s.branchList}>
                {branches.map(branch =>
                  <div
                    className={s.branch}
                    onClick={() => navigate(`/widget/services/${tenant?.id}?branchId=${branch.id}`)}
                    key={branch.id}
                  >
                    <div className={s.mapWrapper}>
                      {
                        branch.mapImgUrl ?
                        <img src={`${branch.mapImgUrl.slice(0,4) != "http" ? process.env.PUBLIC_S3_BUCKET_URL : ""}${branch.mapImgUrl}`} alt='Карта' className={s.map_image}/>
                        :
                        <YMaps>
                          <Map
                            width={"100%"}
                            height={200}
                            instanceRef={ref => {
                              ref && ref.behaviors.disable('scrollZoom');
                              ref && ref.behaviors.disable('drag');
                            }}
                            state={{
                              center: [branch.lat, branch.lon],
                              zoom: 16,
                              behaviors: ["default", "scrollZoom"]
                            }}
                          >
                            <Placemark geometry={[branch.lat, branch.lon]}/>
                          </Map>
                        </YMaps>
                      }
                      
                    </div>
                    <div className={s.branchDescription}>
                      <p className={s.branchListName}>{branch.name}</p>
                      <p className={s.branchAddress}>{branch.city}, {branch.street}</p>
                    </div>
                  </div>
                )}
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

export default Widget;
