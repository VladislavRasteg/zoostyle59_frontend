import React, {useContext, useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import s from './ClientsList.module.scss'
import {Context} from "../../index";
import {useNavigate} from "react-router-dom";
import {ReactComponent as SearchIcon} from "./assets/icon_search.svg";
import {getAllClients} from "../../http/clientsAPI";
import Pages from "../Pages/Pages";
import {classNames} from "../../shared/lib/classNames/classNames";
import { ClientModal } from "@/widgets/ClientModal";
import { IClient } from "@/interfaces/interfaces";
import { Button } from "@/shared/Button";

const ClientsList = observer(() => {
    const navigate  = useNavigate()
    const {clients} = useContext(Context)
    const [searchName, setSearchName] = useState("")
    const [handleUpdate, setHandleUpdate] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [selectedClient, setSelectedClient] = useState<IClient>()

    const {user} = useContext(Context)

    const [show, setShow] = useState(false);
    const handleClose = () => {
        setHandleUpdate(true)
        setShow(false)
        setSelectedClient(undefined)
    };
    const handleShow = () => {
        setShow(true)
    };

    useEffect(() => {
        if(window.innerWidth < 500){
            setIsMobile(true)
        }
    }, []);


    useEffect(() => {
        getAllClients(clients.page, 20, searchName).then((data:any) => {
            clients.setClients(data.data.rows)
            clients.setTotalCount(data.data.count)
            setHandleUpdate(false)
        })
    }, [clients.page, handleUpdate])


    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            clients.setPage(1)
            getAllClients(clients.page, 20, searchName).then((data:any) => {
                clients.setClients(data.data.rows)
                clients.setTotalCount(data.data.count)
            })
        }, 500)

        return () => clearTimeout(delayDebounceFn)
    }, [searchName])


    return(
        <div className={s.table_buttons_wrapper}>
            {show && <ClientModal show={show} onClose={handleClose} client={selectedClient} />}
            <div className={s.table_buttons_wrapper}>
                <div className={classNames(s.buttonsWrapper, {}, [isMobile ? s.right : ''])}>
                    {user.isAdmin && <Button size="small" onClick={() => handleShow()}>Добавить клиента</Button>}
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
                                        <th className={s.tdh}>Фамилия</th>
                                        <th className={s.tdh}>Имя</th>
                                        <th className={s.tdh}>Отчество</th>
                                        <th className={s.tdh}>Дата рождения</th>
                                        <th className={s.tdh}>Номер телефона</th>
                                        <th className={s.tdh}>Почта</th>
                                        <th className={s.tdh}>Сумма</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {clients.clients.map((client: any) =>
                                    <tr className={s.trb} onClick={() => {setSelectedClient(client); setShow(true)}}
                                        key={client.id}>
                                        <td className={s.tdb}>{client.surname}</td>
                                        <td className={s.tdb}>{client.firstName}</td>
                                        <td className={s.tdb}>{client.middleName}</td>
                                        <td className={s.tdb}>{client.birth && (client.birth).split("-").reverse().join(".")}</td>
                                        <td className={s.tdb}>{client.phone}</td>
                                        <td className={s.tdb}>{client.mail}</td>
                                        <td className={s.tdb}>{client.total} ₽</td>
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

export default ClientsList