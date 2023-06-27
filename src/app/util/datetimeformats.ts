export function myDateTimeFormat(date: Date) {
  return `${dayOfTheMonthFormat(date)} ${monthFormat(date)} ${hourFormat(date)}:${minuteFormat(date)}`
}

export function minuteFormat(date: Date) {
  return String(`${date.getMinutes()}`).padStart(2, '0');
}

export function hourFormat(date: Date) {
  return String(`${date.getHours()}`).padStart(2, '0');
}

export function dayOfTheMonthFormat(date: Date) {
  return String(`${date.getDate()}`).padStart(2, '0');
}

export function monthFormat(date: Date) {
  switch (date.getMonth()) {
    case 1: return "Jan";
    case 2: return "Feb";
    case 3: return "Mar";
    case 4: return "Apr";
    case 5: return "May";
    case 6: return "Jun";
    case 7: return "Jul";
    case 8: return "Aug";
    case 9: return "Sep";
    case 10: return "Oct";
    case 11: return "Nov";
    case 12: return "Dec";
    default: return "Invalid month";
  }
}

export function weekDayFormat(date: Date) {
  switch (date.getDay()) {
    case 1: return "Mon";
    case 2: return "Tue";
    case 3: return "Wed";
    case 4: return "Thu";
    case 5: return "Fri";
    case 6: return "Sat";
    case 7: return "Sun";
    default: return "Invalid weekday";
  }
}