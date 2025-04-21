import { Context } from "@/index";
import s from "./MobileScrollDatePicker.module.scss"
import { startOfMonth, endOfMonth, eachDayOfInterval, format, addMonths, getDate, getDay } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useContext, useRef, useState } from "react";
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { classNames } from "@/shared/lib/classNames/classNames";

interface IDate{
    date: string
    day: number
    dayOfWeek: string
    isWeekend: boolean
}

const getDatesWithDayNames = (selectedDate: string) => {
    const today = new Date();
    // Получаем начало и конец предыдущего, текущего и следующего месяца
    const prevMonthStart = startOfMonth(addMonths(today, -1));
    const prevMonthEnd = endOfMonth(addMonths(today, -1));
    const currentMonthStart = startOfMonth(today);
    const currentMonthEnd = endOfMonth(today);
    const nextMonthStart = startOfMonth(addMonths(today, 1));
    const nextMonthEnd = endOfMonth(addMonths(today, 1));
  
    // Получаем все даты в интервале
    const prevMonthDates = eachDayOfInterval({ start: prevMonthStart, end: prevMonthEnd });
    const currentMonthDates = eachDayOfInterval({ start: currentMonthStart, end: currentMonthEnd });
    const nextMonthDates = eachDayOfInterval({ start: nextMonthStart, end: nextMonthEnd });
  
    // Объединяем все даты
    const allDates = [...prevMonthDates, ...currentMonthDates, ...nextMonthDates];
  
    // Форматируем даты и добавляем названия дней недели
    const datesList = allDates.map(date => {
      const day = getDate(date);
      const dayOfWeek = format(date, 'EEEEEE', { locale: ru });
      const isWeekend = getDay(date) === 0 || getDay(date) === 6;
      const dayOfWeekNumber = format(date, 'i', { locale: ru });
  
      return {
        date: format(date, 'yyyy-MM-dd'),
        day,
        dayOfWeek,
        isWeekend,
        dayOfWeekNumber
      };
    });

    let initialIndex = 0
    datesList.map((date, index) => {
        if(date.date === selectedDate){
            initialIndex = index - Number(date.dayOfWeekNumber) + 1
        }
    })

  
    return {datesList, initialIndex};
  };

export const MobileScrollDatePicker = () => {
    const {calendar} = useContext(Context)
    const {datesList, initialIndex} = getDatesWithDayNames(calendar.selectedDate)

    const [monthName, setMonthName] = useState("")
    const [show, setShow] = useState(false)

    const clearTimerRef = useRef<NodeJS.Timeout>();

    const slideHandler = (index: number) => {
        setMonthName(format(datesList[index].date, 'LLLL', { locale: ru }))
        setShow(true)
        clearTimeout(clearTimerRef.current)
        clearTimerRef.current = setTimeout(() => {
            setShow(false)
        }, 1500)
    }

    const today = format(new Date(), 'yyyy-MM-dd')

    return(
        <div className={s.mobile_daypicker}>
            {show && <p className={s.month_name}>{monthName}</p>}
            <Swiper
            onSlideChange={(swiper) => slideHandler(swiper.activeIndex)}
            initialSlide={initialIndex}
            spaceBetween={6}
            slidesPerView={7}
            >
                {
                    datesList.map((date: IDate) => 
                        <div>
                            <SwiperSlide 
                                onClick={() => calendar.setSelectedDate(date.date)} 
                                className={classNames(s.date, {[s.selected]: calendar.selectedDate === date.date, [s.today]: today === date.date})}
                            >
                                {/* <p className={`${s.date_day_of_week} ${date.isWeekend ? s.weekend : ""}`}>{date.dayOfWeek}</p> */}
                                <p className={classNames(s.date_day_of_week, {[s.weekend]: date.isWeekend}, [])}>{date.dayOfWeek}</p>
                                <p className={s.date_day}>{date.day}</p>
                            </SwiperSlide>
                        </div>
                    )
                }
            </Swiper>
        </div>
    )
}