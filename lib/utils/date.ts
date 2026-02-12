import { DateTime } from "luxon";

export function getRegionCurrentDate(zone = "America/Lima") {
  return DateTime.local().setZone(zone).toJSDate();
}

export function getRegionDate(date: Date, zone = "America/Lima") {
  return DateTime.fromJSDate(date).setZone(zone).toJSDate();
}

export function getWeekDay(date: Date | string) {
  return typeof date === "string"
    ? DateTime.fromISO(date).weekday
    : DateTime.fromJSDate(date).weekday;
}

export function formatDate(date: Date) {
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const yyyy = date.getUTCFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export function getWeekNumber(date: Date) {
  const startUTC = Date.UTC(date.getUTCFullYear(), 0, 1);
  const nowUTC = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
  );

  const days =
    Math.floor((nowUTC - startUTC) / 86400000) +
    1 +
    new Date(startUTC).getDay();

  return Math.ceil(days / 7);
}

export function getWeekStartDate(date: Date) {
  const dateTime = DateTime.fromJSDate(date);

  return dateTime.startOf("week").startOf("day").toJSDate();
}

export function getWeekEndDate(date: Date) {
  const dateTime = DateTime.fromJSDate(date);
  return dateTime.endOf("week").endOf("day").toJSDate();
}
