import dayjs from 'dayjs';
import ruLocale from 'dayjs/locale/ru';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);
dayjs.locale(ruLocale);

const supportedDateFormats = ['DD.MM.YYYY', 'YYYY-MM-DD'];
export const formatDate = (date: string, mask_to: string): string => {
  if (!date) return '';

  const parsedDate = dayjs(date, supportedDateFormats, ruLocale.name);

  if (parsedDate.isValid()) return parsedDate.format(mask_to);
  else {
    // Формат входной даты (date) не найден в supportedDateFormats
    console.error('Недопустимый формат даты');
    return 'Invalid Date';
  }
};
