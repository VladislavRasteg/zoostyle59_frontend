import Modal from "@/components/Modal/Modal"
import ModalContent from "@/components/Modal/ModalContent"
import ModalFooter from "@/components/Modal/ModalFooter"
import {Button} from "@/shared/Button"
import s from './PurchaseModal.module.scss'
import {useEffect, useState} from "react"
import {Title} from "@/shared/Title"
import {Input} from "@/shared/Input"
import {toast} from "react-toastify"
import {IEmployee, IProduct, IPurchase} from "@/interfaces/interfaces"
import { MenuItem, Select } from "@/shared/Select"
import {getAllProducts} from "@/http/productsAPI"
import Multiselect from "@/shared/Multiselect/Multiselect"
import { listDoctors } from "@/http/doctorsAPI"
import { createPurchase, deletePurchase, updatePurchase } from "@/http/purchaseAPI"

interface IModalProps {
  show: boolean
  onClose: () => void
  sell?: IPurchase
}

export const PurchaseModal = ({show, onClose, sell}: IModalProps) => {

  const [showConfirmation, setShowConfirmation] = useState(false)
  
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 500)
  
  const [products, setProducts] = useState<Array<IProduct>>()
  const [users, setUsers] = useState<Array<IEmployee>>()
  const [note, setNote] = useState(sell?.note || "")
  const [selectedEmployee, setSelectedEmployee] = useState<number | undefined>(sell?.user.id)
  const [selectedProducts, setSelectedProducts] = useState<Array<IProduct> | undefined>(sell?.purchaseProducts.map(sp => sp.product)) 

  const [sellProducts, setSellProducts] = useState<{name: string, price: number, count: number, productId: number}[] | undefined>(
    sell?.purchaseProducts.map(sp =>  {return({
      name: sp.product.name, price: sp.product.price, count: sp.count, productId: sp.product.id
    })})
  )

  const [sum, setSum] = useState(sell?.sum || 0)
  
  useEffect(() => {
    getAllProducts(1, 9999)
    .then((data: any) => {
      setProducts(data.data.rows)
    })
    listDoctors(1, 9999)
    .then((data: any) => {
      setUsers(data.data.rows)
    })
  }, [])

  const deletePurchaseHandler = () => {
    if(sell && sell.id){
      deletePurchase(sell.id)
      .then(() => {
        toast.success('Закупка удалена')
        onClose()
      })
      .catch(e => {
        toast.error(e.message)
      })
    } else {
      toast.error('Не передан идентификатор покупки')
    }
  }

  const selectProductsHandler = (products: IProduct[]) => {
    setSelectedProducts(products)

    const productsToSell = products.map((product) => {
      const selected = sellProducts?.find(sp => sp.productId === product.id)
      return({
        name: product.name,
        price: product.price,
        ...(selected ? {count: selected.count} : {count: 1}),
        productId: product.id
      })
    })
    setSum(productsToSell.reduce((accum, item) => accum + item.price * item.count, 0))
    setSellProducts(productsToSell)
  }

  const decrementItemHandler = (id: number) => {
    const updatedProducts: any = sellProducts?.map((sp) => {
      if (sp.productId !== id) {
        return sp;
      }
  
      if (sp.count > 1) {
        return { ...sp, count: sp.count - 1 };
      }
      
      const updatedSelectedProducts = selectedProducts?.filter(product => product.id != id)
      setSelectedProducts(updatedSelectedProducts)
      return null;
    }).filter((sp) => sp !== null);
  
    setSum(updatedProducts.reduce((accum, item) => accum + item.price * item.count, 0))
    setSellProducts(updatedProducts);
  }

  const incrementItemHandler = (id: number) => {
    const updatedProducts: any = sellProducts?.map((sp) => {
      if(sp.productId != id){
        return sp
      }
      
      return {...sp, count: sp.count += 1}
    })

    setSum(updatedProducts.reduce((accum, item) => accum + item.price * item.count, 0))
    setSellProducts(updatedProducts)
  }

  const createSellHandler = () => {
    if (sum && sellProducts && sellProducts.length > 0 && selectedEmployee) {
      createPurchase(selectedEmployee, note, sum, sellProducts)
      .then((data: any) => {
        toast.success('Закупка добавлена')
        onClose()
      })
      .catch(e => {
        toast.error(e.message)
      })
    } else {
      toast.error('Заполните обязательные поля')
    }
  }

  const updateSellHandler = () => {
    if (sell?.id && sum && sellProducts && sellProducts.length > 0 && selectedEmployee) {
      updatePurchase(sell.id, selectedEmployee, note, sum, sellProducts)
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

  return (
    <Modal show={show} name={sell ? "Редактирование закупки" : "Новая закупка"} onDelete={() => setShowConfirmation(true)} allowDelete={!!sell} onClose={onClose}>
      <Modal show={showConfirmation} onClose={() => setShowConfirmation(false)} name="Подтверждение">
        <ModalContent height="110px">
          <p className={s.confirmation_text}>Вы уверены, что хотите удалить закупку?</p>
        </ModalContent>
        <ModalFooter>
          <Button theme="border" size="big" onClick={() => setShowConfirmation(false)} fullWidth>Отменить</Button>
          <Button fullWidth size="big" theme="dangerous" onClick={() => deletePurchaseHandler()}>Удалить</Button>
        </ModalFooter>
      </Modal>
      <ModalContent 
        height={"360px"} 
        width={isMobile ? "100%" : "544px"}>
        <div className={s.modal_body}>
          <div className={s.appointment_wrapper}>
            
          <div className={s.input_group}>
              <Title title="Список товаров"/>
              <Multiselect
                placeholder={"Выберите товары"}
                displayValue={"name"}
                onRemove={(event) => {
                  selectProductsHandler(event)
                }}
                onSelect={(event) => {
                  selectProductsHandler(event)
                }}
                options={products || []}
                selectedValues={selectedProducts || []}
                matchValue={"id"}
                secondaryDisplayValue={"price"}
                secondaryDisplayValueName={"₽"}
                mobileHeading="Выбор товаров"
              />
              {
                (sellProducts && sellProducts.length > 0) && sellProducts.map((product) => {
                  return(
                    <div className={s.product_card}>
                      <div className={s.product_info}>
                        {product.name}
                        <p className={s.product_price}>{product.price} ₽</p>
                      </div>
                      <div className={s.itemControls}>
                    <button
                      className={s.qtyBtn}
                      onClick={() => decrementItemHandler(product.productId)}
                      aria-label="Минус один"
                    >
                      −
                    </button>
                    <span className={s.qtyValue}>{product.count}</span>
                    <button
                      className={s.qtyBtn}
                      onClick={() => incrementItemHandler(product.productId)}
                      aria-label="Плюс один"
                    >
                      +
                    </button>
                  </div>
                    </div>
                  )
                })
              }
            </div>
            <div className={s.input_group}>
                <Title title="Сумма"/>
                <Input type="number" value={sum} onChange={setSum}/>
            </div> 
            <div className={s.input_group}>
                <Title title="Сотрудник"/>
                <Select
                  value={selectedEmployee || ''}
                  onChange={(e: any) => setSelectedEmployee(e.target.value)}
                >
                  {
                    users && users.map((variant) => (
                      <MenuItem key={variant.id} value={variant.id}>
                        {variant.surname} {variant.firstName} {variant.middleName}
                      </MenuItem>
                    ))
                  }
                </Select>
              </div>
              <div className={s.input_group}>
                <Title title="Заметка"/>
                <Input value={note} onChange={setNote}/>
            </div> 
          </div>
        </div>
      </ModalContent>
      <ModalFooter>
        <Button theme="border" size="big" onClick={() => onClose()} fullWidth>Закрыть</Button>
        {!sell && <Button fullWidth size="big" onClick={() => {
          createSellHandler()
        }}>Добавить</Button>}
        {sell && <Button fullWidth size="big" onClick={() => {
          updateSellHandler()
        }}>Сохранить</Button>}
      </ModalFooter>
    </Modal>
  )
}