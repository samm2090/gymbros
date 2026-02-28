import { DateTime } from "luxon";

export function getRegionCurrentDate(zone = "America/Lima") {
  return DateTime.local().setZone(zone).toJSDate();
}

export function getRegionDate(date: Date | string, zone = "America/Lima") {
  return typeof date === "string"
    ? DateTime.fromISO(date).setZone(zone).toJSDate()
    : DateTime.fromJSDate(date).setZone(zone).toJSDate();
}

export function getWeekDay(date: Date | string) {
  return typeof date === "string"
    ? DateTime.fromISO(date).weekday
    : DateTime.fromJSDate(date).weekday;
}

export function formatDate(date: Date) {
  return typeof date === "string"
    ? DateTime.fromISO(date).toFormat("dd/MM/yyyy")
    : DateTime.fromJSDate(date).toFormat("dd/MM/yyyy");
}

export function getWeekNumber(date: Date) {
  return typeof date === "string"
    ? DateTime.fromISO(date).weekNumber
    : DateTime.fromJSDate(date).weekNumber;
}

export function getWeekStartDate(date: Date) {
  const dateTime = DateTime.fromJSDate(date);
  return dateTime.startOf("week").startOf("day").toJSDate();
}

export function getWeekEndDate(date: Date) {
  const dateTime = DateTime.fromJSDate(date);
  return dateTime.endOf("week").endOf("day").toJSDate();
}

export function getMonthsDiff(
  initialDateInput: Date | string,
  lastDateInput: Date | string,
) {
  const initialDate =
    typeof initialDateInput === "string"
      ? DateTime.fromISO(initialDateInput)
      : DateTime.fromJSDate(initialDateInput);

  const lastDate =
    typeof lastDateInput === "string"
      ? DateTime.fromISO(lastDateInput)
      : DateTime.fromJSDate(lastDateInput);

  return Math.floor(lastDate.diff(initialDate, "months").months) || 0;
}
