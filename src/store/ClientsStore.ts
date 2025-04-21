import { makeAutoObservable } from "mobx"

export default class ClientsStore{
    _clients: any;
    _page: number;
    _total_count: number;
    _limit: number;

    constructor() {
        this._clients = []
        this._page = 1
        this._total_count = 0
        this._limit = 20

        makeAutoObservable(this)
    }
    setClients(clients: any){
        this._clients = clients
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
    get clients(){
        return this._clients
    }
}