import {$authHost, $host} from "./index";
import jwtDecode from "jwt-decode";

export const createInvite = async (branchId: number, personName: string, personMail: string, isAdmin: boolean) =>{
    const {data} = await $authHost.post('api/invite/create', {personMail, personName, isAdmin, branchId})
    return(data)
}

export const listInvited = async (branchId: number) => {
    const {data} = await $authHost.get('api/invite/list', {params: {branchId}})
    return(data)
}

export const deleteInvite = async (id: number, link: string) => {
    const {data} = await $authHost.delete('api/invite/delete', {params: {id, link}})
    return(data)
}

export const showInvite = async (id: any) => {
    const {data} = await $host.get('api/invite/'+id)
    return(data)
} 

export const acceptInvite = async (link: string, name: string, mail: string, password: string, isAdmin: boolean, branchId: number) => {
    const {data} = await $host.post('api/invite/accept', {link, name, mail, password, isAdmin, branchId})
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}