import {$authHost, $host} from "./index";

export const createReception = async (date: string, time: string, endTime: string, clientId: number, doctorId: number, procedures: object[], note:string, branchId: number, is_widget_appointment: boolean, sendEmailFor: null, polisOMS: boolean, polisOMSnumber: string, is_abonement_reception = false) => {
    const {data} = await $authHost.post('api/receptions/add', {date, time, endTime, clientId, doctorId, procedures, note, branchId, is_widget_appointment, sendEmailFor, polisOMS, polisOMSnumber, is_abonement_reception})
    return "success!"
}

export const createGroupReception = async (date: string, time: string, endTime: string, groupId: number, doctorId: number, procedures: object[], note:string, branchId: number) => {
    const {data} = await $authHost.post('api/receptions/add_group', {date, time, endTime, groupId, doctorId, procedures, note, branchId})
    return "success!"
}

export const getOneReception = async (id: any, branchId: number) =>{
    const {data} = await $authHost.get('api/receptions/'+id, {params: {branchId}})
    return {data}
}
export const deleteReception = async (id: any, branchId: number) =>{
    const {data} = await $authHost.delete('api/receptions/delete?id='+id, {params: {branchId}})
    return {data}
}

export const updateReception = async (id: number, date: string, time: string, endTime: string, clientId: number, doctorId: number, procedures: object[], note:string, branchId: number) => {
    const {data} = await $authHost.put('api/receptions/update?id=' + id, {date, time, endTime, clientId, procedures, doctorId, note, branchId})
    return data
}
