import {$authHost, $host} from "./index";
import jwtDecode from "jwt-decode";

interface IService {
    id: number,
    name: string,
    duration: number,
    price: number,
    selected: boolean,
    doctorProcedures: any,
    doctors: any,
}

export const getBranches = async (tenantId: number) =>{
    const {data} = await $host.get('api/widget/getBranches', {params: {tenantId}})
    return(data)
}

export const getServices = async (tenantId: number, branchId?: number) =>{
    const {data} = await $host.get('api/widget/getServices', {params: {tenantId, branchId}})
    return(data)
}

export const getEmployees = async (tenantId: number, branchId: number, services: number[] | undefined) =>{
    const {data} = await $host.get('api/widget/getEmployees', {params: {tenantId, branchId, services}})
    return(data)
}
 
export const getDateTime = async (tenantId: number, branchId: number, services: number[] | undefined, employee: number) =>{
    const {data} = await $host.get('api/widget/getDateTime', {params: {tenantId, branchId, services, employee}})
    return(data)
}

export const getSummary = async (tenantId: number, branchId: number, services: number[] | undefined, employee: number, date: string | null) =>{
    const {data} = await $host.get('api/widget/getSummary', {params: {tenantId, branchId, services, employee, date}})
    return(data)
}

export const createRecord = async (
    tenantId: number,
    branchId: number,
    surname: string,
    first_name: string,
    middle_name: string,
    phone: string,
    mail: string,
    note: string,
    employeeId: number,
    date: string | null,
    time: string | null,
    endTime: string,
    services: IService[],
    is_widget_appointment: boolean,
    sendEmailFor: number,
    polisOMS: boolean,
    polisOMSnumber: string,
    ) =>{
    const {data} = await $host.post('api/widget/reception', {tenantId, branchId, surname, first_name, middle_name, phone, mail, note, employeeId, date, time, endTime, services, is_widget_appointment, sendEmailFor, polisOMS, polisOMSnumber})
    return(data)
}

export const getRecord = async (receptionId: string | undefined, branchId: string | null) =>{
    const {data} = await $host.get('api/widget/getRecord', {params: {receptionId, branchId}})
    return(data)
}

export const getTenant = async (id: number) =>{
    const {data} = await $host.get('api/widget/getTenant/'+id)
    return(data)
}

export const getWidgetStatistics = async (branchId: number) =>{
    const {data} = await $host.get('api/widget/statistics/'+ branchId)
    return(data)
}