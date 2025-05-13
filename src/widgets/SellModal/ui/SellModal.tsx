import Modal from "@/components/Modal/Modal"
import ModalContent from "@/components/Modal/ModalContent"
import ModalFooter from "@/components/Modal/ModalFooter"
import {Button} from "@/shared/Button"
import s from './SellModal.module.scss'
import {useContext, useEffect, useState} from "react"
import {Title} from "@/shared/Title"
import {Datepicker} from "@/shared/Datepicker"
import {Input} from "@/shared/Input"
import {Context} from "@/index"
import {PhoneInput} from "@/shared/PhoneInput"
import {toast} from "react-toastify"
import {IAppointment, IClient, IEmployee, IPet, IProduct, ISell} from "@/interfaces/interfaces"
import {Scrollbar} from "react-scrollbars-custom"
import { createClient, deleteClient, getOneClient, updateClient } from "@/http/clientAPI"
import { format } from "date-fns"
import { ru, se } from "date-fns/locale"
import { createPet, deletePet, getOnePet, updatePet } from "@/http/petsAPI"
import { MenuItem, Select } from "@/shared/Select"
import { getAllClients } from "@/http/clientsAPI"
import { ClientModal } from "@/widgets/ClientModal"
import { createProduct, deleteProduct, getAllProducts, updateProduct } from "@/http/productsAPI"
import { Switcher } from "@/shared/Switcher"
import { createSell, deleteSell, updateSell } from "@/http/sellsAPI"
import Multiselect from "@/shared/Multiselect/Multiselect"
import { listUsers } from "@/http/userAPI"
import { listDoctors } from "@/http/doctorsAPI"

interface IModalProps {
  show: boolean
  onClose: () => void
  sell?: ISell
}

export const SellModal = ({show, onClose, sell}: IModalProps) => {

  const [showConfirmation, setShowConfirmation] = useState(false)
  
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 500)
  const [updated, setUpdated] = useState(false)
  
  const [products, setProducts] = useState<Array<IProduct>>()
  const [users, setUsers] = useState<Array<IEmployee>>()
  const [selectedEmployee, setSelectedEmployee] = useState<number | undefined>(sell?.user.id)
  const [selectedProducts, setSelectedProducts] = useState<Array<IProduct> | undefined>(sell?.saleProducts.map(sp => sp.product)) 

  const [sellProducts, setSellProducts] = useState<{name: string, price: number, count: number, productId: number}[] | undefined>(
    sell?.saleProducts.map(sp =>  {return({
      name: sp.product.name, price: sp.product.price, count: sp.count, productId: sp.product.id
    })})
  ) 
  
  const [searchClient, setSearchClient] = useState("");
  const [searchResult, setSearchResult] = useState<IClient[]>()
  const [selectedClient, setSelectedClient] = useState<IClient | undefined>(sell?.client);

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

  useEffect(() => {
    if (searchClient.length > 2) {
      const delayDebounceFn = setTimeout(() => {
        getAllClients(1, 9999, searchClient).then((data: any) => {
          setSearchResult(data.data.rows)
        })
      }, 100)
      return () => clearTimeout(delayDebounceFn)
    } else {
      setSearchResult(undefined)
    }
  }, [searchClient])

  const deleteSellHandler = () => {
    if(sell && sell.id){
      deleteSell(sell.id)
      .then(() => {
        toast.success('Покупка удалена')
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

  const selectClientHandler = (client: IClient) => {
    if (client) {
      setSelectedClient(client)
    }

    setSearchResult(undefined)
    setSearchClient("")
  }

  const createSellHandler = () => {
    if (sum && sellProducts && sellProducts.length > 0 && selectedEmployee) {
      createSell(selectedEmployee, selectedClient?.id || 0, sum, sellProducts)
      .then((data: any) => {
        toast.success('Покупка добавлена')
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
      updateSell(sell.id, selectedEmployee, selectedClient?.id || 0, sum, sellProducts)
      .then((data: any) => {
        toast.success('Изменения сохранены')
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
    <Modal show={show} name={sell ? "Редактирование продажи" : "Новая продажа"} onDelete={() => setShowConfirmation(true)} allowDelete={!!sell} onClose={onClose}>
      <Modal show={showConfirmation} onClose={() => setShowConfirmation(false)} name="Подтверждение">
        <ModalContent height="110px">
          <p className={s.confirmation_text}>Вы уверены, что хотите удалить продажу?</p>
        </ModalContent>
        <ModalFooter>
          <Button theme="border" size="big" onClick={() => setShowConfirmation(false)} fullWidth>Отменить</Button>
          <Button fullWidth size="big" theme="dangerous" onClick={() => deleteSellHandler()}>Удалить</Button>
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
                <Title title="Клиент"/>
                <div className={s.search_client}>
                  <Input offAutoComplite placeholder="Начните вводить фамилию" value={searchClient}
                        onChange={setSearchClient}/>
                  {
                    searchResult && searchResult.length > 0 &&
                      <div className={s.search_results}>
                          <div className={s.outside_click_handler} onClick={() => setSearchResult(undefined)}></div>
                        {
                          searchResult.map((element, index) =>
                            <div className={s.search_result} key={index} onClick={() => {
                              selectClientHandler(element)
                            }}>
                              <p
                                className={s.search_name}>{element.surname} {element.firstName} {element.middleName}</p>
                              <div className={s.search_additional_info}>
                                {element.phone && <p className={s.search_secondary}>{element.phone}</p>}
                                {element.mail && <p className={s.search_secondary}>{element.mail}</p>}
                              </div>
                            </div>
                          )
                        }
                      </div>
                  }
                </div>
                {
                  selectedClient &&
                  <div className={s.client_block}>
                  <p
                    className={s.search_name}>{selectedClient.surname} {selectedClient.firstName} {selectedClient.middleName}</p>
                    {selectedClient.phone && <p className={s.search_secondary}>{selectedClient.phone}</p>}
                    {selectedClient.mail && <p className={s.search_secondary}>{selectedClient.mail}</p>}
                  </div>
                }
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
          </div>
        </div>
      </ModalContent>
      <ModalFooter>
        <Button theme="border" size="big" onClick={() => onClose()} fullWidth>Закрыть</Button>
        {!sell && <Button fullWidth size="big" onClick={() => {
          createSellHandler()
        }}>Создать</Button>}
        {sell && <Button fullWidth size="big" onClick={() => {
          updateSellHandler()
        }}>Сохранить</Button>}
      </ModalFooter>
    </Modal>
  )
}