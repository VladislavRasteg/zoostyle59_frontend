import React, {useContext, useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import s from './ProductsList.module.scss'
import {Context} from "../../index";
import {useNavigate} from "react-router-dom";
import {ReactComponent as SearchIcon} from "./assets/icon_search.svg";
import {getAllPets} from "../../http/petsAPI";
import Pages from "../Pages/Pages";
import {classNames} from "../../shared/lib/classNames/classNames";
import { IPet, IProduct } from "@/interfaces/interfaces";
import { Button } from "@/shared/Button";
import { PetModal } from "@/widgets/PetModal";
import { getAllProducts } from "@/http/productsAPI";
import { ProductModal } from "@/widgets/ProductModal/ui/ProductModal";

const ProductsList = observer(() => {
    const navigate  = useNavigate()
    const {products} = useContext(Context)
    const [searchName, setSearchName] = useState("")
    const [handleUpdate, setHandleUpdate] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<IProduct>()

    const {user} = useContext(Context)

    const [show, setShow] = useState(false);
    const handleClose = () => {
        setHandleUpdate(true)
        setShow(false)
        setSelectedProduct(undefined)
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
        getAllProducts(products.page, 20, searchName).then((data:any) => {
            products.setProducts(data.data.rows)
            products.setTotalCount(data.data.count)
            setHandleUpdate(false)
        })
    }, [products.page, handleUpdate])


    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            products.setPage(1)
            getAllProducts(products.page, 20, searchName).then((data:any) => {
                products.setProducts(data.data.rows)
                products.setTotalCount(data.data.count)
            })
        }, 500)

        return () => clearTimeout(delayDebounceFn)
    }, [searchName])


    return(
        <div className={s.table_buttons_wrapper}>
            {show && <ProductModal show={show} onClose={handleClose} product={selectedProduct} />}
            <div className={s.table_buttons_wrapper}>
                <div className={classNames(s.buttonsWrapper, {}, [isMobile ? s.right : ''])}>
                    {user.isAdmin && <Button size="small" onClick={() => handleShow()}>Добавить товар</Button>}
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
                                        <th className={s.tdh}>Цена</th>
                                        <th className={s.tdh}>Количество</th>
                                        <th className={s.tdh}>Тип товара</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {products.products.map((product: IProduct) =>
                                    <tr className={s.trb} onClick={() => {setSelectedProduct(product); setShow(true)}}
                                        key={product.id}>
                                        <td className={s.tdb}>{product.name}</td>
                                        <td className={s.tdb}>{product.price} ₽</td>
                                        <td className={s.tdb}>{product.count}</td>
                                        <td className={s.tdb}>{product.isForService ? "Для услуг" : "Для продажи"}</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <Pages state={products}/>
                </div>
            </div>
        </div>
    )
})

export default ProductsList