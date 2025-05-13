import {$authHost, $host} from "./index";

export const getAllProducts = async (page=1, limit=10, search="") =>{
    const {data} = await $authHost.get('api/product/', {params: {
            page, limit, search
        }})
    return {data}
}

export const createProduct = async (name: string, price: number, count: number, isForService: boolean) => {
    const {data} = await $authHost.post('api/product', {name, price, count, isForService})
    return {data}
}

export const updateProduct = async (id: any, name: string, price: number, count: number, isForService: boolean) => {
    const {data} = await $authHost.put('api/product/' + id, {name, price, count, isForService})
    return {data}
}

export const deleteProduct = async (id: any) => {
    const {data} = await $authHost.delete('api/product/' + id)
    return {data}
}