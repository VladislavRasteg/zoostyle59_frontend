import { EBillingTypes } from "@/components/Billing/utils"
import { IAbonement } from "@/futures/Abonement/models"

export interface IService {
    id: number
    name: string
    price: number
    duration: number
    is_online_appointment: boolean
    doctors: IEmployee[]
    selected?: boolean
    doctorProcedures: any
}

export interface IGroup{
    id: number
    name: string
    services: IService[];
}

export interface IClient {
    id: number;
    firstName: string;
    middleName: string;
    surname: string;
    birth: string;
    mail: string;
    phone: string;
    activeAbonementId: number;
    activeAbonement: IAbonement;
    caretaker?: string;
}

export interface IPet {
    id: number;
    name: string;
    sex: string;
    birth: string;
    breed: string;
    feautures: string;
    clientId: number;
    client?: IClient;
    appointmentsTotal: number;
    isDeleted: boolean;
}

export interface IPosition{
    id: number;
    name: string;
}

export interface IGroup {
    id: number;
    name: string;
    clients: IClient[];
    branchId: number;
}

export interface IEmployee {
    id: number;
    firstName: string;
    middleName: string;
    surname: string;
    password: string;
    birth: string;
    mail: string;
    phone: string;
    role: string;
    position?: IPosition;
    positionId: number;
    doctorProcedures: [{procedureId: number, procedure: IService}];
}

export interface IAppointment {
    id: number;
    doctorId: number;
    date: string;
    time: string;
    endTime: string;
    doctor: IEmployee;
    client: IClient;
    group: IGroup;
    receptionProcedures: [{id: number, procedure: IService}];
    polisOMS: string;
    is_abonement_reception: boolean;
}

export interface iUserRole {
    id: number
    branchId: number
    name: string
    view_calendar: boolean
    view_calendar_day_total: boolean
    view_appointments_list: boolean
    view_not_mine_appointments: boolean
    view_appointments_history: boolean
    view_appointments_history_range: boolean
    view_appointments_future: boolean
    view_appointments_future_range: boolean
    view_appointment_card: boolean
    view_appointment_client: boolean
    view_appointment_client_first_name: boolean
    view_appointment_client_surname: boolean
    view_appointment_client_middle_name: boolean
    view_appointment_client_mail: boolean
    view_appointment_client_phone: boolean
    view_appointment_client_dob: boolean
    view_appointment_total: boolean
    edit_not_mine_appointment: boolean
    edit_appointment: boolean
    edit_appointment_start_time: boolean
    edit_appointment_end_time: boolean
    edit_appointment_date: boolean
    edit_appointment_employee: boolean
    edit_appointment_client: boolean
    edit_appointment_note: boolean
    edit_appointment_services: boolean
    add_appointment: boolean
    delete_appointment: boolean
    edit_appointment_payment_status: boolean
    view_clients: boolean
    view_client_appointments: boolean
    add_client: boolean
    delete_client: boolean
    edit_client: boolean
    edit_client_first_name: boolean
    edit_client_middle_name: boolean
    edit_client_surname_name: boolean
    edit_client_dob: boolean
    edit_client_mail: boolean
    edit_client_phone: boolean
    view_appointments: boolean
    filter_appointments_by_date: boolean
    filter_appointments_by_employee: boolean
    view_employees: boolean
    view_employees_list: boolean
    view_employee_first_name: boolean
    view_employee_surname_name: boolean
    view_employee_middle_name: boolean
    view_employee_position: boolean
    view_employee_dob: boolean
    view_employee_phone: boolean
    view_employee_statistics: boolean
    view_employee_services: boolean
    edit_employee: boolean
    create_employee: boolean
    delete_employee: boolean
    view_employees_schedules: boolean
    edit_employee_schedule: boolean
    view_employees_positions: boolean
    edit_employee_position: boolean
    create_employee_position: boolean
    delete_employee_position: boolean
    view_users: boolean
    edit_user: boolean
    invite_user: boolean
    delete_user: boolean
    view_users_roles: boolean
    create_user_role: boolean
    edit_user_role: boolean
    delete_user_role: boolean
    view_services: boolean
    add_services: boolean
    edit_services: boolean
    view_online_appointment: boolean
    view_online_appointment_statistics: boolean
    edit_online_appointment: boolean
    view_reports: boolean
    view_settings: boolean
    view_branch_settings: boolean
    view_company_settings: boolean
    edit_company_settings: boolean
    edit_branch_settings: boolean
    switch_branch: boolean
}

export interface ITenant {
    id: number
    name: string
    description: string
    imageName: string
    imageUrl: string
    bannerName: string
    bannerUrl: string
    status: string | null
    appointmentStepMinutes: number;
    polisOMS: boolean;
    hasCaretaker: boolean;
    
    waitingIndividualOffer: boolean;
    employeesCount: number;
    employeesMaxCount: number;
    subscribtionMonths: number;
    subscribtionType: EBillingTypes;
    subscribtionDateTo: string;
    payments: any[];
}