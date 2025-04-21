import { makeAutoObservable } from "mobx"

export default class WidgetStore{
    _services: [];
    _employees: [];
    _date: string;
    _branches: [];
    _selectedBranch: {};
    _selectedEmployee: {};
    _selectedService: {};

    constructor() {
        this._services = []
        this._employees = []
        this._date = ""
        this._branches = []
        this._selectedBranch = {}
        this._selectedEmployee = {}
        this._selectedService = {}

        makeAutoObservable(this)
    }

    setServices(services: any){
        this._services = services
    }
    setEmployees(employees: any){
        this._employees = employees
    }
    setDate(date: string){
        this._date = date
    }
    setBranches(branches: any){
        this._branches = branches
    }
    setSelectedBranch(branch: any){
        this._selectedBranch = branch
    }
    setSelectedEmployee(employee: any){
        this._selectedEmployee = employee
    }
    setSelectedService(service: any){
        this._selectedService = service
    }

    get employees(){
        return this._employees
    }
    get services(){
        return this._services
    }
    get date(){
        return this._date
    }
    get branches(){
        return this._branches
    }
    get selectedBranch(){
        return this._selectedBranch
    }
    get selectedEmployee(){
        return this._selectedEmployee
    }
    get selectedService(){
        return this._selectedService
    }
}