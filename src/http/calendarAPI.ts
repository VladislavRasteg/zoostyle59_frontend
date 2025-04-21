import {$authHost, $host} from "./index";

export const listCalendar = async (page=1, limit=4, date: string) =>{
    const {data} = await $authHost.get('api/calendar/', {params: {
            page, limit, date
        }})
    return {data}
}