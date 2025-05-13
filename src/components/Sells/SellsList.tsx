import React, {useContext, useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import s from './SellsList.module.scss'
import {Context} from "../../index";
import {useNavigate} from "react-router-dom";
import Pages from "../Pages/Pages";
import {classNames} from "../../shared/lib/classNames/classNames";
import { IPet, IProduct, ISell } from "@/interfaces/interfaces";
import { Button } from "@/shared/Button";
import { PetModal } from "@/widgets/PetModal";
import { getAllProducts } from "@/http/productsAPI";
import { ProductModal } from "@/widgets/ProductModal/ui/ProductModal";
import { getAllSells } from "@/http/sellsAPI";
import { SellModal } from "@/widgets/SellModal/ui/SellModal";

const SellsList = observer(() => {
    const navigate  = useNavigate()
    const {sells} = useContext(Context)
    const [handleUpdate, setHandleUpdate] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [selectedSell, setSelectedSell] = useState<ISell>()

    const {user} = useContext(Context)

    const [show, setShow] = useState(false);
    const handleClose = () => {
        setHandleUpdate(true)
        setShow(false)
        setSelectedSell(undefined)
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
        getAllSells(sells.page, 20).then((data:any) => {
            sells.setSells(data.data.rows)
            sells.setTotalCount(data.data.count)
            setHandleUpdate(false)
        })
    }, [sells.page, handleUpdate])

    const formatName = (obj: {surname: string, firstName: string, middleName: string}) => {
        return `${obj.surname}${obj.firstName ? " " + obj.firstName[0] + "." : ""}${obj.middleName ? " " + obj.middleName[0] + "." : ""}`
    }

    return(
        <div className={s.table_buttons_wrapper}>
            {show && <SellModal show={show} onClose={handleClose} sell={selectedSell} />}
            <div className={s.table_buttons_wrapper}>
                <div className={classNames(s.buttonsWrapper, {}, [isMobile ? s.right : ''])}>
                    {user.isAdmin && <Button size="small" onClick={() => handleShow()}>Добавить продажу</Button>}
                </div>
                <div className={s.table_wrapper}>
                    <div>
                        <div className={s.table}>
                            <table>
                                <thead>
                                    <tr className={s.trh}>
                                        <th className={s.tdh}>Покупатель</th>
                                        <th className={s.tdh}>Сотрудник</th>
                                        <th className={s.tdh}>Товары</th>
                                        <th className={s.tdh}>Сумма</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {sells.sells.map((sell: ISell) =>
                                    <tr className={s.trb} onClick={() => {setSelectedSell(sell); setShow(true)}}
                                        key={sell.id}>
                                        <td className={s.tdb}>{sell.client ? formatName(sell.client) : "-"}</td>
                                        <td className={s.tdb}>{formatName(sell.user)}</td>
                                        <td className={s.tdb}>{sell.saleProducts.map(sp => `${sp.product.name} (${sp.count})`).join(", ")}</td>
                                        <td className={s.tdb}>{sell.sum} ₽</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <Pages state={sells}/>
                </div>
            </div>
        </div>
    )
})

export default SellsList