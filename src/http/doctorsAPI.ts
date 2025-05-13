import { IService } from "@/interfaces/interfaces";
import {$authHost, $host} from "./index";

export const listDoctors = async (page=1, limit=20) =>{
    const {data} = await $authHost.get('api/user', {params: {
            page, limit
        }})
    return {data}
}
export const updateDoctor = async (id: number, surname: string, firstName = "", middleName = "", positionId: number, birth: string | Date, phone = "", mail = "", role: string, password: string) => {
    const {data} = await $authHost.put('api/user/' + id, {surname, firstName, middleName, positionId, birth, phone, mail, role, password})
    return {data}
}
export const createDoctor = async (surname: string, firstName = "", middleName = "", positionId: number, birth: string | Date, phone = "", mail = "", role: string, password: string) => {
    const {data} = await $authHost.post('api/user', {surname, firstName, middleName, positionId, birth, phone, mail, role, password})
    return {data}
}

export const deleteDoctor = async (id: number) =>{
    const {data} = await $authHost.delete('api/user/'+id)
    return {data}
}

export const updateSchedule = async (id: number, isMon: boolean, monFrom: string, monTo: string, isTue: boolean, tueFrom: string, tueTo: string, isWed: boolean, wedFrom: string, wedTo: string, isThu: boolean, thuFrom: string, thuTo: string, isFri: boolean, friFrom: string, friTo: string, isSat: boolean, satFrom: string, satTo: string, isSun: boolean, sunFrom: string, sunTo: string, branchId: number) => {
    const {data} = await $authHost.put('api/doctors/updateSchedule?id=' + id, {isMon, monFrom, monTo, isTue, tueFrom, tueTo, isWed, wedFrom, wedTo, isThu, thuFrom, thuTo, isFri, friFrom, friTo, isSat, satFrom, satTo, isSun, sunFrom, sunTo, branchId})
    return {data}
}

