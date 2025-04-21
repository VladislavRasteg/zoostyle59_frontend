import {$authHost, $host} from "./index";

export const getMainReport = async (branchId: number, startDate: string, endDate: string) =>{
    const {data} = await $authHost.get('api/report/main', {params: {
            branchId, 
            startDate, 
            endDate
        }})
    return {data}
}