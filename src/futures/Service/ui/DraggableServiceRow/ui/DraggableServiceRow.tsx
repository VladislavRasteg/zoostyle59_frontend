import React from 'react';
import { Row } from '@tanstack/react-table';
import { IService } from '@/interfaces/interfaces';
import s from './DraggableServiceRow.module.scss';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { IconDragDot } from '@arco-design/web-react/icon';
import { flexRender } from '@tanstack/react-table';

interface DraggableRowProps {
  row: Row<IService>;
  onRowClick: (service: IService) => void;
  groupId: string;
  activeId: number | null;
}

export const DraggableServiceRow: React.FC<DraggableRowProps> = ({
  row,
  onRowClick,
  groupId,
  activeId,
}) => {
  const isDragging = activeId === row.original.id;

  const { attributes, listeners, setNodeRef } = useDraggable({
    id: row.original.id,
    data: {
      groupId,
    },
  });

  // Hide the row when it's being dragged
  const style = {
    opacity: isDragging ? 0 : 1,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      onClick={() => onRowClick(row.original)}
      {...attributes}
      className={s.trb}
    >
      <td {...listeners} className={s.dragHandleCell}>
        <IconDragDot />
      </td>
      {row.getVisibleCells().map(
        (cell) =>
          cell.column.columnDef.cell !== 'drag' && (
            <td key={cell.id} className={s.tdb}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          )
      )}
    </tr>
  );
};
