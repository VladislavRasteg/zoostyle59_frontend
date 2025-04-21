import {$authHost, $host} from "./index";

export const getAllReceptions = async (page=1, limit=10, selectedDoctor= {}, searchDate="", branchId: number) =>{
    const {data} = await $authHost.get('api/receptions/list', {params: {
            page, limit, selectedDoctor, searchDate, branchId
        }})
    return {data}
}
export const getMonthReceptions = async (branchId: number) => {
    const {data} = await $authHost.get('api/receptions/month', {params: {branchId}})
    return {data}
}