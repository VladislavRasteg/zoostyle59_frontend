import {$authHost, $host} from "./index";

export const getAllClients = async (page=1, limit=10, search="") =>{
    const {data} = await $authHost.get('api/client/', {params: {
            page, limit, search
        }})
    return {data}
}