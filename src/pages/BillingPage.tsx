import { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { motion } from 'framer-motion';
import { Context } from '@/index';

import s from './Page.module.scss';
import { ManageBilling } from '@/components/Billing/ManageBilling';
import { Payments } from '@/components/Billing/Payments';
import { ITenant } from '@/interfaces/interfaces';
import { fetchUserTenant } from '@/http/tenantAPI';
import { checkTPayment } from '@/http/billingAPI';
import { useLocation } from 'react-router-dom';

export const BillingPage = observer(() => {
  useEffect(() => {
    document.title = 'Биллинг';
  }, []);

  const location = useLocation();

  const { user, tenant: tenantStore } = useContext(Context);
  const [tenant, setTenant] = useState<ITenant>(tenantStore?._tenant);
  useEffect(() => {
    fetchUserTenant().then(({ data }) => {
      setTenant(data);
      setManageBillingVisible(
        data?.subscribtionType === 'expired' || data?.subscribtionType === 'trial',
      );
    });
  }, [user]);

  const [manageBillingVisible, setManageBillingVisible] = useState<boolean>(
    tenant?.subscribtionType === 'expired' || tenant?.subscribtionType === 'trial',
  );

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const checkPaymentParam = searchParams.get('checkPayment');
    if (tenant?.payments?.at(-1)?.id && checkPaymentParam === 'true') {
      checkTPayment(tenant?.payments?.at(-1)?.id);
    }
  }, [tenant, location]);

  return (
    <motion.div
      initial={{ opacity: 0.3 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0.3 }}
      transition={{ duration: 0.4 }}
      className={s.page_wrapper}
    >
      {manageBillingVisible ? (
        <ManageBilling />
      ) : (
        <Payments setManageBillingVisible={() => setManageBillingVisible(true)} />
      )}
    </motion.div>
  );
});
