import dayjs from 'dayjs';
import ruLocale from 'dayjs/locale/ru';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);
dayjs.locale(ruLocale);

export const employeesCountVariants = [
  { value: 3, label: 'До 3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
  { value: 6, label: '6' },
  { value: 7, label: '7' },
  { value: 8, label: '8' },
  { value: 9, label: '9' },
  { value: 10, label: '10' },
  { value: 11, label: '11' },
  { value: 12, label: '12' },
  { value: 13, label: '13' },
  { value: 14, label: '14' },
  { value: 15, label: '15+' },
];

export type TMonths = 3 | 6 | 12 | 24;

export const periodVariants: { value: TMonths; label: string }[] = [
  { value: 3, label: '3 месяца' },
  { value: 6, label: '6 месяцев' },
  { value: 12, label: '1 год' },
  { value: 24, label: '2 года' },
];

export interface IBillingInfoCardProps {
  message: string;
  hint?: string;
  variant: 'warning' | 'info';
}

export enum EBillingTypes {
  TYPE_TRIAL = 'trial',
  TYPE_SUBSRIBE = 'subscribe',
  TYPE_EXPIRED = 'expired',
}

export const getBillingStatusInfo = (
  subscribtionType: EBillingTypes,
  subscribtionTo: string,
  hasPayments: boolean,
): IBillingInfoCardProps => {
  if (subscribtionType === EBillingTypes.TYPE_TRIAL)
    return {
      message: `Пробный доступ действует до ${subscribtionTo}`,
      variant: 'info',
    };

  if (subscribtionType === EBillingTypes.TYPE_EXPIRED && hasPayments)
    return {
      message: 'Необходимо настроить подписку',
      hint: `Ваша подписка истекла ${subscribtionTo}, пожалуйста, настройте и оплатите подписку`,
      variant: 'warning',
    };

  if (subscribtionType === EBillingTypes.TYPE_EXPIRED && !hasPayments)
    return {
      message: 'Необходимо настроить подписку',
      hint: `Ваш пробный период истек ${subscribtionTo}, пожалуйста, настройте и оплатите подписку`,
      variant: 'warning',
    };

  return {
    message: 'Возникла непредвиденная ошибка, пожалуйста, обновите страницу!',
    variant: 'warning',
  };
};

const prices: Record<TMonths, { base: number; additionalEmployee: number }> = {
  3: { base: 1199, additionalEmployee: 300 },
  6: { base: 999, additionalEmployee: 275 },
  12: { base: 849, additionalEmployee: 250 },
  24: { base: 749, additionalEmployee: 225 },
};

export const getFullPeriodPrice = (months: TMonths, employees: number) => {
  return (prices[3].base + prices[3].additionalEmployee * (employees - 3)) * months;
};

export const getMonthPrice = (months: TMonths, employees: number) => {
  return prices?.[months]?.base + prices?.[months]?.additionalEmployee * (employees - 3);
};

export const getPeriodDiscount = (
  months: TMonths,
  employees: number,
  subscribtionDateTo?: string,
  subscribtionMonths?: TMonths,
) => {
  if (subscribtionDateTo && subscribtionMonths) {
    const currentDate = dayjs();
    const endDate = dayjs(subscribtionDateTo, 'DD.MM.YYYY');
    const remainingDays = endDate.diff(currentDate, 'day');
    const currentSubPrice = getMonthPrice(subscribtionMonths, employees) * subscribtionMonths;
    const currentSubPriceInDay = currentSubPrice / subscribtionMonths / currentDate.daysInMonth();

    return parseInt((remainingDays * currentSubPriceInDay).toFixed(1));
  }

  return getFullPeriodPrice(months, employees) - getMonthPrice(months, employees) * months;
};

export const subTimeLeft = (subscribtionTo: string) => {
  const endDate = dayjs(subscribtionTo, 'DD.MM.YYYY');
  let currentDate = dayjs();
  let remainingDays = endDate.diff(currentDate, 'day');

  let months = 0;
  while (remainingDays > 0) {
    const daysInMonth = currentDate.daysInMonth();
    if (remainingDays >= daysInMonth) {
      months++;
      remainingDays -= daysInMonth;
      currentDate = currentDate.add(1, 'month');
    } else {
      break;
    }
  }

  if (!months) return `${remainingDays} дн.`;
  if (!remainingDays) return `${months} мес.`;
  return `${months} мес. ${remainingDays} дн.`;
};

export const totalSubDuration = (
  subscribtionTo: string,
  newMonths: TMonths,
  finalDate?: boolean,
) => {
  const endDate = dayjs(subscribtionTo, 'DD.MM.YYYY');
  let currentDate = dayjs();
  let remainingDays = endDate.diff(currentDate, 'day');

  if (finalDate)
    return dayjs(subscribtionTo, 'DD.MM.YYYY').add(newMonths, 'months').format('DD.MM.YYYY');

  let months = newMonths;
  while (remainingDays > 0) {
    const daysInMonth = currentDate.daysInMonth();
    if (remainingDays >= daysInMonth) {
      months++;
      remainingDays -= daysInMonth;
      currentDate = currentDate.add(1, 'month');
    } else break;
  }

  if (!remainingDays) return `${months} мес.`;
  return `${months} мес. ${remainingDays} дн.`;
};

export const paymentStatusesDict = {
  NEW: 'Создан',
  CONFIRMED: 'Успешно',
  CONFIRMING: 'В процессе',
  REJECTED: 'Отколнён банком',
};

export type TPaymentStatuses = keyof typeof paymentStatusesDict;
