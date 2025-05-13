import Modal from "@/components/Modal/Modal"
import ModalContent from "@/components/Modal/ModalContent"
import ModalFooter from "@/components/Modal/ModalFooter"
import {Button} from "@/shared/Button"
import s from './ClientModal.module.scss'
import {useContext, useEffect, useState} from "react"
import {Title} from "@/shared/Title"
import {Datepicker} from "@/shared/Datepicker"
import {Input} from "@/shared/Input"
import {Context} from "@/index"
import {PhoneInput} from "@/shared/PhoneInput"
import {toast} from "react-toastify"
import {IAppointment, IClient} from "@/interfaces/interfaces"
import {Scrollbar} from "react-scrollbars-custom"
import { createClient, deleteClient, getOneClient, updateClient } from "@/http/clientAPI"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { AbonementModal } from "@/widgets/AbonementModals/AbonementModal"
import { IAbonement } from "@/futures/Abonement/models"
import { AbonementCard } from "@/futures/Abonement/ui/AbonementCard"

interface IModalProps {
  show: boolean
  onClose: (client?: IClient) => void
  client?: IClient
}

export const ClientModal = ({show, onClose, client}: IModalProps) => {

  const [showConfirmation, setShowConfirmation] = useState(false)

  const [surname, setSurname] = useState(client?.surname || "");
  const [name, setName] = useState(client?.firstName || "");
  const [caretaker, setCaretaker] = useState(client?.caretaker || "");
  const [middleName, setMiddleName] = useState(client?.middleName || "");
  const [phone, setPhone] = useState(client?.phone);
  const [mail, setMail] = useState(client?.mail || "");
  const [dob, setDob] = useState<Date | undefined>(client?.birth ? new Date(client.birth) : undefined);
  const [abonement, setAbonement] = useState<IAbonement>();
  const [previousAppointments, setPreviousAppointments] = useState<IAppointment[]>()
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 500)
  const [updated, setUpdated] = useState(false)
  const [showAbonement, setShowAbonement] = useState(false)

  const {user, tenant} = useContext(Context)

  useEffect(() => {
    if(client && client.id){
      getOneClient(client.id, user.currentBranch?.id).then((data: any) => {
        setPreviousAppointments(data.data.appointments)
        setAbonement(data.data.client.activeAbonement)
      })
    }
  }, [updated])


  const deleteClientHandler = () => {
    if(client && client.id){
      deleteClient(client.id)
      .then(() => {
        toast.success('Сотрудник удален')
        onClose()
      })
      .catch(e => {
        toast.error(e.message)
      })
    } else {
      toast.error('Не передан идентификатор сотрудника')
    }
  }

  const createClientHandler = () => {
    if (name && phone) {
      createClient(surname, name, middleName, 0, dob, phone, user.currentBranch?.id, mail, caretaker)
      .then((data: any) => {
        toast.success('Клиент добавлен')
        onClose(data.data)
      })
      .catch(e => {
        toast.error(e.message)
      })
    } else {
      toast.error('Заполните обязательные поля')
    }
  }

  const updateClientHandler = () => {
    if (client?.id && name && phone) {
      updateClient(client.id, surname, name, middleName, dob, phone, user.currentBranch?.id, mail, caretaker)
      .then((data: any) => {
        toast.success('Клиент обновлен')
        onClose()
      })
      .catch(e => {
        toast.error(e.message)
      })
    } else {
      toast.error('Заполните обязательные поля')
    }
  }

  const closeAbonementModalHandler = () => {
    setUpdated(!updated)
    setShowAbonement(false)
  }


  return (
    <Modal show={show} name={client ? "Редактирование клиента" : "Новый клиент"} onDelete={() => setShowConfirmation(true)} allowDelete={client && user.isAdmin} onClose={onClose}>
      <Modal show={showConfirmation} onClose={() => setShowConfirmation(false)} name="Подтверждение">
        <ModalContent height="110px">
          <p className={s.confirmation_text}>Вы уверены, что хотите удалить клиента?</p>
        </ModalContent>
        <ModalFooter>
          <Button theme="border" size="big" onClick={() => setShowConfirmation(false)} fullWidth>Отменить</Button>
          <Button fullWidth size="big" theme="dangerous" onClick={() => deleteClientHandler()}>Удалить</Button>
        </ModalFooter>
      </Modal>
      {(showAbonement && client) && <AbonementModal show={showAbonement} onClose={closeAbonementModalHandler} clientId={client.id} />}
      <ModalContent 
        height={client ? "620px" : "560px"} 
        width={isMobile ? "100%" : (previousAppointments && previousAppointments.length) ? "944px" : "544px"}>
        <div className={s.modal_body}>
          <div className={s.appointment_wrapper}>
            {
              user?.currentBranch?.abonements && !abonement && client && 
              <Button fullWidth theme="secondary" onClick={() => setShowAbonement(true)}>Выдать абонемент</Button>
            }
            {
              user?.currentBranch?.abonements && abonement && client && 
              <AbonementCard abonement={abonement} updateHandler={() => setUpdated(!updated)}/>
            }
            { tenant?._tenant?.hasCaretaker && 
              <div className={s.input_group}>
                <Title title="Опекун"/>
                <Input placeholder="Опекун" offAutoComplite value={caretaker} onChange={setCaretaker}/>
              </div> 
            }
            <div className={s.input_group}>
              <Title title="Фамилия" required/>
              <Input placeholder="Фамилия" offAutoComplite value={surname} onChange={setSurname}/>
            </div>
            <div className={s.input_group}>
              <Title title="Имя" required/>
              <Input placeholder="Имя" offAutoComplite value={name} onChange={setName}/>
            </div>
            <div className={s.input_group}>
              <Title title="Отчество"/>
              <Input placeholder="Отчество" offAutoComplite value={middleName} onChange={setMiddleName}/>
            </div>
            <div className={s.input_group}>
              <Title title="Дата рождения"/>
              <Datepicker placeholder="дд.мм.гггг" date={dob} setDate={setDob} showYearDropdown showMonthDropdown/>
            </div>
            <div className={s.input_group}>
              <Title title="Номер телефона" required/>
              <PhoneInput value={phone} onChange={setPhone}/>
            </div>
            <div className={s.input_group}>
              <Title title="Почта"/>
              <Input placeholder="Почта" offAutoComplite value={mail} onChange={setMail}/>
            </div>
          </div>
          {(previousAppointments && previousAppointments.length > 0 && !isMobile) &&
              <div className={s.client_appointments}>
                  <Title title="История записей клиента"/>
                  <Scrollbar>
                      <div className={s.appointments_list}>
                        {
                          previousAppointments.map((appointment) => {
                            return (
                              <div className={s.appointment} key={appointment.id}>
                                <p className={s.appointment_date}>
                                  {format(new Date(appointment.date), "dd MMMM", {locale: ru})} {appointment.time.slice(0, 5)} | {appointment.sum} ₽
                                </p>
                                <p className={s.appointment_employee_name}>
                                  {appointment.user.surname} {appointment.user.firstName && appointment.user.firstName[0] + "."}{appointment.user.middleName && appointment.user.middleName[0] + "."}
                                </p>
                                {
                                  appointment.appointmentServices.map((service) =>
                                    <p className={s.appointment_date} key={service.id}>
                                      {service.service.name} <span>{service.service.price}₽</span>
                                    </p>
                                  )
                                }
                              </div>
                            )
                          })
                        }
                      </div>
                  </Scrollbar>

              </div>
          }
        </div>
      </ModalContent>
      <ModalFooter>
        <Button theme="border" size="big" onClick={() => onClose()} fullWidth>Закрыть</Button>
        {!client && <Button fullWidth size="big" onClick={() => {
          createClientHandler()
        }}>Создать</Button>}
        {client && user.isAdmin && <Button fullWidth size="big" onClick={() => {
          updateClientHandler()
        }}>Сохранить</Button>}
      </ModalFooter>
    </Modal>
  )
}