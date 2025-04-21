import { TitledBlock } from '@/shared/TitledBlock';
import { observer } from 'mobx-react-lite';
import s from './Billing.module.scss';
import { useContext, useEffect, useState } from 'react';
import { Context } from '@/index';
import { Button } from '@/shared/Button';
import { Reveal } from '@/shared/Reveal';
// @ts-ignore
import { ReactComponent as MailCircle } from '@/assets/MailCircle.svg';

import {
  EBillingTypes,
  employeesCountVariants,
  getBillingStatusInfo,
  getFullPeriodPrice,
  getMonthPrice,
  getPeriodDiscount,
  periodVariants,
  subTimeLeft,
  TMonths,
  totalSubDuration,
} from './utils';
import { BillingInfoCard } from './components/BillingInfoCard';
import { Divider, Stack } from '@mui/material';
import { numberWithSpaces } from '@/utils/numberWithSpaces';
import { pay, requestIndividualOffer } from '@/http/billingAPI';
import { ITenant } from '@/interfaces/interfaces';
import { fetchUserTenant } from '@/http/tenantAPI';

export const ManageBilling = observer(() => {
  const { user, tenant: tenantStore } = useContext(Context);

  const [tenant, setTenant] = useState<ITenant>(tenantStore?._tenant);
  useEffect(() => {
    fetchUserTenant().then(({ data }) => {
      setTenant(data);
      setEmployeesMaxCount(data?.employeesMaxCount);
      data?.subscribtionMonths && setSelectedPeriod(data?.subscribtionMonths);
    });
  }, [user]);

  const [employeesMaxCount, setEmployeesMaxCount] = useState<number>(
    tenant.employeesMaxCount >= 15 ? 15 : tenant.employeesMaxCount,
  );

  const [selectedPeriod, setSelectedPeriod] = useState<TMonths>(12);

  const isPossibleToEqualSub =
    tenant?.employeesMaxCount === employeesMaxCount &&
    tenant?.subscribtionType === EBillingTypes.TYPE_SUBSRIBE;

  const fullPeriodPrice = getFullPeriodPrice(selectedPeriod, employeesMaxCount);

  const periodDiscount = getPeriodDiscount(
    selectedPeriod,
    employeesMaxCount,
    isPossibleToEqualSub ? tenant?.subscribtionDateTo : undefined,
    isPossibleToEqualSub ? (tenant?.subscribtionMonths as TMonths) : undefined,
  );

  const payHandler = async () => {
    const { data } = await pay(employeesMaxCount, selectedPeriod);
    if (data?.success) {
      window.open(data?.PaymentURL, '_blank');
    }
  };

  return (
    <div className={`${s.vertical_container} ${s.main_container}`}>
      {tenant?.subscribtionType !== EBillingTypes.TYPE_SUBSRIBE && (
        <BillingInfoCard
          {...getBillingStatusInfo(
            tenant?.subscribtionType,
            tenant?.subscribtionDateTo,
            !!tenant?.payments?.length,
          )}
        />
      )}
      <div className={s.horizontal_container}>
        <div className={s.vertical_container}>
          <Reveal duration={0.8} delay={0.2}>
            <TitledBlock
              title='Выберите количество пользователей'
              description='Количество пользователей можно увеличить в любой момент'
            >
              <div className={s.employeesCountPicker}>
                {employeesCountVariants?.map(count => (
                  <Button
                    disabled={
                      (tenant.employeesMaxCount >= 15 ? 15 : tenant.employeesMaxCount) -
                        count.value >
                      0
                    }
                    theme={employeesMaxCount === count.value ? 'primary' : 'tetrinary'}
                    key={count.value}
                    className={s.employeesCountButton}
                    onClick={() => setEmployeesMaxCount(count.value)}
                  >
                    {count.label}
                  </Button>
                ))}
              </div>
            </TitledBlock>
          </Reveal>

          {employeesMaxCount < 15 && (
            <Reveal duration={0.8} delay={0.4}>
              <TitledBlock
                title='Выберите период'
                description='Подписка оплачивается один раз за весь период'
              >
                <div className={s.periodPicker}>
                  {periodVariants?.map(period => (
                    <div
                      key={period.value}
                      className={`${s.periodButton} ${
                        period.value === selectedPeriod ? s.checked : ''
                      }`}
                      onClick={() => setSelectedPeriod(period.value)}
                    >
                      <span className={s.label}>{period.label}</span>
                      <span className={s.hint}>
                        {getMonthPrice(period?.value, employeesMaxCount)} ₽ /месяц
                      </span>
                    </div>
                  ))}
                </div>
              </TitledBlock>
            </Reveal>
          )}
        </div>
        <div className={s.vertical_container}>
          {employeesMaxCount < 15 ? (
            <Reveal duration={0.8} delay={0.3}>
              <TitledBlock title='Детализация'>
                <Stack direction='row' justifyContent='space-between' alignItems='center'>
                  <span color='#17203480'>Стоимость лиценции</span>
                  <span style={{ whiteSpace: 'nowrap' }}>
                    {numberWithSpaces(fullPeriodPrice)} ₽
                  </span>
                </Stack>

                <Stack direction='row' justifyContent='space-between' alignItems='center'>
                  <span color='#17203480'>Cрок лицензии</span>
                  <span style={{ whiteSpace: 'nowrap' }}>
                    {periodVariants.find(p => p?.value === selectedPeriod)?.label}
                  </span>
                </Stack>

                <Stack direction='row' justifyContent='space-between' alignItems='center'>
                  <span color='#17203480'>
                    {isPossibleToEqualSub ? 'Стоимость текущей лицензии' : 'Индивидуальная скидка'}
                  </span>
                  <span style={{ whiteSpace: 'nowrap' }}>{numberWithSpaces(periodDiscount)} ₽</span>
                </Stack>

                {isPossibleToEqualSub && (
                  <Stack direction='row' justifyContent='space-between' alignItems='center'>
                    <span color='#17203480'>Эквивалентный срок текущей лицензии</span>
                    <span style={{ whiteSpace: 'nowrap' }}>
                      {subTimeLeft(tenant?.subscribtionDateTo)}
                    </span>
                  </Stack>
                )}

                <Divider
                  orientation='horizontal'
                  sx={{ borderWidth: '1px', borderColor: '#43587590' }}
                />

                <Stack direction='row' justifyContent='space-between' alignItems='center'>
                  <span color='#17203480'>Итоговый срок лицензии</span>
                  <span style={{ whiteSpace: 'nowrap' }}>
                    {isPossibleToEqualSub
                      ? totalSubDuration(tenant?.subscribtionDateTo, selectedPeriod)
                      : periodVariants.find(p => p?.value === selectedPeriod)?.label}
                  </span>
                </Stack>

                <Stack direction='row' justifyContent='space-between' alignItems='center'>
                  <span color='#17203480'>Дата окончания срока действия лицензии</span>
                  <span style={{ whiteSpace: 'nowrap' }}>
                    {totalSubDuration(tenant?.subscribtionDateTo, selectedPeriod, true)}
                  </span>
                </Stack>

                <Divider
                  orientation='horizontal'
                  sx={{ borderWidth: '1px', borderColor: '#43587590' }}
                />

                <Stack direction='row' justifyContent='space-between' alignItems='center'>
                  <span color='#17203480'>Итого к оплате</span>
                  <span style={{ whiteSpace: 'nowrap', fontSize: '22px' }}>
                    {numberWithSpaces(
                      getMonthPrice(selectedPeriod, employeesMaxCount) * selectedPeriod,
                    )}
                    ₽
                  </span>
                </Stack>

                <Button fullWidth onClick={payHandler}>
                  Оплатить
                </Button>
              </TitledBlock>
            </Reveal>
          ) : (
            <Reveal duration={0.8} delay={0.2}>
              <TitledBlock style={{ alignItems: 'center', justifyContent: 'center' }}>
                <MailCircle />
                <span style={{ textAlign: 'center', fontWeight: 500, fontSize: '18px' }}>
                  {tenant?.waitingIndividualOffer ? 'Заявка отправлена' : 'Стоимость по запросу'}
                </span>
                <span style={{ textAlign: 'center', fontSize: '14px' }}>
                  {tenant?.waitingIndividualOffer
                    ? 'Мы свяжемся с вами как можно скорее'
                    : 'Отправьте заявку на консультацию, чтобы с вами связался наш менеджер и рассчитал для вас индивидуальное предложение'}
                </span>
                {!tenant?.waitingIndividualOffer && (
                  <Button fullWidth onClick={requestIndividualOffer}>
                    Отправить заявку
                  </Button>
                )}
              </TitledBlock>
            </Reveal>
          )}
        </div>
      </div>
    </div>
  );
});
