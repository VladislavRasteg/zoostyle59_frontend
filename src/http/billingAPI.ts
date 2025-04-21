import { TMonths } from '@/components/Billing/utils';
import { $authHost } from './index';

export const requestIndividualOffer = async () => {
  const { data } = await $authHost.post('api/billing/individualOffer');
  return { data };
};

export const pay = async (employeesMaxCount: number, selectedPeriod: TMonths) => {
  const { data } = await $authHost.post('api/billing/pay', { employeesMaxCount, selectedPeriod });
  return { data };
};

export const checkTPayment = async (paymentId: string,) => {
  const { data } = await $authHost.post('api/billing/checkTPayment', { paymentId });
  return { data };
};
