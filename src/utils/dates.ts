import dayjs from "dayjs";

export function getDateRange(
  checkInDate: Date,
  checkOutDate: Date,
  daysToAdd?: number
) {
  const dateRange = [];
  const checkIn = dayjs(checkInDate);
  const checkOut = dayjs(checkOutDate);

  if (daysToAdd) {
    checkOut.add(daysToAdd, "day");
    checkIn.add(daysToAdd, "day");
  }

  const difference = checkOut.diff(checkIn, "day");
  let currentDate = checkIn;

  if (difference <= 0) {
    return [];
  }

  for (let i = 0; i <= difference; i++) {
    dateRange.push(currentDate.toDate());
    currentDate = currentDate.add(1, "day");
  }

  return dateRange;
}

export function stripTimezone(date: Date) {
  // Get year, month, day, hours, minutes, seconds, and milliseconds of the date in local time
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();

  // Create a new date object in UTC with the same date components
  return new Date(
    Date.UTC(year, month, day, hours, minutes, seconds, milliseconds)
  );
}
