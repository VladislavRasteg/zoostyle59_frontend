import { makeAutoObservable } from "mobx"
import moment from "moment";

export default class CalendarStore{
    _selectedDate: string;
    _selectedDoctors: [];
    _receptionsCount: number;
    _doctors: any;

    constructor() {
        this._selectedDate = moment().format("YYYY[-]MM[-]DD")
        this._selectedDoctors = [];
        this._receptionsCount = 0;
        this._doctors = [];

        makeAutoObservable(this)
    }

    setSelectedDate(date: string){
        this._selectedDate = date
    }

    setDoctors(doctors: []){
        this._doctors = doctors
    }

    setSelectedDoctors(doctors: []){
        this._selectedDoctors = doctors 
    }

    setReceptionsCount(count: number){
        this._receptionsCount = count
    }

    get selectedDate(){
        return this._selectedDate
    }

    get receptionsCount(){
        return this._receptionsCount
    }

    get selectedDoctors(){
        return this._selectedDoctors
    }

    get doctors(){
        return this._doctors
    }
}