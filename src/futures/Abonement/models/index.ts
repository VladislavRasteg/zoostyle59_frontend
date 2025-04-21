import { IClient, IService } from "@/interfaces/interfaces";

export interface IAbonementType{
    id: string;
    branchId: number;
    name: string;
    price: number;
    visitsLimit: number;
    daysLimit: number;
    isWidgetBuy: boolean;
    abonementTypeProcedures: [{
        id: number;
        procedure: IService
    }]
}

export const abonementStatus = {
    "active": "Активен",
    "inactive": "Неактивен",
    "expired": "Использован",
    "withdrawn": "Отозван"
}

export interface IAbonement{
    id: string;
    abonementTypeId: string;
    clientId: number;
    name: string;
    price: number;
    visitsLimit: number;
    visits: number;
    expirationDate: Date;
    status: "active" | "inactive" | "expired" | "withdrawn";
    createdAt: Date;
    clientAbonementProcedures: [{
        id: number;
        procedure: IService
    }]
    client: IClient
}