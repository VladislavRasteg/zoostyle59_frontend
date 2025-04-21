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
import {IAppointment, IClient, IEmployee, IService, IGroup} from "@/interfaces/interfaces"
import {Checkbox} from "@arco-design/web-react";
import {Form} from "react-bootstrap";
import { AbonementForm } from "./AbonementForm"

interface IModalProps {
  mode: "create" | "update"
  show: boolean
  onClose: () => void
  date?: string
  startTime?: string
  endTime?: string
  employeeId?: number | undefined
  client?: IClient
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
  date = '',
  startTime = '',
  endTime = '',
  employeeId = 0,
  updateReceptions,
  client,
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
  const [searchResult, setSearchResult] = useState<IClient[]>()
  const [selectedClient, setSelectedClient] = useState<IClient | undefined>(client);
  
  const [searchGroup, setSearchGroup] = useState("");
  const [searchGroupResult, setSearchGroupResult] = useState<IGroup[]>()
  const [selectedGroup, setSelectedGroup] = useState<IGroup | undefined>(undefined);
  
  const [showConfirmation, setShowConfirmation] = useState(false)
  
  const [employees, setEmployees] = useState<IEmployee[]>();
  const [selectedEmployee, setSelectedEmployee] = useState(employeeId);
  
  const [services, setServices] = useState<IService[]>();
  const [selectedServices, setSelectedServices] = useState<IService[] | undefined>();
  
  const [previousAppointments, setPreviousAppointments] = useState<IAppointment[]>()
  
  const [caretaker, setCaretaker] = useState("");
  
  const [clientName, setClientName] = useState("");
  const [clientMiddleName, setClientMiddleName] = useState("");
  const [clientPhone, setClientPhone] = useState<string>();
  const [clientMail, setClientMail] = useState("");

  const [isMobile, setIsMobile] = useState(false)
  const [isClientReception, setIsClientReception] = useState(true)
  const [isAbonementReception, setIsAbonementReception] = useState(
    mode === "update" ? isAbonement 
    : user?.currentBranch?.abonements ? true : false
  )

