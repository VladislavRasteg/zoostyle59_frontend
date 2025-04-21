import {$authHost, $host} from "./index";
import jwtDecode from "jwt-decode";

export const signIn = async (mail: string, password: string) =>{
    const {data} = await $host.post('api/user/login', {mail, password})
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const check = async () =>{
    const {data} = await $authHost.get('api/user/auth')
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const findEmail = async (login: string) =>{
    const {data} = await $host.get(`api/user/find_email?login=${login}`)
    return data
}

export const listUsers = async (page=1, limit=20, branchId: number) =>{
    const {data} = await $authHost.get('api/user/list', {params: {
        page, limit, branchId
    }})
    return {data}
}

export const updateUser = async (id: number, login: string, name: string, role: string, branchId: number) =>{
    const {data} = await $authHost.put('api/user/edit?id=' + id, {name, login, role, branchId})
    return data
}

export const recoveryPassword = async (email: string, password: string) =>{
    const {data} = await $authHost.post('api/user/recovery_password', {email, password})
    return "success!"
}

export const checkCode = async (email: string, code: string) =>{
    const {data} = await $authHost.post('api/user/check_code', {email, code})
    return data
}

export const deleteUser = async (id: number, branchId: number) =>{
    const {data} = await $authHost.delete('api/user/delete', {params: {id, branchId}})
    return "User deleted successfully!"
}