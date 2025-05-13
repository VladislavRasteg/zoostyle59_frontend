import React, {useContext, useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import s from './Positions.module.scss'
import {Context} from "../../index";
import Pages from "../Pages/Pages";
import {listPositions, updatePosition, deletePosition, createPosition} from "../../http/positionsAPI";
import {Dropdown, Form, Modal} from "react-bootstrap";
import {Notification} from "@arco-design/web-react";
import { Button } from "@/shared/Button";

const Positions = observer(() => {
    const {user} = useContext(Context)
    const {positions} = useContext(Context)

    const [show, setShow] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    const [positionId, setPositionId] = useState(0)
    const [positionName, setPositionName] = useState("")
    const [positionUpdates, setPositionUpdates] = useState(false);

    const [isAdd, setIsAdd] = useState(false)

    useEffect(() => {
        listPositions(positions.page, 20, user.currentBranch?.id).then((data: any) => {
            positions.setPositions(data.data.positions.rows)
            positions.setTotalCount(data.data.positions.count)
            setPositionUpdates(false)
        })
    }, [positions.page, positionUpdates])

    const handleClose = () => {
        setShow(false)
        setTimeout(() => {
            setIsAdd(false)
        }, 300)
    }

    const handleShow = (position = {id: 0, name: ""}) => {
        if(position.id == 0){
            setIsAdd(true)
        }
        setPositionId(position.id)
        setPositionName(position.name)
        setShow(true)
    };

    const positionUpdateHandler = async () => {
        try{
            await updatePosition(positionId, positionName, user.currentBranch?.id).then(() => {
                setPositionUpdates(true)
                handleClose()
                return( Notification.success({
                    title: 'Сообщение',
                    content: 'Данные изменены',
                }))
            })
        } catch(e) {
            alert(e)
        }
    }

    const positionsDeleteHandler = async () => {
        try{
            await deletePosition(positionId, user.currentBranch?.id).then(() => {
                setPositionUpdates(true)
                setShowDelete(false)
                handleClose()
                return( Notification.info({
                    title: 'Удаление',
                    content: 'Должность удалена',
                }))
            })
        } catch(e) {
            alert(e)
        }
    }

    const positionCreateHandler = async () => {
        if(positionName){
            try{
                await createPosition(positionName, user.currentBranch?.id).then(() => {
                    setPositionUpdates(true)
                    handleClose()
                    setIsAdd(false)
                    return( Notification.success({
                        title: 'Сообщение',
                        content: 'Должность добавлена',
                    }))
                })
            } catch(e: any) {
                return( Notification.error({
                    title: 'Ошибка',
                    content: e.message,
                }))
            }
        } else {
            return( Notification.error({
                title: 'Ошибка',
                content: 'Заполните все обязательные поля!',
            }))
        }
    }


    return (
        <>
            <Modal show={showDelete} onHide={() => setShowDelete(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Подтверждение удаления</Modal.Title>
                </Modal.Header>
                <Modal.Body>Вы дейсивтельно хотите удалить должность: "{positionName}"?</Modal.Body>
                <Modal.Footer>
                    <Button theme="primary" onClick={() => setShowDelete(false)}>
                        Отменить
                    </Button>
                    <Button theme="dangerous" onClick={positionsDeleteHandler}>
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
                    <Modal.Title>{isAdd ? "Добавление должности" : "Редактирование должности"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {!isAdd && (<div className='w-100 d-flex flex-row justify-content-end'>
                        <Button theme='dangerous' size="small" onClick={() => setShowDelete(true)}>Удалить должность</Button>
                    </div>)}
                    <Form.Label style={{textAlign:"left"}}>Название должности</Form.Label>
                    <Form.Control className="rounded-3" placeholder='Название должности...' value={positionName} onChange={event => setPositionName(event.target.value)} style={{height: 42, background: "#EDF3FC"}}  />
                </Modal.Body>
                <Modal.Footer>
                    <Button theme="primary" fullWidth size="big" onClick={isAdd ? positionCreateHandler : positionUpdateHandler}>
                        {isAdd ? "Добавить" : "Сохранить"}
                    </Button>
                </Modal.Footer>
            </Modal>
            <div className={s.table_buttons_wrapper}>
                <Button size="small" onClick={() => handleShow()}>Добавить должность</Button>
                <div className={s.table_wrapper}>
                    <div className={s.table}>
                        <table>
                            <thead>
                                <tr className={s.trh}>
                                    <th className={s.tdh}>Название должности</th>
                                </tr>
                            </thead>
                            <tbody className={s.tb}>
                                {positions.positions.map((position: any) =>
                                    <tr className={s.trb} onClick={() => handleShow(position)} key={position.id}>
                                        <td className={s.tdb}>{position.name}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <Pages state={positions}/>
                </div>
            </div>
        </>
    )
})

export default Positions