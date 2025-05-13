import React, {useState, useEffect, useRef, useContext} from "react";
import s from "./Content.module.scss";
import ModalContent from "@/components/Modal/ModalContent";
import {Form} from "react-bootstrap";
import ModalFooter from "@/components/Modal/ModalFooter";
import {Button as SharedButton} from "@/shared/Button";
import Modal from "@/components/Modal/Modal";
import {useForm} from "react-hook-form";
import {createBreak, createDayOff, deleteAllBreaks} from "@/http/breaksAPI";
import {Notification} from "@arco-design/web-react";
import {Context} from "@/index";

interface DoctorCardProps {
  surname: string;
  first_name: string;
  last_name: string;
  breakData: {
    doctor: any;
    date: string;
    branchId: number;
    is_widget_appointment?: boolean;
  };
  refetchCalendar: () => void
}

const DoctorCard = ({surname, first_name, last_name, breakData, refetchCalendar}: DoctorCardProps) => {

  // TODO: отрефаткорить всё что тут есть

  const {user, calendar} = useContext(Context)

  const [showActions, setShowActions] = useState(false);
  const [showAddBreakModal, setShowAddBreakModal] = useState(false)

  const modalRef = useRef<HTMLDivElement>(null);

  function generateAvatar(
    text: string,
    foregroundColor = "white",
    background: any
  ) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = 200;
    canvas.height = 200;

    // Draw background
    if (context) {
      const gr = context.createLinearGradient(50, 30, 150, 150);
      gr.addColorStop(0, background[0]);
      gr.addColorStop(1, background[1]);
      context.fillStyle = gr;
      context.fillRect(0, 0, canvas.width, canvas.height);

      // Draw text
      context.font = "100px Inter";
      context.fillStyle = foregroundColor;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(text, canvas.width / 2, canvas.height / 2);
      return canvas.toDataURL("image/png");
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      event.stopPropagation();
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) setShowActions(false);
    };
    if (showActions) document.addEventListener("mousedown", handleClickOutside);
    else document.removeEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showActions]);

  const {
    register,
    formState: {isValid},
    handleSubmit,
    reset
  } = useForm({mode: "onBlur"});

  const onSubmit = async (data: any) => {
    await createBreak(breakData.doctor?.id, breakData.date, data.time, data.endTime, breakData.branchId)
    refetchCalendar()
    setShowAddBreakModal(false)
    reset()
  }

  const addDayOff = async () => {
    let _realStartTime = ''
    let _realEndTime = ''

    const selectedDate = new Date(calendar.selectedDate)
    const day = selectedDate.getDay()
    if(day === 1){
      _realStartTime = user.currentBranch?.monFrom
      _realEndTime = user.currentBranch?.monTo
    } else if (day === 2) {
      _realStartTime = user.currentBranch?.tueFrom
      _realEndTime = user.currentBranch?.tueTo
    } else if (day === 3) {
      _realStartTime = user.currentBranch?.wedFrom
      _realEndTime = user.currentBranch?.wedTo
    } else if (day === 4) {
      _realStartTime = user.currentBranch?.thuFrom
      _realEndTime = user.currentBranch?.thuTo
    } else if (day === 5) {
      _realStartTime = user.currentBranch?.friFrom
      _realEndTime = user.currentBranch?.friTo
    } else if (day === 6) {
      _realStartTime = user.currentBranch?.satFrom
      _realEndTime = user.currentBranch?.satTo
    } else if (day === 0) {
      _realStartTime = user.currentBranch?.sunFrom
      _realEndTime = user.currentBranch?.sunTo
    }

    if (!breakData.doctor.receptions.length) {
      await createDayOff(breakData.doctor?.id, breakData.date, _realStartTime, _realEndTime, breakData.branchId)
      refetchCalendar()
      setShowActions(false)
    } else {
      setShowActions(false)
      return (Notification.error({
        title: 'Ошибка',
        content: 'У вас есть приёмы на этот день',
      }))
    }
  }

  const removeAllBreaks = async () => {
    await deleteAllBreaks(breakData.doctor?.id, breakData.date, breakData.branchId)
    refetchCalendar()
    setShowActions(false)
  }

  return (
    <div className={s.doctor_card}>
      <div style={{
        width: '100%', height: '100%', display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        gap: '4px'
      }}>
        <img
          alt="Avatar"
          id="avatar"
          src={generateAvatar(
            surname[0].toUpperCase(),
            "#5E2A0D",
            ["#FFBF76", "#FFCE96"]
          )}
        />
        <div className={s.doctor_name}>
          <p>
            {surname} {first_name} {last_name}
          </p>
        </div>
      </div>
      {
        showActions && (
          <div className={s.actions_mini_modal} ref={modalRef}>
            <div className={s.actions_mini_modal__button} onClick={() => {
              setShowActions(false)
              setShowAddBreakModal(true)
            }}>
              Добавить перерыв
            </div>
            <div className={s.actions_mini_modal__button} onClick={() => addDayOff()}>
              Отменить рабочий день
            </div>
            <div className={s.actions_mini_modal__button} onClick={() => removeAllBreaks()}>
              Убрать все перерывы
            </div>
          </div>
        )
      }
      {showAddBreakModal &&
          <Modal show={showAddBreakModal} name='Создание перерыва' setShow={setShowAddBreakModal}>
              <ModalContent height={'120px'}>
                  <Form className='d-flex flex-row rounded-3 gap-3' style={{width: "100%"}}>
                      <div>
                          <Form.Label style={{textAlign: "left", width: "100%"}}>Время начала</Form.Label>
                          <Form.Control
                              type='time'
                              className={s.field}
                              placeholder="Время начала"
                              {...register('time', {required: true})}
                          />
                      </div>
                      <div>
                          <Form.Label style={{textAlign: "left", width: "100%"}}>Время конца</Form.Label>
                          <Form.Control
                              className={s.field}
                              type='time'
                              placeholder="Время конца"
                              {...register('endTime', {required: true})}
                          />
                      </div>
                  </Form>
              </ModalContent>
              <ModalFooter>
                  <SharedButton fullWidth size="big" disabled={!isValid} onClick={handleSubmit(onSubmit)}>
                    Добавить
                  </SharedButton>
              </ModalFooter>
          </Modal>
      }
    </div>
  );
};

export default DoctorCard;