  //TODO: Удалить нахуй polisOMS
  const [polisOMS, setPolisOMS] = useState<boolean>(!!initialOMS)
  const [polisOMSnumber, setPolisOMSnumber] = useState<string>(initialOMS)

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
    if (searchGroup.length >= 2) {
      const delayDebounceFn = setTimeout(() => {
        getGroups({branchId: user?.currentBranch?.id, name: searchGroup})
          .then((res: any) => {
            setSearchGroupResult(res.data)
          })
      }, 100)
      return () => clearTimeout(delayDebounceFn)
    } else {
      setSearchGroupResult(undefined)
    }
  }, [searchGroup])

  useEffect(() => {
    if (window.innerWidth <= 500) {
      setIsMobile(true)
    }
    setSelectedServices(propsSelectedServices)
    listDoctors(1, 100, user.currentBranch?.id).then((data: any) => {
      setEmployees(data.data.doctors.rows)
      if (!employeeId && data.data.doctors.rows.length) {
        setSelectedEmployee(data.data.doctors.rows[0].id)
      }
    })
    listProcedures(1, 999, user.currentBranch?.id).then((data: any) => {
      setServices(data.data.rows)
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
      setPreviousAppointments(data.data.receptions)
    })
    if (client) {
      setSelectedClient(client)
    }
    if(client.activeAbonement && user?.currentBranch?.abonements){
      const services = client.activeAbonement.clientAbonementProcedures.map(x => x.procedure)
      changeSelectedServicesHandler(services)
    }

    setSearchResult(undefined)
    setSearchClient("")
  }

  const selectGroupHandler = (group: any) => {
    group && setSelectedGroup(group)
    setSearchGroupResult(undefined)
    setSearchGroup("")
  }

  const removeSelectedClientHandler = () => {
    setPreviousAppointments(undefined)
    setSelectedClient(undefined)
  }
  const removeSelectedGroupHandler = () => {
    setSelectedGroup(undefined)
  }

  const changeSelectedServicesHandler = (services: Array<IService>) => {
    setSelectedServices(services)
    if (services.length && appointmentStartTime && !appointmentEndTimeChanged) {
      setAppointmentEndTime(addMinutesToTime(appointmentStartTime, services.reduce((acc, curr) => acc + curr.duration, 0)))
    }
  }

  const switchAppointmentType = (to: string) => {
    if(to === 'abonement'){
      setIsAbonementReception(true)
      setSelectedClient(undefined)
      setSelectedServices(undefined)
    } else {
      setIsAbonementReception(false)
      setSelectedClient(undefined)
      setSelectedServices(propsSelectedServices)
    }
  }

  const changeStartTimeHandler = (value: string) => {
    setAppointmentStartTime(value)
  }

  const changeEndTimeHandler = (value: string) => {
    setAppointmentEndTime(value)
    setAppointmentEndTimeChanged(true)
  }

  const createReceptionHandler = (clientId: number) => {
    createReception(date, appointmentStartTime, appointmentEndTime, clientId, selectedEmployee, selectedServices || [], '', user.currentBranch?.id, false, null, tenant?.polisOMS, polisOMSnumber, isAbonementReception)
      .then(() => {
        toast.success('Запись успешно создана')
        updateReceptions()
        onClose()
      })
      .catch(e => {
        toast.error(e.message)
      })
  }
  const createGroupReceptionHandler = (groupId: number) => {
    createGroupReception(date, appointmentStartTime, appointmentEndTime, groupId, selectedEmployee, selectedServices || [], '', user.currentBranch?.id)
      .then(() => {
        toast.success('Запись успешно создана')
        updateReceptions()
        onClose()
      })
      .catch(e => {
        toast.error(e.message)
      })
  }

  const updateReceptionHandler = (clientId: number) => {
    if (appointmentId) {
      updateReception(appointmentId, date, appointmentStartTime, appointmentEndTime, clientId, selectedEmployee, selectedServices || [], '', user.currentBranch?.id, polisOMSnumber)
        .then(() => {
          toast.success('Запись обновлена успешно')
          updateReceptions()
          onClose()
        })
        .catch(e => {
          toast.error(e.message)
        })
    }
  }

  const cancelReceptionHandler = () => {
    deleteReception(appointmentId, user.currentBranch?.id)
      .then(() => {
        toast.success('Запись успешно отменена')
        updateReceptions()
        onClose()
      })
      .catch(e => {
        toast.error(e.message)
      })
  }

  const newReception = () => {
    if (appointmentStartTime && appointmentEndTime && appointmentEndTime > appointmentStartTime && selectedServices && selectedServices.length && selectedEmployee) {
      if (isClientReception) {
        if (selectedClient) {
          createReceptionHandler(selectedClient.id)
        } else {
          if (clientName && clientPhone) {
            createClient(searchClient, clientName, clientMiddleName, 0, "", clientPhone, user.currentBranch?.id, clientMail, caretaker)
              .then((data: any) => {
                toast.success('Клиент успешно создан')
                createReceptionHandler(data.data.id)
              })
              .catch(e => {
                toast.error(e.message)
              })
          } else {
            toast.error('Заполните обязательные поля')
          }
        }
      } else {
        selectedGroup?.id && createGroupReceptionHandler(selectedGroup.id)
      }

    } else {
      toast.error('Заполните обязательные поля')
    }
  }

  const updReception = () => {
    if (appointmentStartTime && appointmentEndTime && appointmentEndTime > appointmentStartTime && selectedServices && selectedServices.length && selectedEmployee) {
      if (selectedClient) {
        updateReceptionHandler(selectedClient.id)
      } else {
        if (clientName && clientPhone) {
          createClient(searchClient, clientName, clientMiddleName, 0, "", clientPhone, user.currentBranch?.id, clientMail, caretaker)
            .then((data: any) => {
              toast.success('Клиент успешно создан')
              updateReceptionHandler(data.data.id)
            })
            .catch(e => {
              toast.error(e.message)
            })
        } else {
          toast.error('Запись обновлена успешно')
        }
      }
    } else {
      toast.error('Заполните обязательные поля')
    }
  }

  return (
    <Modal show={show}
           name={mode === 'create' ? "Новая запись" : mode === 'update' && user.isAdmin ? "Редактировать запись" : "О записи"}
           onClose={onClose}>
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
            {user?.currentBranch?.abonements &&
                <div className={s.switcher}>
                    <button
                        className={`${s.switcher_element} ${isAbonementReception ? s.active : ''}`}
                        onClick={() => switchAppointmentType("abonement")}
                    >
                        По абонементу
                    </button>
                    <button
                        className={`${s.switcher_element} ${!isAbonementReception ? s.active : ''}`}
                        onClick={() => switchAppointmentType("client")}
                    >
                        Разовая
                    </button>
                </div>
            }
            {
              !isAbonementReception ?
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
                  <Title title="Сотрудник"/>
                  <Select
                    value={selectedEmployee || ''}
                    onChange={(e: any) => setSelectedEmployee(e.target.value)}
                  >
                    {
                      employees && employees.map((variant) => (
                        <MenuItem key={variant.id} value={variant.id}>
                          {variant.surname} {variant.first_name} {variant.middle_name}
                        </MenuItem>
                      ))
                    }
                  </Select>
                </div>
                {tenant.tenant.polisOMS &&
                    <>
                        <div className={s.fieldGroup} onClick={() => setPolisOMS(prevState => {
                          prevState && setPolisOMSnumber('')
                          return !prevState
                        })}>
                            <div style={{display: 'flex', gap: '10px', flexDirection: 'row', marginTop: '10px'}}>
                                <Checkbox checked={polisOMS || !!polisOMSnumber}/>
                                <p className={s.fieldName}>Оплата по полису ОМС</p>
                            </div>
                        </div>
                    {polisOMS &&
                        <div className={s.input_group}>
                            <Title title="Номер полиса"/>
                            <Input placeholder="Введите номер полиса" offAutoComplite value={polisOMSnumber}
                                  onChange={setPolisOMSnumber}/>
                        </div>
                    }
                    </>
                }

                {user?.currentBranch?.groupReceptions &&
                    <div className={s.switcher}>
                        <button
                            className={`${s.switcher_element} ${isClientReception ? s.active : ''}`}
                            onClick={() => setIsClientReception(true)}
                        >
                            Клиент
                        </button>
                        <button
                            className={`${s.switcher_element} ${!isClientReception ? s.active : ''}`}
                            onClick={() => setIsClientReception(false)}
                        >
                            Группа
                        </button>
                    </div>
                }
                {
                  isClientReception ? (
                    <>
                      <div className={s.input_group}>
                        <Title title="Фамилия клиента"/>
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
                                        className={s.search_name}>{element.surname} {element.first_name} {element.middle_name}</p>
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
                        !selectedClient ?
                          <div className={s.client_fields}>
                            <div className={s.input_group}>
                              <Title title="Имя" required/>
                              <Input placeholder="Имя" offAutoComplite value={clientName} onChange={setClientName}/>
                            </div>
                            <div className={s.input_group}>
                              <Title title="Отчество"/>
                              <Input placeholder="Отчество" offAutoComplite value={clientMiddleName}
                                    onChange={setClientMiddleName}/>
                            </div>
                              { tenant?._tenant?.hasCaretaker && 
                                <div className={s.input_group}>
                                  <Title title="Опекун"/>
                                  <Input placeholder="Опекун" offAutoComplite value={caretaker} onChange={setCaretaker}/>
                                </div> 
                              }
                            <div className={s.input_group}>
                              <Title title="Номер телефона" required/>
                              <PhoneInput value={clientPhone} onChange={setClientPhone}/>
                              {/* <Input placeholder="Телефон" offAutoComplite value={clientPhone} onChange={setClientPhone} /> */}
                            </div>
                            <div className={s.input_group}>
                              <Title title="Почта"/>
                              <Input placeholder="Почта" offAutoComplite value={clientMail} onChange={setClientMail}/>
                            </div>
                          </div>
                          :
                          <div className={s.client_block_wrapper}>
                            <div className={s.client_block}>
                              <p
                                className={s.search_name}>{selectedClient.surname} {selectedClient.first_name} {selectedClient.middle_name}</p>
                              {selectedClient.phone && <p className={s.search_secondary}>{selectedClient.phone}</p>}
                              {selectedClient.mail && <p className={s.search_secondary}>{selectedClient.mail}</p>}
                            </div>
                            {user.isAdmin &&
                                <Button fullWidth theme="tetrinary" onClick={() => removeSelectedClientHandler()}>Создать
                                    нового клиента</Button>}
                          </div>
                      }
                    </>
                  ) : (
                    <>
                      <div className={s.input_group}>
                        <Title title="Название группы"/>
                        <div className={s.search_client}>
                          <Input offAutoComplite placeholder="Начните вводить название" value={searchGroup}
                                onChange={setSearchGroup}/>
                          {
                            searchGroupResult && searchGroupResult.length > 0 &&
                              <div className={s.search_results}>
                                  <div className={s.outside_click_handler}
                                      onClick={() => setSearchGroupResult(undefined)}></div>
                                {
                                  searchGroupResult?.map((element, index) =>
                                    <div className={s.search_result} key={index} onClick={() => {
                                      selectGroupHandler(element)
                                    }}>
                                      <p className={s.search_name}>
                                        {element?.name}
                                      </p>
                                      <div className={s.search_additional_info_group}>
                                        {element?.clients && element?.clients?.map(client =>
                                          <p
                                            className={s.search_secondary}>{client.surname} {client.first_name} {client.middle_name}</p>
                                        )}
                                      </div>
                                    </div>
                                  )
                                }
                              </div>
                          }
                        </div>
                      </div>
                      {
                        selectedGroup &&
                          <div className={s.client_block_wrapper}>
                              <div className={s.client_block}>
                                  <p
                                      className={s.search_name}>{selectedGroup.name}
                                  </p>
                                  <div className={s.search_additional_info_group}>
                                    {selectedGroup?.clients && selectedGroup?.clients?.map(client =>
                                      <p
                                        className={s.search_secondary}>{client.surname} {client.first_name} {client.middle_name}</p>
                                    )}
                                  </div>
                              </div>
                            {user.isAdmin &&
                                <Button fullWidth theme="tetrinary" onClick={() => removeSelectedGroupHandler()}>Сменить
                                    группу</Button>}
                          </div>
                      }
                    </>
                  )
                }    
              </div>
              :
              <AbonementForm
                searchClient={searchClient}
                setSearchClient={setSearchClient}
                searchResult={searchResult}
                setSearchResult={setSearchResult}
                selectClientHandler={selectClientHandler}
                selectedClient={selectedClient}
                user={user}
                clientName={clientName}
                setClientName={setClientName}
                update={update}
                setUpdate={setUpdate}
                changeSelectedServicesHandler={changeSelectedServicesHandler}
                services={services}
                selectedServices={selectedServices}
                selectedEmployee={selectedEmployee}
                setSelectedEmployee={setSelectedEmployee}
                employees={employees}
              />
            }
          </div>
          {(previousAppointments && previousAppointments.length > 0 && !isMobile) &&
              <div className={s.client_appointments}>
                  <Title title="История посещений"/>
                  <Scrollbar>
                      <div className={s.appointments_list}>
                        {
                          previousAppointments.map((appointment) => {
                            return (
                              <div className={s.appointment} key={appointment.id}>
                                <p className={s.appointment_date}>
                                  {format(new Date(appointment.date), "dd MMMM", {locale: ru})} {appointment.time.slice(0, 5)}
                                </p>
                                <p className={s.appointment_employee_name}>
                                  {appointment.doctor.surname} {appointment.doctor.first_name && appointment.doctor.first_name[0] + "."}{appointment.doctor.middle_name && appointment.doctor.middle_name[0] + "."}
                                </p>
                                {
                                  appointment.receptionProcedures.map((service) =>
                                    <p className={s.appointment_procedure} key={service.id}>
                                      {service.procedure.name} <span>{service.procedure.price}₽</span>
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
        }}>Создать</Button>}
        {mode === "update" && user.isAdmin && <Button fullWidth size="big" onClick={() => {
          updReception()
        }}>Сохранить</Button>}
      </ModalFooter>
    </Modal>
  )
}