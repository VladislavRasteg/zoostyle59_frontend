import Modal from "@/components/Modal/Modal"
import ModalContent from "@/components/Modal/ModalContent"
import ModalFooter from "@/components/Modal/ModalFooter"
import {Button} from "@/shared/Button"
import s from './PetModal.module.scss'
import {useContext, useEffect, useState} from "react"
import {Title} from "@/shared/Title"
import {Datepicker} from "@/shared/Datepicker"
import {Input} from "@/shared/Input"
import {Context} from "@/index"
import {PhoneInput} from "@/shared/PhoneInput"
import {toast} from "react-toastify"
import {IAppointment, IClient, IPet} from "@/interfaces/interfaces"
import {Scrollbar} from "react-scrollbars-custom"
import { createClient, deleteClient, getOneClient, updateClient } from "@/http/clientAPI"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { createPet, deletePet, getOnePet, updatePet } from "@/http/petsAPI"
import { MenuItem, Select } from "@/shared/Select"
import { getAllClients } from "@/http/clientsAPI"
import { ClientModal } from "@/widgets/ClientModal"

interface IModalProps {
  show: boolean
  onClose: (client?: IClient) => void
  pet?: IPet
}

export const PetModal = ({show, onClose, pet}: IModalProps) => {

  const [showConfirmation, setShowConfirmation] = useState(false)

  const [name, setName] = useState(pet?.name || "");
  const [sex, setSex] = useState(pet?.sex || "");
  const [breed, setBreed] = useState(pet?.breed || "");
  const [showCreateClient, setShowCreateClient] = useState(false);
  const [feautures, setFeautures] = useState(pet?.feautures || "");
  const [searchClient, setSearchClient] = useState("");
  const [searchResult, setSearchResult] = useState<IClient[]>()
  const [selectedClient, setSelectedClient] = useState<IClient | undefined>(pet?.client);
  const [clientId, setClientId] = useState(pet?.clientId);
  const [dob, setDob] = useState<Date | undefined>(pet?.birth ? new Date(pet.birth) : undefined);
  const [previousAppointments, setPreviousAppointments] = useState<IAppointment[]>()
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 500)
  const [updated, setUpdated] = useState(false)

  useEffect(() => {
    if(pet && pet.id){
      getOnePet(pet.id).then((data: any) => {
        setPreviousAppointments(data.data.appointments)
      })
    }
  }, [updated])

  useEffect(() => {
    if (searchClient.length > 2) {
      const delayDebounceFn = setTimeout(() => {
        getAllClients(1, 100, searchClient).then((data: any) => {
          setSearchResult(data.data.rows)
        })
      }, 100)
      return () => clearTimeout(delayDebounceFn)
    } else {
      setSearchResult(undefined)
    }
  }, [searchClient])

    const selectClientHandler = (client: IClient) => {
      if (client) {
        setSelectedClient(client)
      }
  
      setSearchResult(undefined)
      setSearchClient("")
    }


  const deleteClientHandler = () => {
    if(pet && pet.id){
      deletePet(pet.id)
      .then(() => {
        toast.success('Питомец удален')
        onClose()
      })
      .catch(e => {
        toast.error(e.message)
      })
    } else {
      toast.error('Не передан идентификатор питомца')
    }
  }

  const createPetHandler = () => {
    if (name && breed && selectedClient) {
      createPet(name, sex, dob, breed, feautures, selectedClient.id)
      .then((data: any) => {
        toast.success('Питомец добавлен')
        onClose(data.data)
      })
      .catch(e => {
        toast.error(e.message)
      })
    } else {
      toast.error('Заполните обязательные поля')
    }
  }

  const updatePetHandler = () => {
    if (pet?.id && name && breed && selectedClient) {
      updatePet(pet?.id, name, sex, dob, breed, feautures, selectedClient.id)
      .then((data: any) => {
        toast.success('Питомец обновлен')
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
    <Modal show={show} name={pet ? "Редактирование питомца" : "Новый питомец"} onDelete={() => setShowConfirmation(true)} allowDelete={!!pet} onClose={onClose}>
      {showCreateClient && <ClientModal show={showCreateClient} onClose={() => setShowCreateClient(false)} />}
      <Modal show={showConfirmation} onClose={() => setShowConfirmation(false)} name="Подтверждение">
        <ModalContent height="110px">
          <p className={s.confirmation_text}>Вы уверены, что хотите удалить питомца?</p>
        </ModalContent>
        <ModalFooter>
          <Button theme="border" size="big" onClick={() => setShowConfirmation(false)} fullWidth>Отменить</Button>
          <Button fullWidth size="big" theme="dangerous" onClick={() => deleteClientHandler()}>Удалить</Button>
        </ModalFooter>
      </Modal>
      <ModalContent 
        height={pet ? "620px" : "560px"} 
        width={isMobile ? "100%" : (previousAppointments && previousAppointments.length) ? "944px" : "544px"}>
        <div className={s.modal_body}>
          <div className={s.appointment_wrapper}>
            <div className={s.input_group}>
              <Title title="Кличка" required/>
              <Input placeholder="Кличка" offAutoComplite value={name} onChange={setName}/>
            </div>
            <div className={s.input_group}>
                <Title title="Клиент"/>
                <div className={s.search_client}>
                  <Input offAutoComplite placeholder="Начните вводить фамилию" value={searchClient}
                        onChange={setSearchClient}/>
                  {
                    searchResult && searchResult.length > 0 &&
                      <div className={s.search_results}>
                          <div className={s.outside_click_handler} onClick={() => setSearchResult(undefined)}></div>
                        {
                          searchResult.map((element, index) =>
                            <div className={s.search_result} key={index} onClick={() => {
                              selectClientHandler(element)
                            }}>
                              <p
                                className={s.search_name}>{element.surname} {element.firstName} {element.middleName}</p>
                              <div className={s.search_additional_info}>
                                {element.phone && <p className={s.search_secondary}>{element.phone}</p>}
                                {element.mail && <p className={s.search_secondary}>{element.mail}</p>}
                              </div>
                            </div>
                          )
                        }
                      </div>
                  }
                </div>
              </div>
              {
                selectedClient &&
                <div className={s.client_block}>
                <p
                  className={s.search_name}>{selectedClient.surname} {selectedClient.firstName} {selectedClient.middleName}</p>
                  {selectedClient.phone && <p className={s.search_secondary}>{selectedClient.phone}</p>}
                  {selectedClient.mail && <p className={s.search_secondary}>{selectedClient.mail}</p>}
                </div>
              }
              <Button fullWidth theme="tetrinary" onClick={() => setShowCreateClient(true)}>Создать нового клиента</Button>
            <div className={s.input_group}>
              <Title title="Пол" required/>
              <Select
                value={sex || ''}
                onChange={(e: any) => setSex(e.target.value)}
              >
                <MenuItem key={"Самец"} value={"Самец"}>
                      Самец
                </MenuItem>
                <MenuItem key={"Самка"} value={"Самка"}>
                      Самка
                </MenuItem>
              </Select>
            </div>
            <div className={s.input_group}>
              <Title title="Порода" required/>
              <Input placeholder="Порода" offAutoComplite value={breed} onChange={setBreed}/>
            </div>
            <div className={s.input_group}>
              <Title title="Особенности"/>
              <Input placeholder="Особенности" offAutoComplite value={feautures} onChange={setFeautures}/>
            </div>
            <div className={s.input_group}>
              <Title title="Дата рождения"/>
              <Datepicker placeholder="дд.мм.гггг" date={dob} setDate={setDob} showYearDropdown showMonthDropdown/>
            </div>
          </div>
          {(previousAppointments && previousAppointments.length > 0 && !isMobile) &&
              <div className={s.client_appointments}>
                  <Title title="История записей питомца"/>
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
        {!pet && <Button fullWidth size="big" onClick={() => {
          createPetHandler()
        }}>Создать</Button>}
        {pet && <Button fullWidth size="big" onClick={() => {
          updatePetHandler()
        }}>Сохранить</Button>}
      </ModalFooter>
    </Modal>
  )
}