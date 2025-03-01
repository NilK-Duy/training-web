import moment from "moment";

export const isDateLessThan7DaysApart = (date1: string, date2: string) => {
  const moment1 = moment(date1);
  const moment2 = moment(date2);
  const differenceInDays = moment1.diff(moment2, "days");
  return differenceInDays < 7;
};

export function formatDateString(date: string): string {
  const dateObject = new Date(date);
  const daysOfWeek: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthsOfYear: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dayOfWeek: string = daysOfWeek[dateObject.getDay()];
  const month: string = monthsOfYear[dateObject.getMonth()];
  const dayOfMonth: number = dateObject.getDate();
  const year: number = dateObject.getFullYear();
  const hour: number = dateObject.getHours() % 12 || 12;
  const minute: number = dateObject.getMinutes();
  const ampm: string = dateObject.getHours() >= 12 ? "PM" : "AM";
  return `${dayOfWeek} ${month} ${dayOfMonth}/${year} ${hour}:${minute.toString().padStart(2, "0")} ${ampm}`;
}
export function validateTags(text: string): boolean {
  const tagRegex = /#\w+(?:\s+|\b)/g;
  const matchedTags = text.match(tagRegex);
  return matchedTags !== null && matchedTags.join("") === text;
}
export const checkSpecialCharacters = (str: string) => {
  const regex = /[!@#$%^*+\=\[\]{};':"\\|,<>\/?]+/;
  return regex.test(str);
};

export function formatDateTime(value: Date): string {
  const date = new Date(value);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

export const formatVietnamTime = (utcTimeString: string): string => {
  const utcTime: Date = new Date(utcTimeString);
  const vnTime: Date = new Date(utcTime.getTime() + 7 * 60 * 60 * 1000);
  const options: Intl.DateTimeFormatOptions = {
    hour12: true,
    hour: "numeric",
    minute: "2-digit",
    month: "numeric",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Ho_Chi_Minh",
  };
  return vnTime.toLocaleString("en-US", options);
};
