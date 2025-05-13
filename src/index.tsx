import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.scss';
import App from './App';
import UserStore from './store/UserStore';
import ClientsStore from './store/ClientsStore';
import ClientStore from './store/ClientStore';
import PetsStore from './store/PetsStore';
import ReceptionsStore from './store/ReceptionsStore';
import ReceptionStore from './store/ReceptionStore';
import DoctorsStore from "./store/DoctorsStore";
import UsersStore from "./store/UsersStore";
import ProceduresStore from "./store/ProceduresStore";
import CalendarStore from './store/CalendarStore';
import PositionsStore from './store/PositionsStore';
import WidgetStore from './store/WidgetStore';
import GroupsStore from "@/store/GroupsStore";
import TenantStore from "@/store/TenantStore";
import AbonementsStore from './store/AbonementsStore';
import AbonementTypesStore from './store/AbonementTypesStore';
import ProductsStore from './store/ProductsStore';
import SellsStore from './store/SellsStore';
import PurchasesStore from './store/PurchasesStore';

export const Context = createContext(null as any)

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <Context.Provider value={{
      abonements: new AbonementsStore(),
      abonementTypes: new AbonementTypesStore(),
      user: new UserStore(),
      users: new UsersStore(),
      clients: new ClientsStore(),
      pets: new PetsStore(),
      groups: new GroupsStore(),
      client: new ClientStore(),
      receptions: new ReceptionsStore(),
      reception: new ReceptionStore(),
      doctors: new DoctorsStore(),
      procedures: new ProceduresStore(),
      calendar: new CalendarStore(),
      positions: new PositionsStore(),
      widget: new WidgetStore(),
      tenant: new TenantStore(),
      products: new ProductsStore(),
      sells: new SellsStore(),
      purchases: new PurchasesStore(),
  }}>
    <App />
  </Context.Provider>
  )