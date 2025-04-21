// DraggedRow.tsx
import React from 'react';
import s from './DraggedServiceRow.module.scss';
import { IService } from '@/interfaces/interfaces';
import { Typography } from '@/shared/Typography';

interface DraggedRowProps {
  service: IService;
}

export const DraggedServiceRow: React.FC<DraggedRowProps> = ({ service }) => {
  return (
    <div className={s.draggedRow}>
      <Typography variant='h3'>{service.name}</Typography>
      <Typography variant='h3'>Стоимость: {service.price} ₽</Typography>
    </div>
  );
};
