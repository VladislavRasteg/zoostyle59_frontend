import Modal from "@/components/Modal/Modal"
import ModalContent from "@/components/Modal/ModalContent"
import ModalFooter from "@/components/Modal/ModalFooter"
import {Button} from "@/shared/Button"
import s from './AbonementModal.module.scss'
import {useContext, useEffect, useState} from "react"
import {Title} from "@/shared/Title"
import {Input} from "@/shared/Input"
import {Context} from "@/index"
import {toast} from "react-toastify"
import { IAbonement, IAbonementType } from "@/futures/Abonement/models"
import { createAbonement, deleteAbonement, deleteAbonementType, fetchAbonementTypes, updateAbonement } from "@/http/abonementsAPI"
import { Checkbox } from "@arco-design/web-react";
import { MenuItem, Select } from "@/shared/Select"
import { AbonementTypeModal } from "../../AbonementTypeModal"
import { Datepicker } from "@/shared/Datepicker"
import { add } from 'date-fns';
import { listProcedures } from "@/http/proceduresAPI"
import { IService } from "@/interfaces/interfaces"
import Multiselect from "@/shared/Multiselect/Multiselect"

interface IModalProps {
  show: boolean
  onClose: () => void
  abonement?: IAbonement
  clientId?: number
}

export const AbonementModal = ({show, onClose, abonement, clientId}: IModalProps) => {

  const {user} = useContext(Context)

  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showAbonementTypeModal, setShowAbonementTypeModal] = useState(false)

  const [abonementTypes, setAbonementTypes] = useState<IAbonementType[]>();
  const [selectedAbonementType, setSelectedAbonementType] = useState<string | undefined>();
  const [name, setName] = useState(abonement?.name || "");
  const [price, setPrice] = useState(abonement?.price || 0);
  const [visits, setVisits] = useState(abonement?.visits || 0);
  const [visitsLimit, setVisitsLimit] = useState(abonement?.visitsLimit || 0);
  const [expirationDate, setExpirationDate] = useState(abonement?.expirationDate ? new Date(abonement.expirationDate) : undefined);

  const [isVisitsLimit, setIsVisitsLimit] = useState((abonement && abonement.visitsLimit) ? true : false);
  const [isDaysLimit, setIsDaysLimit] = useState((abonement && abonement.expirationDate) ? true : false);

  const [services, setServices] = useState<IService[]>();
  const [selectedServices, setSelectedServices] = useState<IService[] | undefined>();

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 500)
  
  const [updated, setUpdated] = useState(false)

  useEffect(() => {
    fetchAbonementTypes(1, 999, user.currentBranch?.id)
    .then((data: any) => {
      setAbonementTypes(data.data.rows)
    })
    listProcedures(1, 999, user.currentBranch?.id)
    .then((data: any) => {
      setServices(data.data.rows)
    })

    if(abonement?.clientAbonementProcedures){
      setSelectedServices(abonement.clientAbonementProcedures.map((rp) => rp.procedure))
    }
  }, [updated])


  const deleteAbonementHandler = () => {
    if(abonement && abonement.id){
      deleteAbonement(abonement.id)
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

  const selectAbonementTypeHandler = (abonementType: string) => {
    setSelectedAbonementType(abonementType)
    if(abonementTypes){
      const abonement = abonementTypes.find(x => x.id === abonementType)
      abonement && setIsVisitsLimit(!!abonement.visitsLimit)
      abonement && setVisitsLimit(abonement.visitsLimit)
      abonement && setIsDaysLimit(!!abonement.daysLimit)
      abonement && setName(abonement.name)
      abonement && setPrice(abonement.price)
      if(!!abonement?.daysLimit){
        setExpirationDate(add(new Date(), { days: abonement.daysLimit }))
      }
      if(abonement?.abonementTypeProcedures && abonement?.abonementTypeProcedures.length){
        setSelectedServices(abonement.abonementTypeProcedures.map((rp) => rp.procedure))
      }
    }
  }

  const closeAbonementTypeModalHandler = () => {
    setUpdated(!updated)
    setShowAbonementTypeModal(false)
  }

  const showAbonementTypeModalHandler = () => {
    setShowAbonementTypeModal(true)
  }

  const createAbonementHandler = () => {
    if (clientId && name && price && (visitsLimit || expirationDate) && (isVisitsLimit || isDaysLimit) && selectedServices && selectedServices.length > 0) {
      createAbonement(clientId, name, price, (isVisitsLimit ? visitsLimit : null), visits, (isDaysLimit ? expirationDate : undefined), 'active', selectedServices, user.currentBranch?.id)
      .then((data: any) => {
        toast.success('Абонемент создан и прикреплен к клиенту')
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
    if (abonement && abonement.id && name && price && (visitsLimit || expirationDate) && (isVisitsLimit || isDaysLimit) && selectedServices && selectedServices.length > 0) {
      updateAbonement(abonement.id, name, price, (isVisitsLimit ? visitsLimit : null), visits,  (isDaysLimit ? expirationDate : undefined), selectedServices, user.currentBranch?.id)
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
           onDelete={() => setShowConfirmation(true)} allowDelete={abonement && user.isAdmin}
           onClose={onClose}>
      <Modal show={showConfirmation} onClose={() => setShowConfirmation(false)} name="Подтверждение">
        <ModalContent height="110px">
          <p className={s.confirmation_text}>Вы уверены, что хотите удалить абонемент?</p>
        </ModalContent>
        <ModalFooter>
          <Button theme="border" size="big" onClick={() => setShowConfirmation(false)} fullWidth>Отменить</Button>
          <Button fullWidth size="big" theme="dangerous" onClick={() => deleteAbonementHandler()}>Удалить</Button>
        </ModalFooter>
      </Modal>
      {showAbonementTypeModal && <AbonementTypeModal show={showAbonementTypeModal} onClose={closeAbonementTypeModalHandler} />}
      <ModalContent height={"522px"} width={isMobile ? "100%" : "544px"}>
        <div className={s.modal_body}>
          <div className={s.appointment_wrapper}>
            {
              !abonement &&
              <div className={s.input_group}>
                <Title title="Тип абонемента"/>
                <Select
                  value={selectedAbonementType || ''}
                  onChange={(e: any) => selectAbonementTypeHandler(e.target.value)}
                >
                  {
                    abonementTypes && abonementTypes.map((variant) => (
                      <MenuItem key={variant.id} value={variant.id}>
                        {variant.name}
                      </MenuItem>
                    ))
                  }
                  <MenuItem>
                    <Button 
                      theme="secondary" 
                      fullWidth 
                      size="small" 
                      className={s.add_abonement_button} 
                      onClick={() => showAbonementTypeModalHandler()}
                    >Добавить тип абонемента</Button>
                  </MenuItem>

                </Select>
              </div>
            }
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
                <Title title="Дата сгорания абонмента"/>
              </div>
              {isDaysLimit && <Datepicker placeholder="дд.мм.гггг" showYearDropdown showMonthDropdown date={expirationDate} setDate={setExpirationDate} />}
            </div>
            <div className={s.input_group}>
              <Title title="Использованные посещения"/>
              <Input placeholder="Использованные посещения" offAutoComplite type="number" value={visits} onChange={setVisits}/>
              <p className={s.services_total}>Вы можете указать количество использованных<br/>посещений по абонементу, если они есть</p>
            </div>
          </div>
        </div>
      </ModalContent>
      <ModalFooter>
        <Button theme="border" size="big" onClick={() => onClose()} fullWidth>Закрыть</Button>
        {!abonement && <Button  
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