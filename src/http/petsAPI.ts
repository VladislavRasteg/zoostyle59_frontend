import {$authHost, $host} from "./index";

export const getAllPets = async (page=1, limit=10, search="") =>{
    const {data} = await $authHost.get('api/pet/', {params: {
            page, limit, search
        }})
    return {data}
}

export const getOnePet = async (id: any) =>{
    const {data} = await $authHost.get('api/pet/'+id)
    return {data}
}

export const createPet = async (name: string, sex: string, birth: Date | undefined, breed: string, feautures: string, clientId: number) => {
    const {data} = await $authHost.post('api/pet', {name, sex, birth, breed, feautures, clientId})
    return {data}
}

export const updatePet = async (id: any, name: string, sex: string, birth: Date | undefined, breed: string, feautures: string, clientId: number) => {
    const {data} = await $authHost.put('api/pet/' + id, {name, sex, birth, breed, feautures, clientId})
    return {data}
}

export const deletePet = async (id: any) => {
    const {data} = await $authHost.delete('api/pet/' + id)
    return {data}
}