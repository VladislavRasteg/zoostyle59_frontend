import { Title } from "@/shared/Title"
import s from "./AppointmentModal.module.scss"
import { Input } from "@/shared/Input"
import { IClient, IEmployee, IService } from "@/interfaces/interfaces"
import { Button } from "@/shared/Button"
import { useEffect, useState } from "react"
import { ClientModal } from "@/widgets/ClientModal"
import { AbonementCard } from "@/futures/Abonement/ui/AbonementCard"
import { AbonementModal } from "@/widgets/AbonementModals/AbonementModal"
import Multiselect from "@/shared/Multiselect/Multiselect"
import { MenuItem, Select } from "@/shared/Select"

interface IAbonementForm{
    searchClient: string
    setSearchClient: (name: string) => void
    searchResult: IClient[] | undefined
    selectClientHandler: (client: IClient) => void
    setSearchResult: (clients: IClient[] | undefined) => void
    selectedClient?: IClient
    user: any
    changeSelectedServicesHandler: (service: IService[]) => void
    services: IService[] | undefined
    selectedServices: IService[] | undefined
    update: boolean
    setUpdate: (update: boolean) => void
    clientName: string
    setClientName: (name: string) => void
    selectedEmployee: number
    setSelectedEmployee: (id: number) => void
    employees: IEmployee[] | undefined
}


export const AbonementForm = ({
    searchClient,
    setSearchClient,
    searchResult,
    setSearchResult,
    selectClientHandler,
    selectedClient,
    user,
    update,
    setUpdate,
    changeSelectedServicesHandler,
    services,
    selectedServices,
    selectedEmployee,
    setSelectedEmployee,
    employees
}: IAbonementForm) => {

    const [showCreateClient, setShowCreateClient] = useState(false)
    const [showAbonementModal, setShowAbonementModal] = useState(false)

    useEffect(() => {
        console.log("update")
        console.log(services)
    }, [services])

    const closeModalHandler = (client?: IClient) => {
        client && selectClientHandler(client)
        setShowCreateClient(false)
    }

    const closeAbonementHandler = () => {
        setUpdate(!update)
        setShowAbonementModal(false)
    }

    return(
        <div>
            {showCreateClient && <ClientModal show={showCreateClient} onClose={closeModalHandler}/>}
            {showAbonementModal && <AbonementModal show={showAbonementModal} onClose={closeAbonementHandler} clientId={selectedClient?.id}/>}
            <div className={s.appointment_wrapper}>
            <div className={s.input_group}>
                        <Title title="Найти клиента по фамилии"/>
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
                        {
                        !selectedClient ?
                            user.isAdmin && <Button theme="secondary" fullWidth onClick={() => setShowCreateClient(true)}>Создать клиента</Button>
                          :
                          <div className={s.appointment_wrapper}>
                            <div className={s.client_block_wrapper}>
                                <div className={s.client_block}>
                                    <p className={s.search_name}>
                                        {selectedClient.surname} {selectedClient.first_name} {selectedClient.middle_name}
                                    </p>
                                {selectedClient.phone && <p className={s.search_secondary}>{selectedClient.phone}</p>}
                                {selectedClient.mail && <p className={s.search_secondary}>{selectedClient.mail}</p>}
                                </div>
                                {
                                    selectedClient.activeAbonement ?
                                        <AbonementCard className={s.card_on_color} updateHandler={() => {setUpdate(!update)}} abonement={selectedClient.activeAbonement}/>
                                    :
                                        <div className={s.abonement_error}>
                                            <p className={s.abonement_error_text}>
                                                У клиента нет абонемента
                                            </p>
                                            <Button fullWidth onClick={() => setShowAbonementModal(true)}>Выдать абонемент</Button>
                                        </div>
                                }
                                {user.isAdmin &&
                                    <Button fullWidth theme="tetrinary" onClick={() => setShowCreateClient(true)}>Создать нового клиента</Button>
                                }
                            </div>
                            {selectedClient.activeAbonement &&
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
                                </div>
                            }
                            
                        </div>
                      }
                      </div>
            </div>
        </div>
    )
}