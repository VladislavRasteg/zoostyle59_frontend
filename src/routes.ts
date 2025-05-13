import Users from './pages/Users'
import Auth from './pages/Auth';
import Clients from './pages/Clients';
import {Groups} from "@/pages/Groups";
import Doctors from './pages/Doctors';
import Reception from './pages/Reception';
import Receptions from './pages/Receptions';
import Calendar from './pages/Calendar';
import Invite from './pages/Invite';
import Registration from './pages/Registration';
import ClientPage from "./pages/Client";
import GroupPage from "./pages/Group";
import Reports from "./pages/Reports";
import Procedures from "./pages/Procedures";
import Second from './components/Registration/Second/Second';
import Third from './components/Registration/Third/Third';
import Fourth from './components/Registration/Fourth/Fourth';
import Positions from './pages/Positions';
import RecordWidget from './pages/RecordWidget';
import Schedule from './pages/Schedule';
import PasswordRecovery from './pages/PasswordRecovery';

import {
    USERS_ROUTE,
    REGISTRATION_ROUTE,
    LOGIN_ROUTE,
    CLIENT_ROUTE,
    CLIENTS_ROUTE,
    DOCTORS_ROUTE,
    RECEPTIONS_ROUTE,
    RECEPTION_ROUTE,
    REPORTS_ROUTE,
    PROCEDURES_ROUTE,
    CALENDAR_ROUTE,
    INVITE_ROUTE,
    RECORD_WIDGET_ROUTE,
    PASSWORD_RECOVERY_ROUTE,
    ONLINE_BOOKING_ROUTE,
    ABONEMENTS_ROUTE,
    BILLING_ROUTE,
    PETS_ROUTE,
    PRODUCTS_ROUTE,
    SELLS_ROUTE,
    PURCHASES_ROUTE
} from './utils/consts';
import SelectServices from './components/Widget/SelectServices/SelectServices';
import SelectEmployee from './components/Widget/SelectDoctor/SelectEmployee';
import SelectDateTime from './components/Widget/SelectDateTime/SelectDateTime';
import WidgetSummary from './components/Widget/WidgetSummary/WidgetSummary';
import Success from './components/Widget/Success/Success';
import OnlineBooking from './pages/OnlineBooking';
import UsersRoles from './pages/UsersRoles';
import AbonementTypes from './pages/AbonementTypes';
import Abonements from './pages/Abonements';
import { BillingPage } from './pages/BillingPage';
import Pets from './pages/Pets';
import Products from './pages/Products';
import Sells from './pages/Sells';
import Purchases from './pages/Purchases';



export const authRoutes = [
    {
        path: CLIENT_ROUTE + '/:id',
        Component: ClientPage
    },
    {
        path: CLIENT_ROUTE + '/group/:id',
        Component: GroupPage
    },
    {
        path: CLIENTS_ROUTE,
        Component: Clients
    },
    {
        path: CLIENTS_ROUTE + '/groups',
        Component: Groups
    },
    {
        path: RECEPTIONS_ROUTE,
        Component: Receptions
    },
    {
        path: RECEPTION_ROUTE + '/:id',
        Component: Reception
    },
    {
        path: CALENDAR_ROUTE,
        Component: Calendar
    }
]

export const adminRoutes = [
    {
        path: USERS_ROUTE,
        Component: Users
    },
    {
        path: USERS_ROUTE + '/roles',
        Component: UsersRoles
    },
    {
        path: DOCTORS_ROUTE,
        Component: Doctors
    },
    {
        path: DOCTORS_ROUTE+'/positions',
        Component: Positions
    },
    {
        path: DOCTORS_ROUTE+'/schedule',
        Component: Schedule
    },
    {
        path: REPORTS_ROUTE,
        Component: Reports
    },
    {
        path: PROCEDURES_ROUTE,
        Component: Procedures
    },
    {
        path: ONLINE_BOOKING_ROUTE,
        Component: OnlineBooking
    },
    {
        path: ABONEMENTS_ROUTE,
        Component: AbonementTypes
    },
    {
        path: ABONEMENTS_ROUTE + '/list',
        Component: Abonements
    },
    {
        path: BILLING_ROUTE,
        Component: BillingPage
    },
    {
        path: PETS_ROUTE,
        Component: Pets
    },
    {
        path: PRODUCTS_ROUTE,
        Component: Products
    },
    {
        path: SELLS_ROUTE,
        Component: Sells
    },
    {
        path: PURCHASES_ROUTE,
        Component: Purchases
    },
]

export const publicRoutes = [
    {
        path: LOGIN_ROUTE,
        Component: Auth
    },
    {
        path: REGISTRATION_ROUTE,
        Component: Registration
    },
    {
        path: REGISTRATION_ROUTE + '/second/:id',
        Component: Second
    },
    {
        path: REGISTRATION_ROUTE + '/third/:id',
        Component: Third
    },
    {
        path: REGISTRATION_ROUTE + '/fourth/:id',
        Component: Fourth
    },
    {
        path: INVITE_ROUTE + '/:link',
        Component: Invite
    },
    {
        path: RECORD_WIDGET_ROUTE + '/:id',
        Component: RecordWidget
    },
    {
        path: RECORD_WIDGET_ROUTE + '/services/:id',
        Component: SelectServices
    },
    {
        path: RECORD_WIDGET_ROUTE + '/employees/:id',
        Component: SelectEmployee
    },
    {
        path: RECORD_WIDGET_ROUTE + '/datetime/:id',
        Component: SelectDateTime
    },
    {
        path: RECORD_WIDGET_ROUTE + '/summary/:id',
        Component: WidgetSummary
    },
    {
        path: RECORD_WIDGET_ROUTE + '/success/:id',
        Component: Success
    },
    {
        path: PASSWORD_RECOVERY_ROUTE,
        Component: PasswordRecovery
    },
]