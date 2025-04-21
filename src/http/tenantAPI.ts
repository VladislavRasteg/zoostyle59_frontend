import {$authHost, $host} from "./index";

export const fetchUserTenant = async () => {
  const {data} = await $authHost.get('api/tenant')
  return {data}
}

export const updateTenantData = async (name: string, description: string, file?: File) => {
  const formdata = new FormData()
  formdata.append('name', name)
  formdata.append('description', description)
  formdata.append('file', file || '')
  const {data} = await $authHost.put('api/tenant', formdata)
  return {data}
}

export const updateTenantBanner = async (file?: File | null) => {
  const formdata = new FormData()
  formdata.append('file', file || '')
  const {data} = await $authHost.patch('api/tenant/banner', formdata)
  return {data}
}

export const updateTenantAppointmentStep = async (appointmentStepMinutes: number) => {
  const {data} = await $authHost.put('api/tenant', {appointmentStepMinutes})
  return {data}
}


