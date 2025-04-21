import { makeAutoObservable } from "mobx"

export default class ReceptionStore{
    _reception: any;
    _client: any;
    constructor() {
        this._reception = {}
        this._client = {}
        makeAutoObservable(this)
    }
    setReception(receptions: any){
        this._reception = receptions
    }

    setClient(client: any){
        this._client = client
    }

    get reception(){
        return this._reception
    }

    get client(){
        return this._client
    }

}