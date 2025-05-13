// age.ts
/**
 * Подбирает правильную форму слова в зависимости от числа (русский язык).
 */
function plural(n: number, one: string, few: string, many: string): string {
    const mod10  = n % 10;
    const mod100 = n % 100;
  
    if (mod10 === 1 && mod100 !== 11)                    return one;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  
    return many;
  }
  
  /**
   * Возвращает возраст в формате «x лет, y мес.».
   *
   * @param birthDate Дата рождения.
   * @param now       “Сегодня”; по умолчанию — текущая дата (удобно для тестов).
   * @throws RangeError если дата рождения находится в будущем.
   * @throws TypeError  если birthDate — невалидный объект Date.
   */
  export function formatAge(birthDate: Date, now: Date = new Date()): string {
    if (!(birthDate instanceof Date) || Number.isNaN(birthDate.getTime())) {
      throw new TypeError("birthDate must be a valid Date");
    }
    if (birthDate > now) {
      throw new RangeError("birthDate cannot be in the future");
    }
  
    let years  = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth()    - birthDate.getMonth();
  
    // Если ещё не наступил день рождения в текущем месяце —
    // «забираем» один месяц и, при необходимости, год.
    if (now.getDate() < birthDate.getDate()) {
      months--;
    }
    if (months < 0) {
      months += 12;
      years--;
    }
  
    return `${years} ${plural(years, "год", "года", "лет")}, ` +
           `${months} ${plural(months, "месяц", "месяца", "месяцев")}`;
  }