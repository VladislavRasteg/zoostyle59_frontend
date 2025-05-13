import Modal from "@/components/Modal/Modal"
import ModalContent from "@/components/Modal/ModalContent"
import ModalFooter from "@/components/Modal/ModalFooter"
import {Button} from "@/shared/Button"
import s from './EmployeeModal.module.scss'
import {useContext, useEffect, useState} from "react"
import {Title} from "@/shared/Title"
import {Datepicker} from "@/shared/Datepicker"
import {Input} from "@/shared/Input"
import {Context} from "@/index"
import {createDoctor, deleteDoctor, updateDoctor} from "@/http/doctorsAPI"
import {listProcedures} from "@/http/proceduresAPI"
import Multiselect from "@/shared/Multiselect/Multiselect"
import {PhoneInput} from "@/shared/PhoneInput"
import {toast} from "react-toastify"
import {IPosition, IEmployee, IService} from "@/interfaces/interfaces"
import { createPosition, listPositions } from "@/http/positionsAPI"
import { Dropdown } from "react-bootstrap"
import { Switcher } from "@/shared/Switcher"

interface IModalProps {
  mode: "create" | "update"
  show: boolean
  onClose: () => void
  employee?: IEmployee
  propsSelectedServices?: IService[] | undefined
}

export const EmployeeModal = ({mode, show, onClose, employee, propsSelectedServices}: IModalProps) => {
  if (employee) {
    mode = "update"
  }

  const [showConfirmation, setShowConfirmation] = useState(false)

  const [services, setServices] = useState<IService[]>();
  const [selectedServices, setSelectedServices] = useState<IService[] | undefined>();

  // if(employee?.doctorProcedures){
  //   let services: IService[] = []
  //   employee.doctorProcedures.map((procedure) => {
  //     services.push(procedure.procedure)
  //   })
  //   setSelectedServices(services)
  // }

  const [positions, setPositions] = useState<IPosition[]>([]);

  const [surname, setSurname] = useState(employee?.surname || "");
  const [password, setPassword] = useState(employee?.password || "");
  const [isAdmin, setIsAdmin] = useState(employee?.role === "ADMINISTRATOR" || "");
  const [name, setName] = useState(employee?.firstName || "");
  const [middleName, setMiddleName] = useState(employee?.middleName || "");
  const [phone, setPhone] = useState(employee?.phone);
  const [mail, setMail] = useState(employee?.mail || "");
  const [dob, setDob] = useState<Date | undefined>(employee?.birth ? new Date(employee.birth) : undefined);
  const [positionId, setPositionId] = useState(employee?.positionId || 0);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 500)

  const [isAddPosition, setIsAddPosition] = useState(false)
  const [positionName, setPositionName] = useState(employee?.position?.name || "")
  const [newPosition, setNewPosition] = useState("")
  

  const {user} = useContext(Context)

  useEffect(() => {
    setSelectedServices(propsSelectedServices)
    listPositions(1, 100, user.currentBranch?.id).then((data: any) => {
      setPositions(data.data.positions.rows)
    })
    listProcedures(1, 100, user.currentBranch?.id).then((data: any) => {
      setServices(data.data.rows)
    })

    employee?.doctorProcedures ? 
      setSelectedServices(employee.doctorProcedures.map((procedure) => procedure.procedure)) 
      : setSelectedServices(undefined)

  }, [])

  const changeSelectedServicesHandler = (services: Array<IService>) => {
    setSelectedServices(services)
  }

  const deleteEmployeeHandler = () => {
    if(employee && employee.id){
      deleteDoctor(employee.id)
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

  const createEmployee = () => {
    if (surname && dob && positionId > 0) {
      createDoctor(surname, name, middleName, positionId, dob, phone, mail, isAdmin ? "ADMINISTRATOR" : "USER", password)
      .then((data: any) => {
        toast.success('Сотрудник добавлен')
        onClose()
      })
      .catch(e => {
        toast.error(e.message)
      })
    } else {
      toast.error('Заполните обязательные поля')
    }
  }

  const updateEmployee = () => {
    if (employee?.id && surname && dob && positionId > 0) {
      console.log(selectedServices)
      updateDoctor(employee.id, surname, name, middleName, positionId, dob, phone, mail, isAdmin ? "ADMINISTRATOR" : "USER", password)
      .then((data: any) => {
        toast.success('Данные изменены')
        onClose()
      })
      .catch(e => {
        toast.error(e.message)
      })
    } else {
      toast.error('Заполните обязательные поля')
    }
  }

  const positionCreateHandler = async () => {
    if (newPosition) {
        try {
            await createPosition(newPosition, user.currentBranch?.id).then((data: any) => {
                setPositions(positions => [...positions, data.data.position])
                setIsAddPosition(false)
                setNewPosition("")
                toast.success("Должность добавлена")
            })
        } catch (e: any) {
            toast.error(e.message)
        }
    } else {
        toast.error("Введите название должности")
    }
}


  return (
    <Modal show={show}
           name={mode === 'create' ? "Новый сотрудник" : mode === 'update' && user.isAdmin ? "Редактирование сотрудника" : "О сотруднике"}
           allowDelete={!!employee} onDelete={() => setShowConfirmation(true)}
           onClose={onClose}>
      <Modal show={showConfirmation} onClose={() => setShowConfirmation(false)} name="Подтверждение">
        <ModalContent height="110px">
          <p className={s.confirmation_text}>Вы уверены, что хотите удалить сотрудника?</p>
        </ModalContent>
        <ModalFooter>
          <Button theme="border" size="big" onClick={() => setShowConfirmation(false)} fullWidth>Отменить</Button>
          <Button fullWidth size="big" theme="dangerous" onClick={() => deleteEmployeeHandler()}>Удалить</Button>
        </ModalFooter>
      </Modal>
      <ModalContent height={"760px"} width={isMobile ? "100%" : "544px"}>
        <div className={s.modal_body}>
          <div className={s.appointment_wrapper}>
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
            <div className={s.input_group} >
              <Title required title="Дата рождения"/>
              <Datepicker placeholder="дд.мм.гггг" date={dob} setDate={setDob} showYearDropdown showMonthDropdown/>
            </div>

            <div className={s.input_group}>
              <Title title="Должность" required/>
              {/* <Select
                value={positionId || ''}
                onChange={(e: any) => setPositionId(e.target.value)}
              >

                {
                  positions && positions.map((variant) => (
                    <MenuItem key={variant.id} value={variant.id}>
                      {variant.name}
                    </MenuItem>
                  ))
                }
                <Button 
                  className={s.position_add} 
                  theme="secondary" 
                  fullWidth 
                  onClick={() => {console.log("diwqedqw")}}
                >
                  {isAddPosition ? "Отменить" : "Добавить должность"}
                </Button>
              </Select> */}

              <Dropdown>
                <Dropdown.Toggle className={s.dropdown} style={{background: "transparent", color: "#1B1D1F"}}>
                  {positionName || "Выберите должность"}
                </Dropdown.Toggle>
                <Dropdown.Menu className={s.dropdown_menu}>
                    {
                        !isAddPosition ?
                            <>
                                {positions && positions.map((position: any) =>
                                    <Dropdown.Item className={s.dropdownItem} key={position.id} onClick={() => {setPositionId(position.id); setPositionName(position.name)}}>
                                        {position.name}
                                    </Dropdown.Item>
                                )}
                                <Button fullWidth theme="secondary" style={{marginTop: 8}} onClick={() => setIsAddPosition(true)}>Добавить должность</Button>
                            </>
                            :
                            <div className={s.input_group}>
                                <Title title="Название должности" />
                                <Input placeholder="Должность" offAutoComplite value={newPosition} onChange={setNewPosition}/>
                                <Button fullWidth style={{marginTop: 8}} onClick={() => positionCreateHandler()}>Добавить</Button>
                                <Button fullWidth theme="border" onClick={() => setIsAddPosition(false)}>Отменить</Button>
                            </div>

                    }
                </Dropdown.Menu>
            </Dropdown>
            </div>

            <div className={s.input_group}>
              <Title title="Номер телефона" required/>
              <PhoneInput value={phone} onChange={setPhone}/>
            </div>
            <div className={s.input_group}>
              <Title title="Почта"/>
              <Input placeholder="Почта" offAutoComplite value={mail} onChange={setMail}/>
            </div>
            <div className={s.input_group}>
              <Title title="Пароль (6-16 символов)"/>
              <Input type="password" placeholder="Пароль" offAutoComplite value={password} onChange={setPassword}/>
            </div>
            <div className={s.input_group}>
              <Title title="Назначить администратором"/>
              <Switcher value={isAdmin} setValue={setIsAdmin}/>
            </div>
          </div>
        </div>
      </ModalContent>
      <ModalFooter>
        <Button theme="border" size="big" onClick={() => onClose()} fullWidth>Закрыть</Button>
        {mode === "create" && <Button fullWidth size="big" onClick={() => {
          createEmployee()
        }}>Добавить</Button>}
        {mode === "update" && user.isAdmin && <Button fullWidth size="big" onClick={() => {
          updateEmployee()
        }}>Сохранить</Button>}
      </ModalFooter>
    </Modal>
  )
}