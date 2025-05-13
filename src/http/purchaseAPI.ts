import {$authHost, $host} from "./index";

export const getAllPurchases = async (page=1, limit=10, search="") =>{
    const {data} = await $authHost.get('api/purchase/', {params: {
            page, limit, search
        }})
    return {data}
}

export const createPurchase = async (userId: number, note: string, sum: number, products: {productId: number, count: number}[]) => {
    const {data} = await $authHost.post('api/purchase', {userId, note, sum, products})
    return {data}
}

export const updatePurchase = async (id: any, userId: number, note: string, sum: number, products: {productId: number, count: number}[]) => {
    const {data} = await $authHost.put('api/purchase/' + id, {userId, note, sum, products})
    return {data}
}

export const deletePurchase = async (id: any) => {
    const {data} = await $authHost.delete('api/purchase/' + id)
    return {data}
}