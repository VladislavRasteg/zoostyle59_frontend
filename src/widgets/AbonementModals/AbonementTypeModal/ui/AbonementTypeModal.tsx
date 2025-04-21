import Modal from "@/components/Modal/Modal"
import ModalContent from "@/components/Modal/ModalContent"
import ModalFooter from "@/components/Modal/ModalFooter"
import {Button} from "@/shared/Button"
import s from './AbonementTypeModal.module.scss'
import {useContext, useEffect, useState} from "react"
import {Title} from "@/shared/Title"
import {Input} from "@/shared/Input"
import {Context} from "@/index"
import {toast} from "react-toastify"
import { IAbonementType } from "@/futures/Abonement/models"
import { createAbonementType, deleteAbonementType, updateAbonementType } from "@/http/abonementsAPI"
import { Checkbox } from "@arco-design/web-react";
import { listProcedures } from "@/http/proceduresAPI"
import Multiselect from "@/shared/Multiselect/Multiselect"
import { IService } from "@/interfaces/interfaces"

interface IModalProps {
  show: boolean
  onClose: () => void
  abonement?: IAbonementType
}

export const AbonementTypeModal = ({show, onClose, abonement}: IModalProps) => {

  const [showConfirmation, setShowConfirmation] = useState(false)

  const [name, setName] = useState(abonement?.name || "");
  const [price, setPrice] = useState(abonement?.price ? abonement.price.toString() : "");
  const [isVisitsLimit, setIsVisitsLimit] = useState(!!abonement?.visitsLimit);
  const [visitsLimit, setVisitsLimit] = useState(abonement?.visitsLimit);
  const [isDaysLimit, setIsDaysLimit] = useState(!!abonement?.daysLimit);
  const [daysLimit, setDaysLimit] = useState(abonement?.daysLimit);
  const [isWidgetBuy, setIsWidgetBuy] = useState(abonement?.isWidgetBuy || false);
  
  const [services, setServices] = useState<IService[]>();
  const [selectedServices, setSelectedServices] = useState<IService[] | undefined>();

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 500)

  const {user} = useContext(Context)

  useEffect(() => {
    listProcedures(1, 999, user.currentBranch?.id).then((data: any) => {
      setServices(data.data.rows)
    })
    if(abonement?.abonementTypeProcedures){
      setSelectedServices(abonement.abonementTypeProcedures.map((rp) => rp.procedure))
    }
    
  }, [])

  const deleteAbonementHandler = () => {
    if(abonement && abonement.id){
      deleteAbonementType(abonement.id)
      .then(() => {
        toast.success('Абонемент удален')
        onClose()
      })
      .catch(e => {
        toast.error(e.message)
      })
    } else {
      toast.error('Не передан идентификатор абонемента')
    }
    
  }

  const createAbonementHandler = () => {
    if (name && price && (visitsLimit || daysLimit) && selectedServices && selectedServices.length > 0) {
      createAbonementType(name, Number(price), isVisitsLimit ? visitsLimit : undefined, isDaysLimit ? daysLimit : undefined, isWidgetBuy, selectedServices, user.currentBranch?.id)
      .then((data: any) => {
        toast.success('Абонемент добавлен')
        onClose()
      })
      .catch(e => {
        toast.error(e.message)
      })
    } else {
      toast.error('Заполните обязательные поля')
    }
  }

  const updateAbonementHandler = () => {
    if (abonement && abonement.id && name && price && (visitsLimit || daysLimit) && selectedServices && selectedServices.length > 0) {
      updateAbonementType(abonement.id, name, Number(price), isVisitsLimit ? visitsLimit : undefined, isDaysLimit ? daysLimit : undefined, isWidgetBuy, selectedServices, user.currentBranch?.id)
      .then((data: any) => {
        toast.success('Абонемент обновлен')
        onClose()
      })
      .catch(e => {
        toast.error(e.message)
      })
    } else {
      toast.error('Заполните обязательные поля')
    }
  }

  return (
    <Modal show={show}
           name={abonement ? "Редактирование абонемента" : "Создание абонемента"}
           onClose={onClose}
           onDelete={() => setShowConfirmation(true)} allowDelete={abonement && user.isAdmin}
           >
      <Modal show={showConfirmation} onClose={() => setShowConfirmation(false)} name="Подтверждение">
        <ModalContent height="110px">
          <p className={s.confirmation_text}>Вы уверены, что хотите удалить тип абонемента?</p>
        </ModalContent>
        <ModalFooter>
          <Button theme="border" size="big" onClick={() => setShowConfirmation(false)} fullWidth>Отменить</Button>
          <Button fullWidth size="big" theme="dangerous" onClick={() => deleteAbonementHandler()}>Удалить</Button>
        </ModalFooter>
      </Modal>
      <ModalContent height={"422px"} width={isMobile ? "100%" : "544px"}>
        <div className={s.modal_body}>
          <div className={s.appointment_wrapper}>
            <div className={s.input_group}>
              <Title title="Название" required/>
              <Input placeholder="Название" offAutoComplite value={name} onChange={setName}/>
            </div>
            <div className={s.input_group}>
              <Title title="Стоимость" required/>
              <Input placeholder="Стоимость" offAutoComplite type="number" value={price} onChange={setPrice}/>
            </div>
            <div className={s.input_group}>
              <Title title="Услуги" required/>
              <Multiselect
                placeholder={"Выберите услуги"}
                displayValue={"name"}
                onRemove={(event) => {
                  setSelectedServices(event)
                }}
                onSelect={(event) => {
                  setSelectedServices(event)
                }}
                options={services || []}
                selectedValues={selectedServices || []}
                matchValue={"id"}
                secondaryDisplayValue={"duration"}
                secondaryDisplayValueName={"минут"}
                mobileHeading="Выбор услуг"
              />
              <p className={s.services_total}>Выберите услги, включенныне в абонемент</p>
            </div>
            <div className={s.input_group}>
              <div className={s.checked_input}>
                <Checkbox checked={isVisitsLimit} className={s.checkbox} onChange={() => setIsVisitsLimit(!isVisitsLimit)} />
                <Title title="Ограничение по количеству посещений"/>
              </div>
              {isVisitsLimit && <Input placeholder="Количество посещений" offAutoComplite type="number" disabled={!isVisitsLimit} value={visitsLimit} onChange={setVisitsLimit}/>}
            </div>
            <div className={s.input_group}>
              <div className={s.checked_input}>
                <Checkbox checked={isDaysLimit} className={s.checkbox} onChange={() => setIsDaysLimit(!isDaysLimit)} />
                <Title title="Ограничение по дням"/>
              </div>
              {isDaysLimit && <Input placeholder="Ограничение по дням" offAutoComplite type="number" disabled={!isDaysLimit} value={daysLimit} onChange={setDaysLimit}/>}
            </div>
            <div className={s.checked_input}>
                <Checkbox checked={isWidgetBuy} className={s.checkbox} onChange={() => setIsWidgetBuy(!isWidgetBuy)} />
                <Title title="Покупка через виджет"/>
            </div>
          </div>
        </div>
      </ModalContent>
      <ModalFooter>
        <Button theme="border" size="big" onClick={() => onClose()} fullWidth>Закрыть</Button>
        {!abonement && <Button 
            disabled={!name || !price || (!isVisitsLimit && !isDaysLimit) || (!visitsLimit && !daysLimit) || (isVisitsLimit && !visitsLimit) || (isDaysLimit && !daysLimit)} 
            fullWidth 
            size="big" 
            onClick={() => createAbonementHandler()}
        >
            Создать
        </Button>}
        {abonement && user.isAdmin && <Button fullWidth size="big" onClick={() => {
          updateAbonementHandler()
        }}>Сохранить</Button>}
      </ModalFooter>
    </Modal>
  )
}