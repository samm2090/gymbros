export function formatDate(date: Date) {
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const yyyy = date.getUTCFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export function getWeekNumber(date: Date) {
  const cloneDate = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );

  return Math.ceil(cloneDate.getUTCDate() / 7)
}

export function getWeekStartDate(date: Date) {
  const weekStart = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  return weekStart;
}

export function getWeekEndDate(date: Date) {
  const weekEnd = getWeekStartDate(date);
  weekEnd.setDate(weekEnd.getDate() + 6);
  return weekEnd;
}
