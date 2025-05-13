import React, {useContext, useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import s from './GroupsList.module.scss'
import {Button, Form} from "react-bootstrap";
import {Context} from "@/index";
import {useNavigate} from "react-router-dom";
import {CLIENT_ROUTE} from "@/utils/consts";
import {ReactComponent as SearchIcon} from "./assets/icon_search.svg";
import {getAllClients} from "@/http/clientsAPI";
import Pages from "../Pages/Pages";
import {classNames} from "@/shared/lib/classNames/classNames";
import {Title} from "@/shared/Title";
import {Input} from "@/shared/Input";
import Modal from "@/components/Modal/Modal";
import ModalContent from "@/components/Modal/ModalContent";
import ModalFooter from "@/components/Modal/ModalFooter";
import {Button as VladButton} from "@/shared/Button";
import Multiselect from "@/shared/Multiselect/Multiselect";
import {IClient} from "@/interfaces/interfaces";
import {createClientGroup, getGroups} from "@/http/clientAPI";
import {Notification} from "@arco-design/web-react";

const GroupsList = observer(() => {
  const navigate = useNavigate()
  const {clients, groups, user} = useContext(Context)
  const [searchName, setSearchName] = useState("")
  const [handleUpdate, setHandleUpdate] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [selectedClients, setSelectedClients] = useState<IClient[]>([])
  const [groupName, setGroupName] = useState("");

  const [show, setShow] = useState(false);

  const handleShow = () => {
    setShow(true)
  };

  useEffect(() => {
    if (window.innerWidth < 500) {
      setIsMobile(true)
    }
  }, []);

  const onSubmit = () => {
    createClientGroup(user?.currentBranch?.id, groupName, selectedClients.map((c: IClient) => c?.id))
      .then((res: any) => {
        setShow(false)
        getGroups({branchId: user?.currentBranch?.id})
          .then((res: any) => {
            groups.setGroups(res.data)
          })
        return( Notification.success({
          title: 'Сообщение',
          content: 'Группа добавлена',
        }))
      })
      .catch((err: any) => {
        alert(err.message)
      })
  }

  //for page uploading

  useEffect(() => {
    getGroups({branchId: user?.currentBranch?.id})
      .then((res: any) => {
        groups.setGroups(res.data)
      })

    getAllClients(clients.page, 20, searchName, user.currentBranch?.id).then((data: any) => {
      clients.setClients(data.data.rows)
      clients.setTotalCount(data.data.count)
      setHandleUpdate(false)
    })
  }, [clients.page, handleUpdate])

  //for search by name (width delay) -> If typing stops for 500ms -> A search query is sent

  const selectClientHandler = (data: []) => {
    setSelectedClients(data)
  }

  return (
    <div className={s.table_buttons_wrapper}>

      {show &&
          <Modal show={show} name='Добавим группу' setShow={setShow}>
              <ModalContent height={300}>
                  <Form className='d-flex flex-column rounded-3 gap-3' style={{width: "100%"}}>
                      <div className={s.input_group}>
                          <Title title="Название группы"/>
                          <Input placeholder="Название группы" width='100%' offAutoComplite value={groupName}
                                 onChange={setGroupName}/>
                      </div>
                      <div className={s.input_group}>
                          <Title title="Клиенты" required/>
                          <Multiselect
                              placeholder={"Выберите клиентов..."}
                              displayValue={"surname"}
                              onRemove={(event) => selectClientHandler(event)}
                              onSelect={(event) => selectClientHandler(event)}
                              options={clients.clients || []}
                              selectedValues={selectedClients || []}
                              matchValue={"id"}
                              secondaryDisplayValue={"first_name"}
                              mobileHeading="Выберите клиентов"
                          />
                      </div>
                  </Form>
              </ModalContent>
              <ModalFooter>
                  <VladButton fullWidth size="big" disabled={!groupName && !selectedClients?.length} onClick={onSubmit}>
                    Добавить
                  </VladButton>
              </ModalFooter>
          </Modal>
      }

      <div className={s.table_buttons_wrapper}>
        <div className={classNames(s.buttonsWrapper, {}, [isMobile ? s.right : ''])}>
          {user.isAdmin && <Button className='p-2 pe-5 ps-5 rounded-3' variant='outline-primary' onClick={handleShow}>Добавить
              группу</Button>}
        </div>
        <div className={s.table_wrapper}>
          <div>
            <div className={s.custom_input_search}>
              <SearchIcon/>
              <input type="text" name="field-search" placeholder="Поиск" value={searchName}
                     onChange={(e) => setSearchName(e.target.value)}></input>
            </div>
            <div className={s.table}>
              <table>
                <thead>
                <tr className={s.trh}>
                  <th className={s.tdh}>Название</th>
                  <th className={s.tdh}>Клиенты</th>
                </tr>
                </thead>
                <tbody>
                {groups?.groups && groups?.groups?.map((group: any) =>
                  <tr className={s.trb} onClick={() => navigate(`${CLIENT_ROUTE}/group/${group.id}`)} key={group.id}>
                    <td className={s.tdb}>{group.name}</td>
                    <td className={s.tdb}>
                      {group?.clients.map((client: IClient) => <p>{client.surname} {client.first_name} {client.middle_name}</p>)}
                    </td>
                  </tr>
                )}
                </tbody>
              </table>
            </div>
          </div>
          <Pages state={clients}/>
        </div>
      </div>
    </div>
  )
})

export default GroupsList