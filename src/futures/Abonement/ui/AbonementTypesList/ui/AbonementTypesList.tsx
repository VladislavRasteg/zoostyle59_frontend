import { useContext, useEffect, useState } from "react"
import s from "./AbonementTypesList.module.scss"
import { Context } from "@/index"
import { classNames } from "@/shared/lib/classNames/classNames"
import { Button } from "@/shared/Button"
import { IAbonementType } from "@/futures/Abonement/models"
import { fetchAbonementTypes } from "@/http/abonementsAPI"
import Pages from "@/components/Pages/Pages"
import { getPluralNoun } from "@/utils/getPluralNoun"
import { AbonementTypeModal } from "@/widgets/AbonementModals/AbonementTypeModal"
import {observer} from "mobx-react-lite";

export const AbonementTypesList = observer(() => {
    const {abonementTypes, user} = useContext(Context)
    const [isMobile, setIsMobile] = useState(false)
    const [selectedAbonement, setSelectedAbonement] = useState<IAbonementType>()
    const [show, setShow] = useState(false)

    const [isEdited, setIsEdited] = useState(false)

    useEffect(() => {
        if(window.innerWidth < 500){
            setIsMobile(true)
        }
        fetchAbonementTypes(abonementTypes.page, 20, user.currentBranch?.id)
        .then((data: any) => {
            abonementTypes.setAbonements(data.data.rows)
            abonementTypes.setTotalCount(data.data.count)            
        })
    }, [isEdited]);

    const handleShowEdit = (abonement: IAbonementType) => {
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
                {show && <AbonementTypeModal show={show} onClose={handleClose} abonement={selectedAbonement}  />}
                <div className={classNames(s.buttonsWrapper, {}, [isMobile ? s.right : ''])}>
                    {user.isAdmin && <Button onClick={() => setShow(true)}>Новый тип абонемента</Button>}
                </div>
                <div className={s.table_wrapper}>
                    <div>
                        <div className={s.table}>
                            <table>
                                <thead>
                                    <tr className={s.trh}>
                                        <th className={s.tdh}>Название</th>
                                        <th className={s.tdh}>Стоимость</th>
                                        <th className={s.tdh}>Лимит посещений</th>
                                        <th className={s.tdh}>Срок сгорания</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {!!abonementTypes.abonements.length && abonementTypes.abonements.map((abonement: IAbonementType) =>
                                    <tr className={s.trb} onClick={() => handleShowEdit(abonement)}
                                        key={abonement.id}>
                                        <td className={s.tdb}>{abonement.name}</td>
                                        <td className={s.tdb}>{abonement.price} ₽</td>
                                        <td className={s.tdb}>{abonement.visitsLimit} {!!abonement.visitsLimit ? getPluralNoun(abonement.visitsLimit, ["раз", "раза", "раз"]) : "Безлимит"} </td>
                                        <td className={s.tdb}>{abonement.daysLimit} {!!abonement.daysLimit ? getPluralNoun(abonement.daysLimit, ["день", "дня", "дней"]) : "Безлимит"}</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <Pages state={abonementTypes}/>
                </div>
            </div>
    )
})