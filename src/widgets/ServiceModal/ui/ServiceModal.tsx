import Modal from "@/components/Modal/Modal"
import ModalContent from "@/components/Modal/ModalContent"
import ModalFooter from "@/components/Modal/ModalFooter"
import {Button} from "@/shared/Button"
import s from './ServiceModal.module.scss'
import {useContext, useState} from "react"
import {Title} from "@/shared/Title"
import {Input} from "@/shared/Input"
import {Context} from "@/index"
import {createProcedure, deleteProcedure, updateProcedure} from "@/http/proceduresAPI"
import {toast} from "react-toastify"
import {IService} from "@/interfaces/interfaces"
import { Switcher } from "@/shared/Switcher"

interface IModalProps {
  mode: "create" | "update"
  show: boolean
  onClose: () => void
  service?: IService
  groupToAdd?: number | null
}

export const ServiceModal = ({mode, show, onClose, service, groupToAdd = null}: IModalProps) => {
  if (service) {
    mode = "update"
  }

  const [showConfirmation, setShowConfirmation] = useState(false)

  const [name, setName] = useState(service?.name || "");
  const [price, setPrice] = useState(service ? service.price.toString() : "");
  const [duration, setDuration] = useState(service?.duration ? service.duration.toString() : "");
  const [isOnlineAppointment, setIsOnlineAppointment] = useState(service ? service.is_online_appointment : true);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 500)

  const {user} = useContext(Context)


  const deleteServiceHandler = () => {
    if(service && service.id){
      deleteProcedure(service.id, user.currentBranch?.id)
      .then(() => {
        toast.success('Услуга удалена')
        onClose()
      })
      .catch(e => {
        toast.error(e.message)
      })
    } else {
      toast.error('Не передан идентификатор услуги')
    }
    
  }

  const createServiceHandler = () => {
    if (name && price && duration) {
      console.log(groupToAdd)
      createProcedure(name, Number(price), Number(duration), isOnlineAppointment, user.currentBranch?.id, groupToAdd)
      .then((data: any) => {
        toast.success('Услуга добавлена')
        onClose()
      })
      .catch(e => {
        toast.error(e.message)
      })
    } else {
      toast.error('Заполните обязательные поля')
    }
  }

  const updateServiceHandler = () => {
    if (service && service.id && name && price && duration) {
      updateProcedure(service.id, name, Number(price), Number(duration), isOnlineAppointment, user.currentBranch?.id)
      .then((data: any) => {
        toast.success('Услуга обновлена')
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
           name={mode === 'create' ? "Новая услуга" : mode === 'update' && user.isAdmin ? "Редактирование услуги" : "Об услуге"}
           onClose={onClose}>
      <Modal show={showConfirmation} onClose={() => setShowConfirmation(false)} name="Подтверждение">
        <ModalContent height="110px">
          <p className={s.confirmation_text}>Вы уверены, что хотите удалить услугу?</p>
        </ModalContent>
        <ModalFooter>
          <Button theme="border" size="big" onClick={() => setShowConfirmation(false)} fullWidth>Отменить</Button>
          <Button fullWidth size="big" theme="dangerous" onClick={() => deleteServiceHandler()}>Удалить</Button>
        </ModalFooter>
      </Modal>
      <ModalContent height={"420px"} width={isMobile ? "100%" : "544px"}>
        <div className={s.modal_body}>
          <div className={s.appointment_wrapper}>
            {
              mode === "update" && user.isAdmin &&
                <div className={s.cancel_wrapper}>
                    <Button size="small" theme="dangerous" onClick={() => setShowConfirmation(true)}>Удалить</Button>
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
              <Title title="Длительность в минутах" required/>
              <Input placeholder="Длительность" offAutoComplite type="number" value={duration} onChange={setDuration}/>
            </div>
          </div>
        </div>
      </ModalContent>
      <ModalFooter>
        <Button theme="border" size="big" onClick={() => onClose()} fullWidth>Закрыть</Button>
        {mode === "create" && <Button fullWidth size="big" onClick={() => {
          createServiceHandler()
        }}>Создать</Button>}
        {mode === "update" && user.isAdmin && <Button fullWidth size="big" onClick={() => {
          updateServiceHandler()
        }}>Сохранить</Button>}
      </ModalFooter>
    </Modal>
  )
}