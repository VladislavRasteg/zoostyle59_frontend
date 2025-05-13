import {$authHost, $host} from "./index";

export const createReception = async (userId: number, clientId: number, date: string, time: string, endTime: string, note:string, petId: number, procedures: object[], sum: number) => {
    const {data} = await $authHost.post('api/appointment', {userId, clientId, date, time, endTime, note, petId, procedures, sum})
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
export const deleteReception = async (id: any) =>{
    const {data} = await $authHost.delete('api/appointment/'+id)
    return {data}
}

export const updateReception = async (id: number, userId: number, clientId: number, date: string, time: string, endTime: string, note:string, petId: number, procedures: object[], sum: number) => {
    const {data} = await $authHost.put('api/appointment/' + id, {userId, clientId, date, time, endTime, note, petId, procedures, sum})
    return data
}
