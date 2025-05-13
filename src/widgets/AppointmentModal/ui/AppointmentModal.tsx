import Modal from "@/components/Modal/Modal"
import ModalContent from "@/components/Modal/ModalContent"
import ModalFooter from "@/components/Modal/ModalFooter"
import {Button} from "@/shared/Button"
import s from './AppointmentModal.module.scss'
import React, {useContext, useEffect, useState} from "react"
import {Title} from "@/shared/Title"
import {Datepicker} from "@/shared/Datepicker"
import {Input} from "@/shared/Input"
import {getAllClients} from "@/http/clientsAPI"
import {Context} from "@/index"
import {format} from "date-fns"
import {ru} from "date-fns/locale/ru"
import {MenuItem, Select} from "@/shared/Select"
import {listDoctors} from "@/http/doctorsAPI"
import {listProcedures} from "@/http/proceduresAPI"
import Multiselect from "@/shared/Multiselect/Multiselect"
import {createClient, getGroups, getOneClient} from "@/http/clientAPI"
import {Scrollbar} from "react-scrollbars-custom"
import {PhoneInput} from "@/shared/PhoneInput"
import {addMinutesToTime} from "@/utils/addMinutesToTime"
import {createGroupReception, createReception, deleteReception, updateReception} from "@/http/receptionAPI"
import {toast} from "react-toastify"
import {IAppointment, IClient, IEmployee, IService, IGroup, IPet} from "@/interfaces/interfaces"
import {Checkbox} from "@arco-design/web-react";
import {Form} from "react-bootstrap";
import { AbonementForm } from "./AbonementForm"
import { ClientModal } from "@/widgets/ClientModal"
import { formatAge } from "@/utils/getAge"
import { getAllPets } from "@/http/petsAPI"
import { PetModal } from "@/widgets/PetModal"

interface IModalProps {
  mode: "create" | "update"
  show: boolean
  onClose: () => void
  date?: string
  startTime?: string
  endTime?: string
  propsSum?: number | undefined
  employeeId?: number | undefined
  petId?: number | undefined
  client?: IClient
  pet?: IPet
  propsSelectedServices?: IService[] | undefined
  updateReceptions: () => void
  appointmentId?: number
  polisOMSnumber: string;
  isAbonement?: boolean;
}

