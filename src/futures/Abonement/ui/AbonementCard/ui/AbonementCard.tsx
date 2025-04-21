import { useState } from "react"
import s from "./AbonementCard.module.scss"
import { abonementStatus, IAbonement } from "@/futures/Abonement/models"
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { numberWithSpaces } from "@/utils/numberWithSpaces";
import { Button } from "@/shared/Button";
import {ReactComponent as EditIcon} from "../assets/edit_24px.svg"
import { AbonementModal } from "@/widgets/AbonementModals/AbonementModal";
import { classNames } from "@/shared/lib/classNames/classNames";

interface IAbonementCardProps{
    abonement: IAbonement
    updateHandler?: () => void
    className?: string;
}

export const AbonementCard = ({abonement, updateHandler, className}: IAbonementCardProps) => {

    const [show, setShow] = useState(false)
    const [showNew, setShowNew] = useState(false)

    const handleShowEdit = () => {
        setShow(true)
    }

    const handleCloseEdit = () => {
        setShow(false)
        updateHandler && updateHandler()
    }

    const handleCloseNew = () => {
        setShowNew(false)
        updateHandler && updateHandler()
    }

    return(
        <div className={classNames(s.abonement_card, {}, [className as string, s[abonement.status]])}>
            {show && <AbonementModal show={show} onClose={() => handleCloseEdit()} abonement={abonement} />}
            {showNew && <AbonementModal show={showNew} onClose={() => handleCloseNew()} clientId={abonement.clientId} />}
            <Button theme="secondary" iconOnly className={s.edit} size="small" onClick={() => handleShowEdit()}><EditIcon /></Button>
            <div className={s.abonement_info}>
                <div className={s.name_status}>
                    <p className={s.name}>{abonement.name}</p> 
                    <p className={classNames(s.status_chip, {}, [s[abonement.status]])}>{abonementStatus[abonement.status]}</p>
                </div>
                <p className={s.info}>Стоимость: {numberWithSpaces(abonement.price)} ₽</p>
                <p className={s.info}>Лимит поcещений: {abonement.visitsLimit || "безлимит"}</p>
                <p className={s.info}>Посещения: {abonement.visits}</p>
                {abonement.visitsLimit && <p className={s.info}>Осталось посещений: {abonement.visitsLimit - abonement.visits}</p>}
                <p className={s.info}>Дата выдачи: {abonement.createdAt ? format(abonement.createdAt, 'd MMMM yyyy, HH:mm', { locale: ru }) : "безлимит"}</p>
                <p className={s.info}>Дата сгорания: {abonement.expirationDate ? format(abonement.expirationDate, 'd MMMM yyyy, HH:mm', { locale: ru }) : "безлимит"}</p>
            </div>
            {
                abonement.status != "active" &&
                <Button theme="secondary" fullWidth onClick={() => setShowNew(true)}>Выдать новый абонемент</Button>
            }
        </div>
    )
}