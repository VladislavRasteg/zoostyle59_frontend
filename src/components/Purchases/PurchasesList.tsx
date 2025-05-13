import React, {useContext, useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import s from './PurchasesList.module.scss'
import {Context} from "../../index";
import {useNavigate} from "react-router-dom";
import Pages from "../Pages/Pages";
import {classNames} from "../../shared/lib/classNames/classNames";
import { Button } from "@/shared/Button";
import { IPurchase } from "@/interfaces/interfaces";
import { getAllPurchases } from "@/http/purchaseAPI";
import { PurchaseModal } from "@/widgets/PurchaseModal";

const PurchasesList = observer(() => {
    const navigate  = useNavigate()
    const {purchases} = useContext(Context)
    const [handleUpdate, setHandleUpdate] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [selectedPurchase, setSelectedPurchase] = useState<IPurchase>()

    const {user} = useContext(Context)

    const [show, setShow] = useState(false);
    const handleClose = () => {
        setHandleUpdate(true)
        setShow(false)
        setSelectedPurchase(undefined)
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
        getAllPurchases(purchases.page, 20).then((data:any) => {
            purchases.setPurchases(data.data.rows)
            purchases.setTotalCount(data.data.count)
            setHandleUpdate(false)
        })
    }, [purchases.page, handleUpdate])

    const formatName = (obj: {surname: string, firstName: string, middleName: string}) => {
        return `${obj.surname}${obj.firstName ? " " + obj.firstName[0] + "." : ""}${obj.middleName ? " " + obj.middleName[0] + "." : ""}`
    }

    return(
        <div className={s.table_buttons_wrapper}>
            {show && <PurchaseModal show={show} onClose={handleClose} sell={selectedPurchase} />}
            <div className={s.table_buttons_wrapper}>
                <div className={classNames(s.buttonsWrapper, {}, [isMobile ? s.right : ''])}>
                    {user.isAdmin && <Button size="small" onClick={() => handleShow()}>Новая закупка</Button>}
                </div>
                <div className={s.table_wrapper}>
                    <div>
                        <div className={s.table}>
                            <table>
                                <thead>
                                    <tr className={s.trh}>
                                        <th className={s.tdh}>Сотрудник</th>
                                        <th className={s.tdh}>Товары</th>
                                        <th className={s.tdh}>Сумма</th>
                                        <th className={s.tdh}>Заметка</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {purchases.purchases.map((purchases: IPurchase) =>
                                    <tr className={s.trb} onClick={() => {setSelectedPurchase(purchases); setShow(true)}}
                                        key={purchases.id}>
                                        <td className={s.tdb}>{formatName(purchases.user)}</td>
                                        <td className={s.tdb}>{purchases.purchaseProducts.map(sp => `${sp.product.name} (${sp.count})`).join(", ")}</td>
                                        <td className={s.tdb}>{purchases.sum} ₽</td>
                                        <td className={s.tdb}>{purchases.note}</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <Pages state={purchases}/>
                </div>
            </div>
        </div>
    )
})

export default PurchasesList