export const AppointmentModal = ({
  mode,
  show,
  onClose,
  propsSum = 0,
  date = '',
  startTime = '',
  endTime = '',
  employeeId = 0,
  updateReceptions,
  client,
  petId = 0,
  propsSelectedServices,
  appointmentId,
  polisOMSnumber: initialOMS,
  isAbonement = false
}: IModalProps) => {

  if (client) {
    mode = "update"
  }

  if (startTime) {
    startTime = startTime.slice(0, 5)
  }

  const {user, tenant} = useContext(Context)

  const [appointmentDate, setAppointmentDate] = useState(date ? new Date(date) : new Date());
  const [appointmentStartTime, setAppointmentStartTime] = useState(startTime);
  const [appointmentEndTime, setAppointmentEndTime] = useState(endTime);
  const [appointmentEndTimeChanged, setAppointmentEndTimeChanged] = useState(false);
  const [searchClient, setSearchClient] = useState("");
  const [comment, setComment] = useState("");
  const [searchResult, setSearchResult] = useState<IClient[]>()
  const [selectedClient, setSelectedClient] = useState<IClient | undefined>(client);
  
  const [sum, setSum] = useState(propsSum);

  const [searchPet, setSearchPet] = useState("");
  const [pets, setPets] = useState<IPet[]>()
  const [selectedPet, setSelectedPet] = useState(petId);
  
  const [showConfirmation, setShowConfirmation] = useState(false)

  const [showCreateClient, setShowCreateClient] = useState(false);
  const [showCreatePet, setShowCreatePet] = useState(false);
  
  const [employees, setEmployees] = useState<IEmployee[]>();
  const [selectedEmployee, setSelectedEmployee] = useState(employeeId);
  
  const [services, setServices] = useState<IService[]>();
  const [selectedServices, setSelectedServices] = useState<IService[] | undefined>();
  
  const [previousAppointments, setPreviousAppointments] = useState<IAppointment[]>()

  const [isMobile, setIsMobile] = useState(false)
  const [isAbonementReception, setIsAbonementReception] = useState(
    mode === "update" ? isAbonement 
    : user?.currentBranch?.abonements ? true : false
  )

  const [update, setUpdate] = useState(false)

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
 
  useEffect(() => {
    getAllPets(1, 100, searchPet, selectedClient?.id).then((data: any) => {
      setPets(data.data.rows)
    })
  }, [selectedClient])

  useEffect(() => {
    if (window.innerWidth <= 500) {
      setIsMobile(true)
    }
    setSelectedServices(propsSelectedServices)
    listDoctors(1, 9999).then((data: any) => {
      setEmployees(data.data.rows)
      if (!employeeId && data.data.doctors.rows.length) {
        setSelectedEmployee(data.data.doctors.rows[0].id)
      }
    })
    if(client?.id){
      getOneClient(client.id, user.currentBranch?.id).then((data: any) => {
        setPreviousAppointments(data.data.appointments)
      })
    }
    listProcedures(1, 999, user.currentBranch?.id).then((data: any) => {
      setServices(data.data)
    })
  }, [])

  useEffect(() => {
    if(selectedClient && selectedClient.id && user.currentBranch?.id){
      getOneClient(selectedClient.id, user.currentBranch?.id).then((data: any) => {
        setSelectedClient(data.data.client)
      })
    }
  }, [update])

  const selectClientHandler = (client: IClient) => {
    getOneClient(client.id, user.currentBranch?.id).then((data: any) => {
      setPreviousAppointments(data.data.appointments)
    })
    if (client) {
      setSelectedClient(client)
    }

    setSearchResult(undefined)
    setSearchClient("")
  }

  const petModalCloseHandler = () => {
    getAllPets(1, 100, searchPet, selectedClient?.id).then((data: any) => {
      setPets(data.data.rows)
    })
    setShowCreatePet(false)
  }

  const changeSelectedServicesHandler = (services: Array<IService>) => {
    setSelectedServices(services)
    if (services.length && appointmentStartTime && !appointmentEndTimeChanged) {
      setAppointmentEndTime(addMinutesToTime(appointmentStartTime, services.reduce((acc, curr) => acc + curr.duration, 0)))
    }
    const servicesSum = services.reduce((acc, curr) => acc + curr.price, 0)
    setSum(servicesSum)
  }

  const changeStartTimeHandler = (value: string) => {
    setAppointmentStartTime(value)
  }

  const changeEndTimeHandler = (value: string) => {
    setAppointmentEndTime(value)
    setAppointmentEndTimeChanged(true)
  }

  const createReceptionHandler = (clientId: number, petId: number) => {
    createReception(selectedEmployee, clientId, date, appointmentStartTime, appointmentEndTime, '', petId, selectedServices || [], sum)
      .then(() => {
        toast.success('Запись добавлена')
        updateReceptions()
        onClose()
      })
      .catch(e => {
        toast.error(e.message)
      })
  }

  const updateReceptionHandler = (clientId: number, petId: number) => {
    if (appointmentId) {
      updateReception(appointmentId, selectedEmployee, clientId, date, appointmentStartTime, appointmentEndTime, '', petId, selectedServices || [], sum)
        .then(() => {
          toast.success('Данные изменены')
          updateReceptions()
          onClose()
        })
        .catch(e => {
          toast.error(e.message)
        })
    }
  }

  const cancelReceptionHandler = () => {
    deleteReception(appointmentId)
      .then(() => {
        toast.success('Запись отменена')
        updateReceptions()
        onClose()
      })
      .catch(e => {
        toast.error(e.message)
      })
  }

  const newReception = () => {
    if (selectedPet && appointmentStartTime && appointmentEndTime && appointmentEndTime > appointmentStartTime && selectedServices && selectedServices.length && selectedEmployee && selectedClient) {
      createReceptionHandler(selectedClient.id, selectedPet)
    } else {
      toast.error('Заполните обязательные поля')
    }
  }

  const updReception = () => {
    if (selectedPet && appointmentStartTime && appointmentEndTime && appointmentEndTime > appointmentStartTime && selectedServices && selectedServices.length && selectedEmployee && selectedClient) {
      updateReceptionHandler(selectedClient.id, selectedPet)
    } else {
      toast.error('Заполните обязательные поля')
    }
  }

  return (
    <Modal show={show}
           name={mode === 'create' ? "Новая запись" : mode === 'update' && user.isAdmin ? "Редактировать запись" : "О записи"}
           onClose={onClose}>
      {showCreateClient && <ClientModal show={showCreateClient} onClose={() => setShowCreateClient(false)} />}
      {showCreatePet && <PetModal show={showCreatePet} onClose={() => petModalCloseHandler()} />}
      <Modal show={showConfirmation} onClose={() => setShowConfirmation(false)} name="Подтверждение">
        <ModalContent height="110px">
          <p className={s.confirmation_text}>Вы уверены, что хотите отменить запись?</p>
        </ModalContent>
        <ModalFooter>
          <Button theme="border" size="big" onClick={() => setShowConfirmation(false)} fullWidth>Закрыть</Button>
          <Button fullWidth size="big" theme="dangerous" onClick={() => cancelReceptionHandler()}>Отменить</Button>
        </ModalFooter>
      </Modal>
      <ModalContent height={selectedClient ? "618px" : "820px"}
                    width={isMobile ? "100%" : (previousAppointments && previousAppointments.length) ? "944px" : "544px"}>
        <div className={s.modal_body}>
          <div className={s.appointment_wrapper}>
            {
              mode === "update" && user.isAdmin &&
                <div className={s.cancel_wrapper}>
                    <Button size="small" theme="dangerous" onClick={() => setShowConfirmation(true)}>Отменить
                        запись</Button>
                </div>
            }
            <div className={s.date_time}>
              <Title title="Дата и время" required/>
              <div className={s.date_row}>
                <Datepicker date={appointmentDate} setDate={setAppointmentDate}/>
                <div className={s.time_row}>
                  <Input type="time" value={appointmentStartTime} onChange={changeStartTimeHandler}/>
                  <div className={s.time_divider}></div>
                  <Input type="time" value={appointmentEndTime} onChange={changeEndTimeHandler}/>
                </div>
              </div>
            </div>
            <div className={s.appointment_wrapper}>
              <div className={s.input_group}>
                <Title title="Услуги" required/>
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
                {/* {(selectedServices) ?
                    <p className={s.services_total}>Итого: {selectedServices.reduce((acc, curr) => acc + curr.price, 0)} ₽</p>
                    :
                    <p className={s.services_total}>Итого: 0 ₽</p>
                } */}
              </div>
              <div className={s.input_group}>
                <Title title="Сумма"/>
                <Input type="number" value={sum} onChange={setSum}/>
              </div>
              <div className={s.input_group}>
                <Title title="Сотрудник" required/>
                <Select
                  value={selectedEmployee || ''}
                  onChange={(e: any) => setSelectedEmployee(e.target.value)}
                >
                  {
                    employees && employees.map((variant) => (
                      <MenuItem key={variant.id} value={variant.id}>
                        {variant.surname} {variant.firstName} {variant.middleName}
                      </MenuItem>
                    ))
                  }
                </Select>
              </div>

              {
                user.isAdmin &&
                <div className={s.input_group}>
                  <Title title="Клиент" required/>
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
              }
              {
                (user.isAdmin && selectedClient) &&
                <div className={s.client_block}>
                <p
                  className={s.search_name}>{selectedClient.surname} {selectedClient.firstName} {selectedClient.middleName}</p>
                  {selectedClient.phone && <p className={s.search_secondary}>{selectedClient.phone}</p>}
                  {selectedClient.mail && <p className={s.search_secondary}>{selectedClient.mail}</p>}
                </div>
              }
              { 
                user.isAdmin &&
                <Button fullWidth theme="tetrinary" onClick={() => setShowCreateClient(true)}>Добавить нового клиента</Button>
              }

              { selectedClient &&
                <div className={s.appointment_wrapper}>
                  <div className={s.input_group}>
                    <Title title="Питомец" required/>
                    <Select
                      value={selectedPet || ''}
                      onChange={(e: any) => {setSelectedPet(e.target.value)}}
                    >
                      {
                        pets && pets.map((variant) => (
                          <MenuItem key={variant.id} value={variant.id}>
                            {variant.name}
                          </MenuItem>
                        ))
                      }
                    </Select>
                  </div>  
                  {
                    (selectedPet && selectedPet != 0) ? pets?.map((pet) => {
                      if (pet.id === selectedPet) {
                        return(
                          <div className={s.client_block}>
                            <p className={s.search_name}>{pet.name}</p>
                            {pet.birth && <p className={s.search_secondary}>{formatAge(new Date(pet.birth))}</p>}
                            {pet.breed && <p className={s.search_secondary}>{pet.breed}</p>}
                          </div>
                        )
                      }
                    }) : ""
                  }
                  <Button fullWidth theme="tetrinary" onClick={() => setShowCreatePet(true)}>Добавить нового питомца</Button>
                </div>
              }
              <div className={s.input_group}>
                <Title title="Комментарий" />
                <Input value={comment} onChange={setComment} />
              </div>  
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
        {mode === "create" && <Button fullWidth size="big" onClick={() => {
          newReception()
        }}>Добавить</Button>}
        {mode === "update" && <Button fullWidth size="big" onClick={() => {
          updReception()
        }}>Сохранить</Button>}
      </ModalFooter>
    </Modal>
  )
}