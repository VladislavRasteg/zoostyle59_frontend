
import { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import s from './ProceduresList.module.scss';
import { Context } from '../../index';
import { ServiceModal } from '@/widgets/ServiceModal';
import { IService, IGroup } from '@/interfaces/interfaces';
import { useSearchParams } from 'react-router-dom';
import { groupedServices, moveService } from '@/http/proceduresAPI';
import { Button } from '@/shared/Button';

import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverlay
} from '@dnd-kit/core';

import { ServicesTable } from '@/futures/Service/ui/ServicesTable';
import { DraggedServiceRow } from '@/futures/Service/ui/DraggedServiceRow';
import { toast } from 'react-toastify';
import { GroupModal } from '@/widgets/GroupModal';
import { group } from 'console';

const ProceduresList = observer(() => {
  const { user } = useContext(Context);
  const [services, setServices] = useState<IService[]>([]);
  const [groups, setGroups] = useState<IGroup[]>([]);

  const [groupToAdd, setGroupToAdd] = useState<number | undefined>()

  const [show, setShow] = useState(false);
  const [showGroup, setShowGroup] = useState(false);
  
  const [selectedGroup, setSelectedGroup] = useState<IGroup>();

  const [procedure, setProcedure] = useState<IService>();
  const [isEdited, setIsEdited] = useState(false);
  const [searchParams] = useSearchParams();

  const [modalMode, setModalMode] = useState<'create' | 'update'>('create');

  const [activeId, setActiveId] = useState<number | null>(null);

  const [activeService, setActiveService] = useState<IService | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    groupedServices(user.currentBranch?.id).then((data: any) => {
      setServices(data.data.ungroupedServices);
      setGroups(data.data.groups);
      setIsEdited(false);
      if (data.count === 0 && searchParams.get('isNew') === 'true') {
        handleShow();
      }
    });
  }, [isEdited]);

  const handleClose = () => {
    setShow(false);
    setShowGroup(false);
    setIsEdited(true);
  };
  const handleShow = (procedure?: IService | undefined, groupId?: number) => {
    setProcedure(procedure);
    if (procedure) {
      setModalMode('update');
    } else {
      setModalMode('create');
    }
    setGroupToAdd(groupId)
    setShow(true);
  };

  const handleShowGroup = (group?: IGroup) => {
    setSelectedGroup(group)
    setShowGroup(true)
  }

  const handleDragStart = (event: DragStartEvent) => {
    const serviceId = event.active.id as number;
    setActiveId(serviceId);
    const service = findServiceById(serviceId);
    setActiveService(service);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && activeService) {
      const sourceGroupId = getGroupIdByServiceId(activeService.id);
      const targetGroupId = over.id === 'ungrouped' ? null : Number(over.id);

      if (sourceGroupId !== targetGroupId) {
        MoveService(activeService.id, targetGroupId);
        setIsEdited(true);
      }

      setActiveService(null);
      setActiveId(null);
    }
    setActiveId(null);
    setActiveService(null);
  };

  const findServiceById = (id: number): IService | null => {
    // Поиск услуги по id в негруппированных услугах
    let service = services.find((s) => s.id === id);
    if (service) return service;

    // Поиск услуги по id в группах
    for (const group of groups) {
      service = group.services.find((s) => s.id === id);
      if (service) return service;
    }

    return null;
  };

  const getGroupIdByServiceId = (id: number): number | null => {
    // Возвращает groupId для данной услуги
    if (services.find((s) => s.id === id)) return null;

    for (const group of groups) {
      if (group.services.find((s) => s.id === id)) return group.id;
    }

    return null;
  };

  const MoveService = (serviceId: number, targetGroupId: number | null) => {
    if(serviceId){
      moveService(serviceId, targetGroupId)
      .catch((error) => {
        console.error('Ошибка при перемещении услуги: ', error);
      });
    }
    setIsEdited(true);
  };

  const isDragging = activeService != null;

  return (
    <>
      {show && (
        <ServiceModal groupToAdd={groupToAdd} show={show} mode={modalMode} onClose={handleClose} service={procedure} />
      )}
      {showGroup && (
        <GroupModal show={showGroup} mode={modalMode} onClose={handleClose} group={selectedGroup} />
      )}
      <div className={s.table_buttons_wrapper}>
        <div className={s.page_header}>
          <Button size="small" onClick={() => handleShow()}>
            Добавить услугу
          </Button>
          <Button size="small" onClick={() => handleShowGroup()}>
            Добавить группу
          </Button>
        </div>
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          {/* Отображение негруппированных услуг */}
          <ServicesTable
            title="Услуги без группы"
            services={services}
            onRowClick={(service: IService) => handleShow(service)}
            groupId="ungrouped"
            isDragging={isDragging}
            activeId={activeId} // Add this line
            addService={handleShow}
          />
          {/* Отображение группированных услуг */}
          {groups &&
            groups.map((group) => (
              <ServicesTable
                key={group.id}
                title={group.name}
                services={group.services}
                onRowClick={(service: IService) => handleShow(service)}
                groupId={group.id.toString()}
                isDragging={isDragging}
                onGroupEdit={() => {handleShowGroup(group)}}
                activeId={activeId}
                addService={handleShow}
              />
            ))}
            <DragOverlay>
              {activeService ? <DraggedServiceRow service={activeService} /> : null}
            </DragOverlay>
        </DndContext>
      </div>
    </>
  );
});

export default ProceduresList;
