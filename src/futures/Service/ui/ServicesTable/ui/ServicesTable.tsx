// ServicesTable.tsx
import React, { useEffect, useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { IGroup, IService } from '@/interfaces/interfaces';
import s from './ServicesTable.module.scss';
import { Switcher } from '@/shared/Switcher';
import { ChevronDownIcon } from '@/shared/Icons/ChevronDownIcon';
import { ChevronUpIcon } from '@/shared/Icons/ChevronUpIcon';
import { Typography } from '@/shared/Typography';
import { getPluralNoun } from '@/utils/getPluralNoun';
import { Button } from '@/shared/Button';
import { IconEdit, IconPlus } from '@arco-design/web-react/icon';
import { useDroppable } from '@dnd-kit/core';
import { DraggableServiceRow } from '../../DraggableServiceRow';

interface ServicesTableProps {
  title: string;
  services: IService[];
  onRowClick: (service: IService) => void;
  opened?: boolean;
  isOpen?: boolean;
  groupId: string;
  isDragging: boolean;
  activeId: number | null;
  addService: (procedure_id: undefined, group_id: number) => void
  onGroupEdit?: () => void
}

const columnHelper = createColumnHelper<IService>();

const columns = [
//   columnHelper.display({
//     id: 'drag',
//     cell: () => null,
//     header: () => null,
//   }),
  columnHelper.accessor('name', {
    header: () => 'Название',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('price', {
    header: () => 'Стоимость',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('duration', {
    header: () => 'Продолжительность',
    cell: (info) => info.getValue(),
  }),
];

export const ServicesTable: React.FC<ServicesTableProps> = ({
  title,
  services,
  onRowClick,
  opened = true,
  isOpen = false,
  groupId,
  isDragging,
  activeId,
  addService,
  onGroupEdit
}) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [isOpened, setIsOpened] = useState(opened);

  useEffect(() => {
    setIsOpened(!(services && services.length > 0) ? false : opened);
  }, [services]);

  if (!services) return null;

  const table = useReactTable({
    data: services,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const { setNodeRef } = useDroppable({
    id: groupId,
  });

  // Добавляем класс при перетаскивании
  const tableWrapperClass = `${s.table_name_wrapper} ${isOpened ? s.opened : ''} ${
    isDragging ? s.dragging : ''
  }`;

  return (
    <div ref={setNodeRef} className={tableWrapperClass}>
      <div className={s.table_name}>
        <div className={s.table_name_services}>
          <Typography color="primary" variant="h3" className={s.table_name_text}>
            {title}
          </Typography>
          <Typography className={s.count} color="secondary" variant="h3">
            {services.length} {getPluralNoun(services.length, ['услуга', 'услуги', 'услуг'])}
          </Typography>
        </div>
        <div className={s.table_name_buttons}>
          <Button size="small" theme="tetrinary" onClick={() => addService(undefined, Number(groupId))}>
            <IconPlus /> Добавить услугу
          </Button>
          {
            onGroupEdit &&
            <Button size="small" iconOnly theme="tetrinary" onClick={onGroupEdit}>
              <IconEdit />
            </Button>
          }
        </div>
      </div>
      {services && services.length > 0 && (
        <div className={s.table_wrapper}>
          <div className={s.table}>
            <table>
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className={s.trh}>
                    <th className={s.th}></th>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className={s.tdh}>
                        <div
                          {...{
                            className: header.column.getCanSort() ? s.tdh_sorting : '',
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: <ChevronUpIcon size={1} />,
                            desc: <ChevronDownIcon size={1} />,
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <DraggableServiceRow
                    key={row.id}
                    row={row}
                    onRowClick={onRowClick}
                    groupId={groupId}
                    activeId={activeId}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
