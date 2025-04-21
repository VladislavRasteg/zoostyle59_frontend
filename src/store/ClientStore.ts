import { makeAutoObservable } from "mobx"

export default class ClientStore{
    _data: any;
    _receptions: any;
    constructor() {
        this._data = {}
        this._receptions = []

        makeAutoObservable(this)
    }
    setData(data: any){
        this._data = data
    }
    setReceptions(receptions: any){
        this._receptions = receptions
    }
    get data(){
        return this._data
    }
    get receptions(){
        return this._receptions
    }
}