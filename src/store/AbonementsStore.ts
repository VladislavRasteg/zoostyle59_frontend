import { IAbonement, IAbonementType } from "@/futures/Abonement/models";
import { makeAutoObservable } from "mobx"

export default class AbonementsStore{
    _abonements: IAbonement[];
    _page: number;
    _total_count: number;
    _limit: number;

    constructor() {
        this._abonements = []
        this._page = 1
        this._total_count = 0
        this._limit = 20

        makeAutoObservable(this)
    }
    setAbonements(abonements: IAbonement[]){
        this._abonements = abonements
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

    get page(){
        return this._page
    }

    get total_count(){
        return this._total_count
    }

    get limit(){
        return this._limit
    }
    get abonements(){
        return this._abonements
    }
}