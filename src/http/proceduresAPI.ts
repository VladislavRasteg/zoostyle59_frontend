import { IService } from "@/interfaces/interfaces";
import {$authHost} from "./index";

export const listProcedures = async (page=1, limit=10, branchId: number) =>{
    const {data} = await $authHost.get('api/service/', {params: {
            page, limit, branchId
        }})
    return {data}
}

export const groupedServices = async (branchId: number) =>{
    const {data} = await $authHost.get('api/service/grouped', {params: {
            branchId
        }})
    return {data}
}

export const moveService = async (service_id: number, group_id: number | null) => {
    await $authHost.put('api/service/move', {service_id, group_id})
    return "Service successfully updated!"
}

export const updateProcedure = async (id: number, name: string, price: number, duration: number, is_online_appointment: boolean, branchId: number) => {
    const {data} = await $authHost.put('api/service/update?id=' + id, {name, price, duration, is_online_appointment, branchId})
    return "Procedure successfully updated!"
}

export const createProcedure = async (name: string, price: number, duration: number, is_online_appointment: boolean, branchId: number, groupToAdd: number | null) => {
    const {data} = await $authHost.post('api/service/add',{name, price, duration, is_online_appointment, branchId, groupToAdd})
    return "Procedure successfully added!"
}

export const createGroup = async (name: string, services: IService[] | undefined, branchId: number) => {
    const {data} = await $authHost.post('api/service/group/create',{name, services, branchId})
    return "Group successfully created!"
}

export const updateGroup = async (id: number, name: string, services: IService[] | undefined, branchId: number) => {
    const {data} = await $authHost.put('api/service/group/update',{id, name, services, branchId})
    return "Group successfully updated!"
}

export const deleteGroup = async (id: number, branchId: number) => {
    const {data} = await $authHost.delete('api/service/group/delete',{params: {id, branchId}})
    return "Group successfully deleted!"
}

export const deleteProcedure = async (id: number, branchId: number) => {
    const {data} = await $authHost.delete('api/service/delete?id=' + id, {params: {branchId}})
    return {data}
}