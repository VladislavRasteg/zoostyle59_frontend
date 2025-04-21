import {$authHost, $host} from "./index";

export const listPositions = async (page=1, limit=20, branchId: number) =>{
    const {data} = await $authHost.get('api/positions/list', {params: {
            page, limit, branchId
        }})
    return {data}
}
export const updatePosition = async (id: number, name: string, branchId: number) => {
    const {data} = await $authHost.put('api/positions/edit?id=' + id, {name, branchId})
    return {data}
}
export const createPosition = async (name: string, branchId: number) => {
    const {data} = await $authHost.post('api/positions/add', {name, branchId})
    return {data}
}
export const deletePosition = async (id: number, branchId: number) =>{
    const {data} = await $authHost.delete('api/positions/delete?id='+id, {params: {branchId}})
    return {data}
}