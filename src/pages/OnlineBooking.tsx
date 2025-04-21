import React, {useContext, useEffect, useState} from 'react';
import s from './Page.module.scss'
import {motion} from "framer-motion"
import {Context} from '../index';
import {getTenant} from '../http/widgetAPI';
import {Button} from '../shared/Button';
import {Notification} from '@arco-design/web-react';
import {ReactComponent as StatisticsIcon} from "../assets/statistics.svg"
import {ImageUploader} from "@/shared/ImageUploader";
import {updateTenantBanner} from "@/http/tenantAPI";
import {ITenant} from "@/interfaces/interfaces";
import { OnlineBookingBlock } from '@/widgets/OnlineBookingBlock';

const OnlineBooking = () => {

  const {user} = useContext(Context)
  const [tenant, setTenant] = useState<ITenant>()
  const [companyBanner, setCompanyBanner] = useState<File | undefined>(undefined)

  const [companyBannerLink, setCompanyBannerLink] = useState<string>('')
  const [companyBannerName, setCompanyBannerName] = useState<string>('')

  useEffect(() => {
    document.title = 'Онлайн-запись';
    getTenant(user.currentBranch?.tenantId).then((data: ITenant) => {
      setTenant(data)
      setCompanyBannerName(data.bannerName)
      data?.bannerUrl
        ? setCompanyBannerLink(`${process.env.PUBLIC_S3_BUCKET_URL}${data?.bannerUrl}`)
        : setCompanyBannerLink('')
    })
  }, []);

  const copyHandler = () => {
    return (
      Notification.success({
        title: 'Отлично',
        content: "Вы скопировали код виджета",
      })
    )
  }

  const updateImage = (files: File[] | null) => {
    setCompanyBannerLink('')
    setCompanyBannerName('')
    if (files?.length) {
      setCompanyBanner(files[0])
      updateTenantBanner(files[0])
        .then(() => {
          return (Notification.success({
            title: 'Сообщение',
            content: 'Баннер успешно загружен',
          }))
        })
        .catch(() => {
          return (Notification.error({
            title: 'Сообщение',
            content: 'Ошибка при загрузке баннера',
          }))
        })
    } else {
      setCompanyBanner(undefined)
      updateTenantBanner(null)
        .then(() => {
          console.log(123123)
          return (Notification.success({
            title: 'Сообщение',
            content: 'Баннер успешно удален',
          }))
        })
        .catch(() => {
          return (Notification.error({
            title: 'Сообщение',
            content: 'Ошибка при удалении баннера',
          }))
        })
      setCompanyBannerLink('')
      setCompanyBannerName('')
    }
  }

  return (
    <motion.div
      initial={{opacity: 0.3}}
      animate={{opacity: 1}}
      exit={{opacity: 0.3}}
      transition={{duration: 0.4}}
      className={s.page_wrapper}
    >
      <OnlineBookingBlock />
    </motion.div>
  )
}

export default OnlineBooking;