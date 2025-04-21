import DatePicker, { registerLocale } from "react-datepicker";
import ru from 'date-fns/locale/ru';
import s from './Datepicker.module.scss';
import "react-datepicker/dist/react-datepicker.css";
import { FC, InputHTMLAttributes, useRef } from "react";
import {ReactComponent as CalendarIcon} from "@/assets/calendar.svg"

interface IDateicker extends InputHTMLAttributes<HTMLInputElement>{
    date?: Date
    setDate?: (date: Date) => void
    showYearDropdown?: boolean
    showMonthDropdown?: boolean
}

export const Datepicker:FC<IDateicker> = (props) => {
    const {date, setDate, showYearDropdown=false, showMonthDropdown=false, placeholder="", ...otherProps} = props
    
    registerLocale("ru", ru);
    const datepickerRef = useRef(null); 

    const handleClickDatepickerIcon = () => {
        const datepickerElement = datepickerRef.current;
        datepickerElement && datepickerElement.setFocus(true);
      }
    
    return(
        <div className={s.datepicker_wrapper}>
            <DatePicker 
                locale="ru"
                dateFormat="dd.MM.yyyy"
                selected={date}
                onChange={(date: Date) => setDate && setDate(date)}
                ref={datepickerRef}
                {...otherProps}
                showYearDropdown={showYearDropdown}
                placeholderText={placeholder} 
                yearDropdownItemNumber={100}
                scrollableYearDropdown={true}
                showMonthDropdown={showMonthDropdown}
            />
            <span className="calender-placment" onClick={() => handleClickDatepickerIcon()}>
                <CalendarIcon className={s.icon} />
            </span>
        </div>
    )
}