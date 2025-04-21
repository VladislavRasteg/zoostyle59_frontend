import {$authHost, $host} from "./index";

export const getOneClient = async (id: any, branchId: number) =>{
    const {data} = await $authHost.get('api/clients/'+id, {params: {branchId}})
    return {data}
}

export const createClient = async (surname="", firstName: string, middleName="", genderId=0, birth: any, phone: string | undefined, branchId: number, mail="", caretaker="") => {
    const {data} = await $authHost.post('api/client', {surname, firstName, middleName, genderId, birth, phone, branchId, mail, caretaker})
    return {data}
}
export const updateClient = async (id: any, surname: string, firstName: string | undefined, middleName: string | undefined, birth: Date | undefined, phone: string | undefined, branchId: number, mail: string | undefined, caretaker="") => {
    const {data} = await $authHost.put('api/client/' + id, {surname, firstName, middleName, birth, phone, branchId, mail, caretaker})
    return {data}
}

export const deleteClient = async (id: any) => {
    const {data} = await $authHost.delete('api/client/' + id)
    return {data}
}


// ГРУППЫ КЛИЕНТОВ

export const getOneGroup = async (id: any) =>{
    const {data} = await $authHost.get('api/clients/group/' + id)
    return {data}
}

export const getGroups = async (reqParams: {page?: number, limit?: number, name?:string, branchId: number}) => {
    const {data} = await $authHost.get('api/clients/groups', {params: {branchId: reqParams.branchId, name: reqParams.name}})
    return {data}
}

export const createClientGroup = async (branchId: number, name: string, clientsIds: number[]) => {
    const {data} = await $authHost.post('api/clients/group?branchId='+branchId, {name, clientsIds})
    return {data}
}

export const updateGroup = async (id: any, name: string, clientsIds: number[]) => {
    const {data} = await $authHost.put('api/clients/group/' + id, {name, clientsIds})
    return {data}
}

export const deleteGroup = async (id: any) => {
    const {data} = await $authHost.delete('api/clients/group/' + id)
    return {data}
}