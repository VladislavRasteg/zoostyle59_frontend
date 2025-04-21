import {TitledBlock} from "@/shared/TitledBlock"
import s from "./OnlineBookingBlock.module.scss"
import React, {useContext, useEffect, useState} from "react"
import {Context} from "@/index"
import {ITenant} from "@/interfaces/interfaces"
import {getServices, getTenant, getWidgetStatistics} from "@/http/widgetAPI"
import {toast} from "react-toastify"
import {updateTenantAppointmentStep, updateTenantBanner} from "@/http/tenantAPI"
import {Button} from "@/shared/Button"
import {ImageUploader} from "@/shared/ImageUploader"
import {Reveal} from "@/shared/Reveal"
import {ru} from 'date-fns/locale';
import {format} from "date-fns"
import {LineChart} from "@/shared/Charts/LineChart"
import {formatDate} from "@/utils/date";
import {MenuItem, Select} from "@/shared/Select";
import {onlineAppointmentTimeStep} from "@/utils/formDicts";
import {Title} from "@/shared/Title";

export const OnlineBookingBlock = () => {

  const {user} = useContext(Context)
  const [tenant, setTenant] = useState<ITenant>()

  const [isWidgetError, setIsWidgetError] = useState(false)
  const [statisticsData, setStatisticsData] = useState<{
    search_date: string;
    records: number;
  }[]>([])

  const [companyBanner, setCompanyBanner] = useState<File | undefined>(undefined)
  const [companyBannerLink, setCompanyBannerLink] = useState<string>('')
  const [companyBannerName, setCompanyBannerName] = useState<string>('')

  const [appointmentStepMinutes, setAppointmentStepMinutes] = useState<number>(30)

  const month_name = format(new Date(), 'LLLL', {locale: ru})

  useEffect(() => {
    document.title = 'Онлайн-запись';
    getTenant(user.currentBranch?.tenantId).then((data: ITenant) => {
      setTenant(data)
      setAppointmentStepMinutes(data.appointmentStepMinutes)
      setCompanyBannerName(data.bannerName)
      data?.bannerUrl
        ? setCompanyBannerLink(`${process.env.PUBLIC_S3_BUCKET_URL}${data?.bannerUrl}`)
        : setCompanyBannerLink('')

      getServices(data.id, user.currentBranch?.id).catch(e => {
        setIsWidgetError(true)
      })
    })
    getWidgetStatistics(user.currentBranch?.id).then((data: any) => {
      setStatisticsData(data)
    })
  }, []);


  const copyCodeHandler = () => {
    if (tenant) {
      navigator.clipboard.writeText(`<script type="text/javascript" src="https://api.zoostyle.com/api/widget/getCode/${tenant?.id}" charset="UTF-8"></script>`);
      toast.success("Код виджета скопирован")
    }
  }

  const copyLinkHandler = () => {
    if (tenant) {
      navigator.clipboard.writeText(`https://app.zoostyle.com/widget/${tenant?.id}`);
      toast.success("Ссылка скопирована")
    }
  }

  const editTenantAppointmentStep = async (value: number) => {
    updateTenantAppointmentStep(value)
      .then(() => {
        setAppointmentStepMinutes(value)
        toast.success("Шаг записи успешно обновлён")
      })
      .catch(() => {
        toast.error("Ошибка при обновлении шага записи")
      })
  }

  const updateImage = (files: File[] | null) => {
    setCompanyBannerLink('')
    setCompanyBannerName('')
    if (files?.length) {
      setCompanyBanner(files[0])
      updateTenantBanner(files[0])
        .then(() => {
          toast.success("Баннер успешно загружен")
        })
        .catch(() => {
          toast.error("Ошибка при загрузке баннера")
        })
    } else {
      setCompanyBanner(undefined)
      updateTenantBanner(null)
        .then(() => {
          toast.success("Баннер успешно удален")
        })
        .catch(() => {
          toast.error("Ошибка при удалении баннера")
        })
      setCompanyBannerLink('')
      setCompanyBannerName('')
    }
  }


  return (
    <div className={`${s.vertical_container} ${s.main_container}`}>
      {
        isWidgetError &&
          <Reveal duration={0.8} delay={0.1}>
              <TitledBlock className={s.error} title="Онлайн-запись пока не работает"
                           description="Сначала нужно создать специалиста и прикрепить к нему услугу"/>
          </Reveal>
      }
      <div className={s.horizontal_container}>
        <div className={s.vertical_container}>
          <Reveal duration={0.8} delay={0.2}>
            <TitledBlock title="Виджет на сайт" description="Код виджета для установки на сайт">
              <div className={s.booking_code_wrapper}>
                                <pre className={s.booking_code}>
                                    <span>{`<script`}</span><br/>
                                    <span>&nbsp;&nbsp;{`type="text/javascript"`}</span><br/>
                                  {tenant &&
                                      <span>&nbsp;&nbsp;{`src="https://api.zoostyle.com/api/widget/getCode/${tenant.id}"`}</span>}
                                  <br/>
                                    <span>&nbsp;&nbsp;{`charset="UTF-8">`}</span><br/>
                                    <span>{`</script>`}</span><br/>
                                </pre>
                <p className={s.code_description}>
                  Добавьте код виджета в HTML-код всех страниц сайта. Установите код на вашем сайте как можно ближе к
                  закрывающему тегу &lt;/body&gt;
                </p>
              </div>
              <Button fullWidth onClick={copyCodeHandler}>Скопировать</Button>
            </TitledBlock>
          </Reveal>

          <Reveal duration={0.8} delay={0.4}>
            <TitledBlock title="Баннер для виджета" description="Ваш уникальный дизайн">
              <ImageUploader
                uploadFilesHandler={updateImage}
                filename={companyBannerName || companyBanner?.name}
                imageLink={companyBannerLink || companyBanner}
              />
            </TitledBlock>
          </Reveal>
          <br/>
        </div>
        <div className={s.vertical_container}>
          <Reveal duration={0.8} delay={0.3}>
            <TitledBlock title="Ссылка онлайн-записи" description="Удобно делиться в социальных сетях">
              <div className={s.booking_code}>
                <a className={s.link}>
                  {`https://app.zoostyle.com/widget/${tenant?.id}`}
                </a>
              </div>
              <Button fullWidth onClick={copyLinkHandler}>Скопировать</Button>
            </TitledBlock>
          </Reveal>

          <Reveal duration={0.8} delay={0.5}>
            <TitledBlock title="Дополнительные настройки" description="Чтобы всем было удобно">
              <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
                <Title title="Шаг записи" />
                <Select
                  value={appointmentStepMinutes || 30}
                  onChange={(e: any) => editTenantAppointmentStep(e.target.value)}
                >
                  {onlineAppointmentTimeStep?.map(time =>
                    <MenuItem value={time?.value}>{time.label}</MenuItem>
                  )}
                </Select>
              </div>
            </TitledBlock>
          </Reveal>

          <Reveal duration={0.8} delay={0.6}>
            <TitledBlock title="Статистика записей" description="Записи через виджет за 30 дней">
              {statisticsData ?
                <LineChart chartData={statisticsData} XDataKey="search_date"
                           XThicFormatter={(date: string) => formatDate(date, 'DD.MM')} LineDataKey="records"/>
                :
                <p>Записей пока нет</p>
              }
            </TitledBlock>
          </Reveal>

        </div>
      </div>
    </div>
  )
}