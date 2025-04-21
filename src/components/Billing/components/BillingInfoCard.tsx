import { FC } from 'react';
import s from './BillingInfoCard.module.scss';

import { IBillingInfoCardProps } from '../utils';
import { classNames } from '@/shared/lib/classNames/classNames';

export const BillingInfoCard: FC<IBillingInfoCardProps> = ({ message, hint, variant }) => {
  return (
    <div className={classNames(s.cardWrapper, {}, [s[variant]])}>
      <span className={s.message}>{message}</span>
      {hint && <span className={s.hint}>{hint}</span>}
    </div>
  );
};
