import { makeAutoObservable } from 'mobx';
import { ITenant } from '@/interfaces/interfaces';
import { EBillingTypes } from '@/components/Billing/utils';

export default class TenantStore {
  _tenant: ITenant;

  constructor() {
    this._tenant = {
      id: -1,
      name: '',
      description: '',
      imageName: '',
      imageUrl: '',
      status: '',
      bannerName: '',
      bannerUrl: '',
      appointmentStepMinutes: 30,
      polisOMS: false,
      hasCaretaker: false,
      payments: [],
      employeesCount: -1,
      employeesMaxCount: -1,
      subscribtionDateTo: '',
      subscribtionMonths: -1,
      subscribtionType: EBillingTypes.TYPE_TRIAL,
      waitingIndividualOffer: false,
    };

    makeAutoObservable(this);
  }

  setTenant(tenant: ITenant) {
    this._tenant = tenant;
  }

  get tenant() {
    return this._tenant;
  }
}
