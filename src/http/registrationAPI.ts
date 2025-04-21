import {$authHost, $host} from "./index";
import jwtDecode from "jwt-decode";

export const createRegistration = async (name: string, phone: string, mail: string, password: string, ip: string, location: string, timezone=3) =>{
    const {data} = await $host.post('api/registration/create', {name, phone, mail, password, ip, location, timezone})
    localStorage.setItem('token', data.token)
    return(data.registration)
    //return(data)
}

export const showRegistration = async (id: any) => {
    const {data} = await $host.get('api/registration/'+id)
    return(data)
}

export const secondRegistration = async (link: any, tenantId: number, tenantName: string, position: string, branchId: string) =>{
    const {data} = await $host.post('api/registration/second', {link, tenantId, tenantName, position, branchId})
    return(data)
}

export const thirdRegistration = async (link: any, branchId: number, branchName: string, branchCity: string, branchStreet: string) =>{
    const {data} = await $host.post('api/registration/third', {link, branchId, branchName, branchCity, branchStreet})
    return(data)
}

export const fourthRegistration = async (link: any, businessType: string, employeeCount: string) =>{
    const {data} = await $host.post('api/registration/fourth', {link, businessType, employeeCount})
    return(data)
}