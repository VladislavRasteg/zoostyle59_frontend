import Modal from "@/components/Modal/Modal"
import ModalContent from "@/components/Modal/ModalContent"
import ModalFooter from "@/components/Modal/ModalFooter"
import {Button} from "@/shared/Button"
import s from './GroupModal.module.scss'
import {useContext, useEffect, useState} from "react"
import {Title} from "@/shared/Title"
import {Input} from "@/shared/Input"
import {Context} from "@/index"
import {toast} from "react-toastify"
import { IGroup, IService } from "@/interfaces/interfaces"
import { createGroup, deleteGroup, listProcedures, updateGroup } from "@/http/proceduresAPI"
import Multiselect from "@/shared/Multiselect/Multiselect"

interface IModalProps {
  mode: "create" | "update"
  show: boolean
  onClose: () => void
  group: IGroup | undefined
}

export const GroupModal = ({mode = "create", show, onClose, group}: IModalProps) => {
  if (group) {
    mode = "update"
  }

  const [services, setServices] = useState<IService[] | undefined>();
  const [selectedServices, setSelectedServices] = useState<IService[] | undefined>();

  const [showConfirmation, setShowConfirmation] = useState(false)

  const [name, setName] = useState(group?.name || "");

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 500)

  const {user} = useContext(Context)

  useEffect(() => {
    setSelectedServices(group?.procedures)
    listProcedures(1, 100, user.currentBranch?.id).then((data: any) => {
      setServices(data.data)
    })
  }, [])

  const changeSelectedServicesHandler = (services: Array<IService>) => {
    setSelectedServices(services)
  }

  const deleteGroupHandler = () => {
    if(group && group.id){
      deleteGroup(group.id, user.currentBranch?.id)
      .then(() => {
        toast.success('Группа удалена')
        onClose()
      })
      .catch(e => {
        toast.error(e.message)
      })
    } else {
      toast.error('Не передан идентификатор группы')
    }
  }

  const createGroupHandler = () => {
    if (name) {
      createGroup(name, selectedServices, user.currentBranch?.id)
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

  const updateGroupHandler = () => {
    if (group && group.id) {
      updateGroup(group.id, name, selectedServices, user.currentBranch?.id)
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
           name={mode === 'create' ? "Новая группа" : "Редактирование группы"}
           onClose={onClose}>
      <Modal show={showConfirmation} onClose={() => setShowConfirmation(false)} name="Подтверждение">
        <ModalContent height="110px">
          <p className={s.confirmation_text}>Вы уверены, что хотите удалить группу? Все прикрепленные услуги перенесутся в раздел «Услуги без группы»</p>
        </ModalContent>
        <ModalFooter>
          <Button theme="border" size="big" onClick={() => setShowConfirmation(false)} fullWidth>Отменить</Button>
          <Button fullWidth size="big" theme="dangerous" onClick={() => deleteGroupHandler()}>Удалить</Button>
        </ModalFooter>
      </Modal>
      <ModalContent height={mode === 'create' ? "260px" : "360px"} width={isMobile ? "100%" : "544px"}>
        <div className={s.modal_body}>
          <div className={s.appointment_wrapper}>
            {
              mode === "update" && user.isAdmin &&
                <div className={s.cancel_wrapper}>
                    <Button size="small" theme="dangerous" onClick={() => setShowConfirmation(true)}>Удалить</Button>
                </div>
            }

            <div className={s.input_group}>
              <Title title="Название группы" required/>
              <Input placeholder="Название группы" offAutoComplite value={name} onChange={setName}/>
            </div>
            <div className={s.input_group}>
              <Title title="Список услуг"/>
              <Multiselect
                placeholder={"Выберите услуги"}
                displayValue={"name"}
                onRemove={(event) => {
                  changeSelectedServicesHandler(event)
                }}
                onSelect={(event) => {
                  changeSelectedServicesHandler(event)
                }}
                options={services || []}
                selectedValues={selectedServices || []}
                matchValue={"id"}
                secondaryDisplayValue={"duration"}
                secondaryDisplayValueName={"минут"}
                mobileHeading="Выбор услуг"
              />
            </div>
          </div>
        </div>
      </ModalContent>
      <ModalFooter>
        <Button theme="border" size="big" onClick={() => onClose()} fullWidth>Закрыть</Button>
        {mode === "create" && <Button fullWidth size="big" onClick={() => {
          createGroupHandler()
        }}>Создать</Button>}
        {mode === "update" && user.isAdmin && <Button fullWidth size="big" onClick={() => {
          updateGroupHandler()
        }}>Сохранить</Button>}
      </ModalFooter>
    </Modal>
  )
}