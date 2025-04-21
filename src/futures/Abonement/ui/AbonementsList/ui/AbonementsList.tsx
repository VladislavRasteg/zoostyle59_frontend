import { useContext, useEffect, useState } from "react"
import s from "./AbonementsList.module.scss"
import { Context } from "@/index"
import { classNames } from "@/shared/lib/classNames/classNames"
import { abonementStatus, IAbonement } from "@/futures/Abonement/models"
import { fetchAbonements } from "@/http/abonementsAPI"
import Pages from "@/components/Pages/Pages"
import {observer} from "mobx-react-lite";
import { numberWithSpaces } from "@/utils/numberWithSpaces"
import { format } from "date-fns"
import { ru } from "date-fns/locale"

export const AbonementsList = observer(() => {
    const {abonements, user} = useContext(Context)
    const [isMobile, setIsMobile] = useState(false)
    const [selectedAbonement, setSelectedAbonement] = useState<IAbonement>()
    const [show, setShow] = useState(false)

    const [isEdited, setIsEdited] = useState(false)

    useEffect(() => {
        if(window.innerWidth < 500){
            setIsMobile(true)
        }
        fetchAbonements(abonements.page, 20, user.currentBranch?.id)
        .then((data: any) => {
            abonements.setAbonements(data.data.rows)
            abonements.setTotalCount(data.data.count)            
        })
    }, [isEdited]);

    const handleShowEdit = (abonement: IAbonement) => {
        setSelectedAbonement(abonement)
        setShow(true)
    }

    const handleClose = () => {
        setSelectedAbonement(undefined)
        setShow(false)
        setIsEdited(!isEdited)
    }

    return(
        <div className={s.table_buttons_wrapper}>
                <div className={s.table_wrapper}>
                    <div>
                        <div className={s.table}>
                            <table>
                                <thead>
                                    <tr className={s.trh}>
                                        <th className={s.tdh}>Клиент</th>
                                        <th className={s.tdh}>Название</th>
                                        <th className={s.tdh}>Стоиомсть</th>
                                        <th className={s.tdh}>Посещения</th>
                                        <th className={s.tdh}>Дата сгорания</th>
                                        <th className={s.tdh}>Статус</th>
                                        <th className={s.tdh}>Выдан</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {!!abonements.abonements.length && abonements.abonements.map((abonement: IAbonement) =>
                                    <tr className={s.trb} onClick={() => handleShowEdit(abonement)}
                                        key={abonement.id}>
                                        <td className={s.tdb}>{abonement.client.first_name} {abonement.client.surname}</td>
                                        <td className={s.tdb}>{abonement.name}</td>
                                        <td className={s.tdb}>{numberWithSpaces(abonement.price)} ₽</td>
                                        <td className={s.tdb}>{abonement.visits} / {abonement.visitsLimit || "∞"}</td>
                                        <td className={s.tdb}>{abonement.expirationDate ? format(abonement.expirationDate, 'dd.MM.yyyy HH:mm', { locale: ru }) : "∞"}</td>
                                        <td className={classNames(s.tdb, {}, [s[abonement.status]])}>{abonementStatus[abonement.status]}</td>
                                        <td className={s.tdb}>{format(abonement.createdAt, 'dd.MM.yyyy HH:mm', { locale: ru })}</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <Pages state={abonements}/>
                </div>
            </div>
    )
})