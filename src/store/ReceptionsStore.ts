import { makeAutoObservable } from "mobx"

export default class ReceptionsStore{
    _receptions: any;
    _page: number;
    _total_count: number;
    _limit: number;
    _selected_doctor: {};
    constructor() {
        this._receptions = []
        this._page = 1
        this._total_count = 0
        this._limit = 20
        this._selected_doctor = {};
        makeAutoObservable(this)
    }
    setReceptions(receptions: any){
        this._receptions = receptions
    }

    setPage(page: number){
        this._page = page
    }

    setTotalCount(totalCount: number){
        this._total_count = totalCount
    }

    setLimit(limit: number){
        this._limit = limit
    }

    setSelectedDoctor(doctor: {}){
        this._selected_doctor=doctor
    }

    get page(){
        return this._page
    }

    get selectedDoctor(){
        return this._selected_doctor
    }
    get total_count(){
        return this._total_count
    }

    get limit(){
        return this._limit
    }

    get receptions(){
        return this._receptions
    }

}