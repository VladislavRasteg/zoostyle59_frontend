import Modal from "@/components/Modal/Modal"
import ModalContent from "@/components/Modal/ModalContent"
import ModalFooter from "@/components/Modal/ModalFooter"
import {Button} from "@/shared/Button"
import s from './ProductModal.module.scss'
import {useContext, useEffect, useState} from "react"
import {Title} from "@/shared/Title"
import {Datepicker} from "@/shared/Datepicker"
import {Input} from "@/shared/Input"
import {Context} from "@/index"
import {PhoneInput} from "@/shared/PhoneInput"
import {toast} from "react-toastify"
import {IAppointment, IClient, IPet, IProduct} from "@/interfaces/interfaces"
import {Scrollbar} from "react-scrollbars-custom"
import { createClient, deleteClient, getOneClient, updateClient } from "@/http/clientAPI"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { createPet, deletePet, getOnePet, updatePet } from "@/http/petsAPI"
import { MenuItem, Select } from "@/shared/Select"
import { getAllClients } from "@/http/clientsAPI"
import { ClientModal } from "@/widgets/ClientModal"
import { createProduct, deleteProduct, updateProduct } from "@/http/productsAPI"
import { Switcher } from "@/shared/Switcher"

interface IModalProps {
  show: boolean
  onClose: () => void
  product?: IProduct
}

export const ProductModal = ({show, onClose, product}: IModalProps) => {

  const [showConfirmation, setShowConfirmation] = useState(false)

  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState(product?.price || 0);
  const [count, setCount] = useState(product?.count || 0);
  const [isForService, setIsForService] = useState(product?.isForService || false);
  
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 500)
  const [updated, setUpdated] = useState(false)

  const deleteProductHandler = () => {
    if(product && product.id){
      deleteProduct(product.id)
      .then(() => {
        toast.success('Товар удален')
        onClose()
      })
      .catch(e => {
        toast.error(e.message)
      })
    } else {
      toast.error('Не передан идентификатор товара')
    }
  }

  const createProductHandler = () => {
    if (name && price && count) {
      createProduct(name, price, count, isForService)
      .then((data: any) => {
        toast.success('Товар добавлен')
        onClose()
      })
      .catch(e => {
        toast.error(e.message)
      })
    } else {
      toast.error('Заполните обязательные поля')
    }
  }

  const updateProductHandler = () => {
    if (product?.id && name && price && count) {
      updateProduct(product?.id, name, price, count, isForService)
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
    <Modal show={show} name={product ? "Редактирование товара" : "Новый товар"} onDelete={() => setShowConfirmation(true)} allowDelete={!!product} onClose={onClose}>
      <Modal show={showConfirmation} onClose={() => setShowConfirmation(false)} name="Подтверждение">
        <ModalContent height="110px">
          <p className={s.confirmation_text}>Вы уверены, что хотите удалить товар?</p>
        </ModalContent>
        <ModalFooter>
          <Button theme="border" size="big" onClick={() => setShowConfirmation(false)} fullWidth>Отменить</Button>
          <Button fullWidth size="big" theme="dangerous" onClick={() => deleteProductHandler()}>Удалить</Button>
        </ModalFooter>
      </Modal>
      <ModalContent 
        height={"360px"} 
        width={isMobile ? "100%" : "544px"}>
        <div className={s.modal_body}>
          <div className={s.appointment_wrapper}>
            <div className={s.input_group}>
              <Title title="Наименование" required/>
              <Input placeholder="Наименование" offAutoComplite value={name} onChange={setName}/>
            </div>
            <div className={s.input_group}>
              <Title title="Стоимость" required/>
              <Input placeholder="Стоимость" type="number" offAutoComplite value={price} onChange={setPrice}/>
            </div>
            <div className={s.input_group}>
              <Title title="Количество" required/>
              <Input placeholder="Количество" type="number" offAutoComplite value={count} onChange={setCount}/>
            </div>
            <div className={s.input_group}>
              <Title title="Товар для услуги" required/>
              <Switcher value={isForService} setValue={setIsForService}/>
            </div>

          </div>
        </div>
      </ModalContent>
      <ModalFooter>
        <Button theme="border" size="big" onClick={() => onClose()} fullWidth>Закрыть</Button>
        {!product && <Button fullWidth size="big" onClick={() => {
          createProductHandler()
        }}>Добавить</Button>}
        {product && <Button fullWidth size="big" onClick={() => {
          updateProductHandler()
        }}>Сохранить</Button>}
      </ModalFooter>
    </Modal>
  )
}