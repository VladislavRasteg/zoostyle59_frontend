import {$authHost, $host} from "./index";

export const getAllSells = async (page=1, limit=10, search="") =>{
    const {data} = await $authHost.get('api/sell/', {params: {
            page, limit, search
        }})
    return {data}
}

export const createSell = async (userId: number, clientId: number, sum: number, products: {productId: number, count: number}[]) => {
    const {data} = await $authHost.post('api/sell', {userId, clientId, sum, products})
    return {data}
}

export const updateSell = async (id: any, userId: number, clientId: number, sum: number, products: {productId: number, count: number}[]) => {
    const {data} = await $authHost.put('api/sell/' + id, {userId, clientId, sum, products})
    return {data}
}

export const deleteSell = async (id: any) => {
    const {data} = await $authHost.delete('api/sell/' + id)
    return {data}
}