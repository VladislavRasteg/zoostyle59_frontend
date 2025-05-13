import {$authHost, $host} from "./index";

export const getAllReceptions = async (page=1, limit=10, employeeId?: number, date?: Date,) =>{
    const {data} = await $authHost.get('api/appointment/', {params: {
            page, limit, employeeId, date
        }})
    return {data}
}
export const getMonthReceptions = async (branchId: number) => {
    const {data} = await $authHost.get('api/receptions/month', {params: {branchId}})
    return {data}
}