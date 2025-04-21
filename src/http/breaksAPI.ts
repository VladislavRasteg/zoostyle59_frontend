import {$authHost} from "./index";

export const createBreak = async (doctorId: number, date: string, time: string, endTime: string, branchId: number) => {
  const {data} = await $authHost.post('api/break/', {doctorId, date, time, endTime, branchId})
  return {data}
}

export const createDayOff = async (doctorId: number, date: string, time: string, endTime: string, branchId: number) => {
  const {data} = await $authHost.post('api/break/dayoff', {doctorId, date, time, endTime, branchId})
  return {data}
}

export const deleteBreak = async (id: any) => {
  const {data} = await $authHost.delete('api/break/?id=' + id)
  return {data}
}

export const deleteAllBreaks = async (doctorId: number, date: string, branchId: number) => {
  const {data} = await $authHost.delete('api/break/deleteAll', {data: {doctorId, date, branchId}});
  return {data}
}
