import React, {useContext, useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import s from './Users.module.scss'
import {Context} from "../../index";
import Pages from "../Pages/Pages";
import {Dropdown, Form, Modal} from "react-bootstrap";
import {listUsers, updateUser, deleteUser} from "../../http/userAPI";
import {Notification} from "@arco-design/web-react";
import {createInvite, listInvited, deleteInvite} from "../../http/inviteAPI";
import {Switcher} from "../../shared/Switcher";
import { Button } from "@/shared/Button";

const Users = observer(() => {
    const {users} = useContext(Context)
    const {user} = useContext(Context)

    //modal fields
    const [show, setShow] = useState(false);
    const [showInvite, setShowInvite] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    const [invitedUsers, setInvitedUsers] = useState([])

    const [userId, setUserId] = useState(0)
    const [login, setLogin] = useState("")
    const [name, setName] = useState("")
    const [role, setRole] = useState("")

    const [inviteMail, setInviteMail] = useState('')
    const [inviteName, setInviteName] = useState('')
    const [inviteIsAdmin, setInviteIsAdmin] = useState(false)


    //login validation
    const [loginDirty, setLoginDirty] = useState(false)
    const [loginError, setLoginError] = useState('')
    const [formValid, setFormValid] = useState(true)

    const [manuallyUpdated, setManuallyUpdated] = useState(false)

    useEffect(() => {
        if (loginError) {
            setFormValid(false)
        } else {
            setFormValid(true)
        }

    }, [loginError])

    useEffect(() => {
        listUsers(users.page, 20).then((data: any) => {
            users.setUsers(data.data)
            users.setTotalCount(data.data.length)
        })
        listInvited(user.currentBranch?.id).then((data: any) => {
            setInvitedUsers(data.invites)
        })
    }, [users.page, show, showInvite, manuallyUpdated])

    //show modal control
    const handleClose = () => {
        setShow(false)
    }
    const handleShow = (user: any) => {
        setUserId(user.id)
        setRole(user.role)
        setLogin(user.login)
        setName(user.name)
        setShow(true)
    };

    console.log(users)

    const showInviteModalHandler = () => {
        setInviteMail('')
        setInviteName('')
        setInviteIsAdmin(false)
        setShowInvite(true)
    }

    const closeInviteModalHandler = () => {
        setShowInvite(false)
    }

    const loginHandler = (e: string) => {
        setLogin(e)
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (!re.test(String(e).toLowerCase())) {
            setLoginError('Некорректная почта')
            if (!e) {
                setLoginError('Почта не может быть пустой')
            }

        } else {
            setLoginError('')
        }
    }

    const updateUserHandler = async () => {
        await updateUser(userId, login, name, role, user.currentBranch?.id)
        handleClose()
        return (Notification.success({
            title: 'Сообщение',
            content: 'Данные изменены',
        }))
    }

    const validateEmail = () => {
        return String(inviteMail)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const inviteUserHandler = async () => {
        if (!inviteName) {
            return (Notification.error({
                title: 'Ошибка',
                content: 'Укажите имя пользователя!',
            }))
        } else if (!validateEmail()) {
            return (Notification.error({
                title: 'Ошибка',
                content: 'Ошибка в почте пользователя!',
            }))
        } else {
            await createInvite(user.currentBranch?.id, inviteName, inviteMail, inviteIsAdmin).then((data: string) => {
                closeInviteModalHandler()
                return (Notification.success({
                    title: 'Сообщение',
                    content: 'Приглагшение отправлено на почту пользователя',
                }))
            })
        }
    }

    const deleteInviteHandler = async (user: any) => {
        await deleteInvite(user.id, user.link).then(() => {
            setManuallyUpdated(!manuallyUpdated)
            return (Notification.success({
                title: 'Сообщение',
                content: 'Приглашение отменено',
            }))
        })
    }

    const deleteUserHandler = async () => {
        await deleteUser(userId, user.currentBranch?.id).then(() => {
            setShowDelete(false)
            handleClose()
            setManuallyUpdated(!manuallyUpdated)
            return (Notification.success({
                title: 'Сообщение',
                content: 'Пользователь удален',
            }))
        })
    }

    return (
        <>
            <Modal show={showDelete} onHide={() => setShowDelete(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Подтверждение удаления</Modal.Title>
                </Modal.Header>
                <Modal.Body>Вы дейсивтельно хотите удалить сотрудника: {name} ({login})?</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setShowDelete(false)}>
                        Отменить
                    </Button>
                    <Button variant="danger" onClick={deleteUserHandler}>
                        Удалить
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={show}
                   onHide={handleClose}
                   aria-labelledby="contained-modal-title-vcenter"
                   centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Редактирование пользователя</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='w-100 d-flex flex-row justify-content-end'>
                        <Button theme='dangerous' size="small" onClick={() => setShowDelete(true)}>
                            Удалить пользователя
                        </Button>
                    </div>
                    <Form.Label style={{textAlign: "left"}}>Имя</Form.Label>
                    <Form.Control onBlur={() => setLoginDirty(true)} className="rounded-3" placeholder='Имя'
                                  value={name} onChange={e => setName(e.target.value)}
                                  style={{height: 42, background: "#EDF3FC"}}/>
                    <Form.Label style={{textAlign: "left"}}>Почта</Form.Label>
                    <Form.Control onBlur={() => setLoginDirty(true)} className="rounded-3" placeholder='Почта'
                                  value={login} onChange={e => loginHandler(e.target.value)}
                                  style={{height: 42, background: "#EDF3FC"}}/>
                    {(loginDirty && loginError) && <div
                        className='text-bg-danger bg-opacity-50 text-lg-start p-1 mt-1 rounded-1'>{loginError}</div>}
                    <Form.Label style={{textAlign: "left", marginTop: 12}}>Роль</Form.Label>
                    <Dropdown>
                        <Dropdown.Toggle
                            className='d-flex w-100 justify-content-between align-items-center'
                            style={{height: 42, background: "#EDF3FC", color: "#435875", border: "1px solid #D1D6E1"}}
                        >
                            {role == 'USER' ? "Врач" : role == 'ADMINISTRATOR' ? "Администратор" : "Ожидание"}
                        </Dropdown.Toggle>
                        <Dropdown.Menu className='w-100'>
                            <Dropdown.Item onClick={() => setRole("WAITER")}>Ожидание</Dropdown.Item>
                            <Dropdown.Item onClick={() => setRole("USER")}>Врач</Dropdown.Item>
                            <Dropdown.Item onClick={() => setRole("ADMINISTRATOR")}>Администратор</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Modal.Body>
                <Modal.Footer>
                    <Button theme="primary" size="big" fullWidth onClick={updateUserHandler}
                            disabled={!formValid}>
                        Сохранить
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showInvite}
                   onHide={closeInviteModalHandler}
                   aria-labelledby="contained-modal-title-vcenter"
                   centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Добавить сотрудника</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Label style={{textAlign: "left"}}>Имя сотрудника</Form.Label>
                    <Form.Control onBlur={() => setLoginDirty(true)} className="rounded-3"
                                  placeholder='Укажите имя сотрудника' value={inviteName}
                                  onChange={e => setInviteName(e.target.value)}
                                  style={{height: 42, background: "#EDF3FC"}}/>
                    <Form.Label style={{textAlign: "left", marginTop: 12}}>Почта</Form.Label>
                    <Form.Control onBlur={() => setLoginDirty(true)} className="rounded-3"
                                  placeholder='Укажите почту сотрудника' value={inviteMail}
                                  onChange={e => setInviteMail(e.target.value)}
                                  style={{height: 42, background: "#EDF3FC"}}/>
                    <Form.Label style={{textAlign: "left", marginTop: 12}}>Назначить администратором</Form.Label>
                    <Switcher value={inviteIsAdmin} setValue={setInviteIsAdmin}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button theme="primary" size="big" fullWidth onClick={inviteUserHandler}
                            disabled={!formValid}>
                        Добавить
                    </Button>
                </Modal.Footer>
            </Modal>
            <div className={s.table_buttons_wrapper}>
                <Button size="small" onClick={showInviteModalHandler}>
                    Добавить сотрудника
                </Button>
                <div className={s.table_wrapper}>
                    <div className={s.table}>
                        <table>
                            <thead>
                                <tr className={s.trh}>
                                    <th className={s.tdh}>Имя</th>
                                    <th className={s.tdh}>Почта</th>
                                    <th className={s.tdh}>Роль</th>
                                </tr>
                            </thead>
                            <tbody>
                            {invitedUsers && invitedUsers.map((user: any) =>
                                user.isActive && (
                                    <tr className={s.trb} style={{backgroundColor: '#F5F6F8'}} key={user.id}>
                                        <td className={s.tdb}>{user.personName}</td>
                                        <td className={s.tdb}>{user.personMail}</td>
                                        <td className={s.tdb}>Ожидание</td>
                                        <Button
                                            theme="secondary"
                                            className={s.removeButton}
                                            onClick={() => deleteInviteHandler(user)}
                                        >
                                            Отменить
                                        </Button>
                                    </tr>
                                )
                            )}
                            {users.users.map((user: any) =>
                                <tr className={s.trb} onClick={() => handleShow(user)} key={user.id}>
                                    <td className={s.tdb}>{user.name}</td>
                                    <td className={s.tdb}>{user.login}</td>
                                    <td className={s.tdb}>{user.role === 'USER' ? "Врач" : user.role === 'ADMINISTRATOR' ? "Администратор" : "Ожидание"}</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                    <Pages state={users}/>
                </div>
            </div>
        </>
    )
})

export default Users