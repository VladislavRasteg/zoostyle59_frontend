import React, {useContext, useEffect, useState} from "react";
import SimpleBar from 'simplebar-react';
import {observer} from "mobx-react-lite";
import s from './Group.module.scss'
import {useNavigate} from "react-router-dom";
import {CLIENTS_ROUTE} from "../../utils/consts";
import {Form, Button, Modal} from "react-bootstrap";
import {useParams} from 'react-router-dom'
import {Context} from "../../index";
import {Title} from "@/shared/Title";
import {Input} from "@/shared/Input";
import Multiselect from "@/shared/Multiselect/Multiselect";
import {IClient} from "@/interfaces/interfaces";
import {Notification} from "@arco-design/web-react";
import {getOneGroup, deleteGroup, updateGroup} from "@/http/clientAPI";
import {Button as VladButton} from "@/shared/Button";


const Group = observer(() => {
  const {id} = useParams()
  const {user, groups, clients} = useContext(Context)
  const navigate = useNavigate()

  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [selectedClients, setSelectedClients] = useState<IClient[]>([])
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    getOneGroup(id)
      .then((res: any) => {
        setGroupName(res.data?.name)
        setSelectedClients(res.data?.clients)
      })
  }, [editMode])


  const update = async () => {
    if (groupName && selectedClients?.length) {
      await updateGroup(id, groupName, selectedClients.map(c => c?.id))
      toggleEditMode()
    } else return (Notification.error({
      title: 'Ошибка',
      content: 'Заполните все поля!',
    }))
  }


  const toggleEditMode = () => {
    setEditMode(current => !current);
    if (editMode) {
      window.location.reload();
    }
  };

  const delGroup = async () => {
    try {
      await deleteGroup(id)
      navigate(`${CLIENTS_ROUTE}/groups`)
      return (Notification.success({
        title: 'Сообщение',
        content: 'Группа успешно удалена!',
      }))
    } catch (e) {
      alert(e)
    }
  }

  const backHandler = () => {
    groups.setPage(1)
    navigate(`${CLIENTS_ROUTE}/groups`)
  }

  return (
    <>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Подтверждение удаления</Modal.Title>
        </Modal.Header>
        <Modal.Body>Вы дейсивтельно хотите удалить группу: {groupName}?</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShow(false)}>
            Отменить
          </Button>
          <Button variant="danger" onClick={delGroup}>
            Удалить
          </Button>
        </Modal.Footer>
      </Modal>
      <div className={s.client_wrapper}>
        <div className={s.buttons_wrapper}>
          <Button
            className="rounded-3"
            style={{height: 50, marginTop: 22}}
            variant={"outline-secondary"} onClick={backHandler}
          >
            Назад
          </Button>
          <div className={s.buttons_together}>
            {user.isAdmin && editMode && (
              <Button
                className="rounded-3"
                style={{
                  height: 50,
                  paddingRight: 32,
                  paddingLeft: 32,
                  width: '100%'
                }}
                variant={"outline-danger"}
                onClick={() => setShow(true)}
              >
                Удалить
              </Button>
            )}
            {user.isAdmin &&
              (<Button className="rounded-3 "
                       style={{height: 50, marginTop: 22, textAlign: 'center', width: '100%'}}
                       variant={"outline-primary"}
                       onClick={toggleEditMode}>
                  {editMode ? "Отменить" : "Редактировать"}
                </Button>
              )}
          </div>
        </div>
        {!editMode ? (
            <Form className='d-flex flex-column rounded-3 gap-3' style={{width: "100%"}}>
              <div className={s.input_group}>
                <Title title="Название группы"/>
                <Input placeholder="Название группы" width='100%' offAutoComplite value={groupName}
                       onChange={setGroupName} readOnly/>
              </div>
              <div className={s.input_group}>
                <Title title="Клиенты" required/>
                <Multiselect
                  placeholder={"Выберите клиентов..."}
                  displayValue={"surname"}
                  onRemove={() => {
                  }}
                  onSelect={() => {
                  }}
                  options={[]}
                  selectedValues={selectedClients || []}
                  matchValue={"id"}
                  secondaryDisplayValue={"first_name"}
                  mobileHeading="Выберите клиентов"
                />
              </div>
            </Form>
          )
          :
          (
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
                  onRemove={setSelectedClients}
                  onSelect={setSelectedClients}
                  options={clients.clients || []}
                  selectedValues={selectedClients || []}
                  matchValue={"id"}
                  secondaryDisplayValue={"first_name"}
                  mobileHeading="Выберите клиентов"
                />
              </div>
              <VladButton fullWidth size="big" disabled={!groupName && !selectedClients?.length} onClick={update}>
                Сохранить
              </VladButton>
            </Form>
          )
        }
      </div>
    </>
  )
})

export default Group