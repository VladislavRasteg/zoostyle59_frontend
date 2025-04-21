import { TitledBlock } from '@/shared/TitledBlock';
import { observer } from 'mobx-react-lite';
import s from './Billing.module.scss';
import React, { FC, useContext, useEffect, useState } from 'react';
import { Context } from '@/index';
import { Reveal } from '@/shared/Reveal';
import { ITenant } from '@/interfaces/interfaces';
import { fetchUserTenant } from '@/http/tenantAPI';
import { numberWithSpaces } from '@/utils/numberWithSpaces';
import {
  getFullPeriodPrice,
  getMonthPrice,
  paymentStatusesDict,
  TMonths,
  TPaymentStatuses,
} from '@/components/Billing/utils';
import { Button } from '@/shared/Button';
import { Stack } from '@mui/material';
import dayjs from 'dayjs';

interface IPaymentsProps {
  setManageBillingVisible: () => void;
}

export const Payments: FC<IPaymentsProps> = observer(({ setManageBillingVisible }) => {
  const { user, tenant: tenantStore } = useContext(Context);

  const [tenant, setTenant] = useState<ITenant>(tenantStore?._tenant);
  useEffect(() => {
    fetchUserTenant().then(({ data }) => {
      setTenant(data);
    });
  }, [user]);

  const realPrice = getFullPeriodPrice(
    tenant?.subscribtionMonths as TMonths,
    tenant?.employeesMaxCount,
  );

  const personalPrice =
    getMonthPrice(tenant?.subscribtionMonths as TMonths, tenant?.employeesMaxCount) *
    tenant?.subscribtionMonths;

  const currentPlan = tenant?.payments?.filter(payment => payment?.status === 'CONFIRMED')?.at(-1)?.plan

  return (
    <Stack width='100%' height='100%' gap='20px'>
      <Stack width='100%' direction='row' gap='20px'>
        <div className={s.vertical_container}>
          <Reveal duration={0.8} delay={0.2}>
            <TitledBlock
              title='Ваш тариф'
              description={`Стоимость ${numberWithSpaces(realPrice)} ₽`}
            >
              <span style={{ whiteSpace: 'nowrap', fontSize: '22px' }}>
                {currentPlan}
              </span>
              <Button fullWidth theme='secondary' onClick={setManageBillingVisible}>
                Управление
              </Button>
            </TitledBlock>
          </Reveal>
        </div>
        <div className={s.vertical_container}>
          <Reveal duration={0.8} delay={0.3}>
            <TitledBlock title='Срок действия' description='Дата окончания'>
              <span style={{ whiteSpace: 'nowrap', fontSize: '22px' }}>
                {tenant?.subscribtionDateTo}
              </span>
            </TitledBlock>
          </Reveal>
        </div>
        <div className={s.vertical_container}>
          <Reveal duration={0.8} delay={0.3}>
            <TitledBlock
              title='Персональная скидка'
              description={`Стоимость со скидкой ${numberWithSpaces(personalPrice)} ₽`}
            >
              <span style={{ whiteSpace: 'nowrap', fontSize: '22px' }}>
                {(((realPrice - personalPrice) / realPrice) * 100).toFixed(0)} %
              </span>
            </TitledBlock>
          </Reveal>
        </div>
      </Stack>
      <Reveal duration={0.8} delay={0.3}>
        <div className={s.table_wrapper}>
          <div className={s.table}>
            <table>
              <thead>
                <tr className={s.trh}>
                  <th className={s.tdh}>Тариф</th>
                  <th className={s.tdh}>Срок</th>
                  <th className={s.tdh}>Период</th>
                  <th className={s.tdh}>Сумма</th>
                  <th className={s.tdh}>Статус</th>
                </tr>
              </thead>
              <tbody>
                {tenant?.payments?.map((payment: any) => (
                  <tr className={s.trb} key={payment?.id}>
                    <td className={s.tdb}>{payment?.plan}</td>
                    <td className={s.tdb}>{payment?.duration}</td>
                    <td className={s.tdb}>
                      {dayjs(payment?.periodFrom).format('DD.MM.YYYY')} -{' '}
                      {dayjs(payment?.periodTo).format('DD.MM.YYYY')}
                    </td>
                    <td className={s.tdb}>{numberWithSpaces(payment?.price)} ₽</td>
                    <td className={s.tdb}>
                      {paymentStatusesDict?.[payment?.status as TPaymentStatuses] || 'Ошибка'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>
    </Stack>
  );
});
