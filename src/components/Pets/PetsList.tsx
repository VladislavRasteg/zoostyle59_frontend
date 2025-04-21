import React, {useContext, useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import s from './PetsList.module.scss'
import {Context} from "../../index";
import {useNavigate} from "react-router-dom";
import {ReactComponent as SearchIcon} from "./assets/icon_search.svg";
import {getAllPets} from "../../http/petsAPI";
import Pages from "../Pages/Pages";
import {classNames} from "../../shared/lib/classNames/classNames";
import { IPet } from "@/interfaces/interfaces";
import { Button } from "@/shared/Button";
import { PetModal } from "@/widgets/PetModal";

const PetsList = observer(() => {
    const navigate  = useNavigate()
    const {pets} = useContext(Context)
    const [searchName, setSearchName] = useState("")
    const [handleUpdate, setHandleUpdate] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [selectedPet, setSelectedPet] = useState<IPet>()

    const {user} = useContext(Context)

    const [show, setShow] = useState(false);
    const handleClose = () => {
        setHandleUpdate(true)
        setShow(false)
        setSelectedPet(undefined)
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
        getAllPets(pets.page, 20, searchName).then((data:any) => {
            pets.setPets(data.data.rows)
            pets.setTotalCount(data.data.count)
            setHandleUpdate(false)
        })
    }, [pets.page, handleUpdate])


    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            pets.setPage(1)
            getAllPets(pets.page, 20, searchName).then((data:any) => {
                pets.setPets(data.data.rows)
                pets.setTotalCount(data.data.count)
            })
        }, 500)

        return () => clearTimeout(delayDebounceFn)
    }, [searchName])


    return(
        <div className={s.table_buttons_wrapper}>
            {show && <PetModal show={show} onClose={handleClose} pet={selectedPet} />}
            <div className={s.table_buttons_wrapper}>
                <div className={classNames(s.buttonsWrapper, {}, [isMobile ? s.right : ''])}>
                    {user.isAdmin && <Button size="small" onClick={() => handleShow()}>Добавить питомца</Button>}
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
                                        <th className={s.tdh}>Кличка</th>
                                        <th className={s.tdh}>Порода</th>
                                        <th className={s.tdh}>Пол</th>
                                        <th className={s.tdh}>Возраст</th>
                                        <th className={s.tdh}>Клиент</th>
                                        <th className={s.tdh}>Сумма</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {pets.pets.map((pet: IPet) =>
                                    <tr className={s.trb} onClick={() => {setSelectedPet(pet); setShow(true)}}
                                        key={pet.id}>
                                        <td className={s.tdb}>{pet.name}</td>
                                        <td className={s.tdb}>{pet.breed}</td>
                                        <td className={s.tdb}>{pet.sex}</td>
                                        <td className={s.tdb}>{pet.birth && (pet.birth).split("-").reverse().join(".")}</td>
                                        <td className={s.tdb}>{`${pet.client?.surname}${pet.client?.firstName ? ' '+pet.client?.firstName : ''}`}</td>
                                        <td className={s.tdb}>{pet.appointmentsTotal} ₽</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <Pages state={pets}/>
                </div>
            </div>
        </div>
    )
})

export default PetsList