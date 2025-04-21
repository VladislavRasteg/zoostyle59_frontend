import { parse, addMinutes, format } from 'date-fns';

export const addMinutesToTime = (timeString: string, minutesToAdd: number) => {
    // Парсим строку времени в объект Date
    const time = parse(timeString, 'HH:mm', new Date());
    
    // Прибавляем указанное количество минут
    const newTime = addMinutes(time, minutesToAdd);
    
    // Форматируем новый объект Date обратно в строку времени
    return format(newTime, 'HH:mm');
};