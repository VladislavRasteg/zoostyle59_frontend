import {$authHost, $host} from "./index";

export const fetchAllBranches = async () =>{
    const {data} = await $authHost.get('api/settings/branches')
    return {data}
}

export const fetchBranchData = async (branchId: number) =>{
    const {data} = await $authHost.get('api/settings/fetchBranchData', {params: {
            branchId
        }})
    return {data}
}

export const createBranch = async (branchName: string, branchCity: string, branchStreet: string) => {
    const { data } = await $authHost.post('api/settings/branch', {branchName, branchCity, branchStreet})
    return { data }
}

export const updateBranchData = async (branchId: number, branchName: string, branchCity: string, branchStreet: string, branchWebsite: string, branchContact: string, lat: number, lon: number, timezone=3, groupReceptions: boolean, abonements: boolean) => {
    const {data} = await $authHost.put('api/settings/updateBranchData?branchId=' + branchId, {branchName, branchCity, branchStreet, branchWebsite, branchContact, lat, lon, timezone, groupReceptions, abonements})
    return {data}
}

export const updateBranchSchedule = async (branchId: number, isMon: boolean, monFrom: string, monTo: string, isTue: boolean, tueFrom: string, tueTo: string, isWed: boolean, wedFrom: string, wedTo: string, isThu: boolean, thuFrom: string, thuTo: string, isFri: boolean, friFrom: string, friTo: string, isSat: boolean, satFrom: string, satTo: string, isSun: boolean, sunFrom: string, sunTo: string) => {
    const {data} = await $authHost.put('api/settings/updateBranchSchedule?branchId=' + branchId, {monFrom, monTo, tueFrom, tueTo, wedFrom, wedTo, thuFrom, thuTo, friFrom, friTo, satFrom, satTo, sunFrom, sunTo, isMon, isTue, isWed, isThu, isFri, isSat, isSun})
    return {data}
}
// export const updateDoctor = async (id: number, surname: string, first_name: string, middle_name: string, positionId: number, birth: string, phone: string, branchId: number) => {
//     const {data} = await $authHost.put('api/doctors/edit?id=' + id, {surname, first_name, middle_name, positionId, birth, phone, branchId})
//     return {data}
// }
// export const createDoctor = async (surname: string, first_name: string, middle_name: string, positionId: number, birth: string, phone: string, branchId: number) => {
//     const {data} = await $authHost.post('api/doctors/add', {surname, first_name, middle_name, positionId, birth, phone, branchId})
//     return {data}
// }
// export const deleteDoctor = async (id: number, branchId: number) =>{
//     const {data} = await $authHost.delete('api/doctors/delete?id='+id, {params: {branchId}})
//     return {data}
// }

