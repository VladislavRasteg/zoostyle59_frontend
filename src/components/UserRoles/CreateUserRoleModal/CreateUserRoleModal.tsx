import s from './CreateUserRoleModal.module.scss'
import { useState } from 'react';
import { iUserRole } from "../../../interfaces/interfaces";
import { Button } from "../../../shared/Button";
import Modal from '../../Modal/Modal';
import ModalFooter from '../../Modal/ModalFooter';
import ModalContent from '../../Modal/ModalContent';
import { Switcher } from '../../../shared/Switcher';
import AnimateHeight from 'react-animate-height';
import {ReactComponent as CalendarIcon} from './assets/calendar.svg'
import {ReactComponent as DropdownIcon} from './assets/dropdown.svg'
import { classNames } from '../../../shared/lib/classNames/classNames';
import { MenuItem, Select } from '../../../shared/Select';
import { FormControl, InputLabel } from '@mui/material';

interface ModalProps {
    show: boolean;
    name: string;
    setShow: Function;
    mode: "create" | "edit";
}

const CreateUserRoleModal = ({show, name, setShow, mode}: ModalProps) => {

    const [viewCalendar, setViewCalendar] = useState(true)
    const [sectionViewCalendar, setSectionViewCalendar] = useState(false)

    const [view_appointments_list, set_view_appointments_list] = useState("Записи всех сотрудников")
    const view_appointments_list_variants = [
            "Записи всех сотрудников",
            "Только свои записи"
        ]


    return (
        <Modal show={show} name={name} setShow={setShow}>
            <ModalContent height="80vh" width="600px">
                <div className={s.modal_body}>
                    <div className={classNames(s.section_card, {[s.opened]: sectionViewCalendar})} onClick={() => setSectionViewCalendar(!sectionViewCalendar)}>
                        <div className={s.section_card_heading}>
                            <div className={s.section_card_icon_wrapper}>
                                <CalendarIcon />
                            </div>
                            <p>Календарь записей</p>
                        </div>
                        <Switcher value={viewCalendar} setValue={setViewCalendar}/>
                        <div className={s.section_card_drop_icon_wrapper}>
                            <DropdownIcon />
                        </div>
                    </div>
                    <AnimateHeight
                        duration={500}
                        height={sectionViewCalendar ? "auto" : 0}
                    >
                        <div className={classNames(s.section_permissions)}>
                            <Select
                                value={view_appointments_list}
                                onChange={e => set_view_appointments_list(e.target.value as string)}
                            >
                                {
                                    view_appointments_list_variants.map((variant: string) => (
                                        <MenuItem key={variant} value={variant}>
                                        {variant}
                                        </MenuItem>
                                    ))
                                }
                            </Select>

                            <p>ам ам ам</p>
                            <p>ам ам ам</p>
                            <p>ам ам ам</p>
                            <p>ам ам ам</p>
                            <p>ам ам ам</p>
                            <p>ам ам ам</p>
                            <p>ам ам ам</p>
                        </div>
                    </AnimateHeight>
                   
                </div>
            </ModalContent>
            <ModalFooter>
                <Button theme="border" size="big" fullWidth>Закрыть</Button>
                {mode === "create" 
                    ? 
                    <Button fullWidth size="big">Создать</Button>
                    :
                    <Button fullWidth size="big">Сохранить</Button>
                }
            </ModalFooter>
        </Modal>
    )
}

export default CreateUserRoleModal