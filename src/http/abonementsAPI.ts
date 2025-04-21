import { IService } from "@/interfaces/interfaces";
import {$authHost} from "./index";

export const fetchAbonementTypes = async (page=1, limit=10, branchId: number) => {
  const {data} = await $authHost.get('api/abonement/type/branch/' + branchId, {
    params: {
      page, limit
    }
  })
  return {data}
}

export const deleteAbonementType = async (abonementTypeId: string) => {
  const {data} = await $authHost.delete('api/abonement/type/' + abonementTypeId)
  return {data}
}

export const createAbonementType = async (name: string, price: number, visitsLimit: number | undefined, daysLimit: number | undefined, isWidgetBuy: boolean, selectedServices: IService[], branchId: number) => {
  const {data} = await $authHost.post('api/abonement/type/' + branchId, {name, price, visitsLimit, daysLimit, isWidgetBuy, selectedServices})
  return {data}
}

export const updateAbonementType = async (abonementTypeId: string, name: string, price: number, visitsLimit: number | undefined, daysLimit: number | undefined, isWidgetBuy: boolean, selectedServices: IService[], branchId: number) => {
  const {data} = await $authHost.put('api/abonement/type/' + abonementTypeId, {name, price, visitsLimit, daysLimit, isWidgetBuy, selectedServices, branchId})
  return {data}
}

export const createAbonement = async (
    clientId: number, 
    name: string,
    price: number,
    visitsLimit: number | null,
    visits = 0,
    expirationDate: Date | undefined,
    status = 'active',
    selectedServices: IService[],
    branchId: number
  ) => {
  const {data} = await $authHost.post('api/abonement/' + clientId, {name, price, visitsLimit, visits, expirationDate, status, selectedServices, branchId})
  return {data}
}

export const updateAbonement = async (
    abonementId: string,
    name: string,
    price: number,
    visitsLimit: number | null,
    visits = 0,
    expirationDate: Date | undefined,
    selectedServices: IService[],
    branchId: number
  ) => {
  const {data} = await $authHost.put('api/abonement/' + abonementId, {name, price, visitsLimit, visits, expirationDate, selectedServices, branchId})
  return {data}
}

export const deleteAbonement = async (
    abonementId: string
  ) => {
  const {data} = await $authHost.delete('api/abonement/' + abonementId)
  return {data}
}

export const fetchAbonements = async (page=1, limit=10, branchId: number) => {
  const {data} = await $authHost.get('api/abonement/branch/' + branchId, {
    params: {
      page, limit
    }
  })
  return {data}
}
