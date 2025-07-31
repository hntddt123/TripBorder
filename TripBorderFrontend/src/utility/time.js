import { DateTime } from 'luxon';

export const formatDateMM = (date) => DateTime.fromISO(date).toFormat('MM');
export const formatDateMMM = (date) => DateTime.fromISO(date).toFormat('MMM');
export const formatDateMMMM = (date) => DateTime.fromISO(date).toFormat('MMMM');
export const formatDatedd = (date) => DateTime.fromISO(date).toFormat('dd');
export const formatDateyyyy = (date) => DateTime.fromISO(date).toFormat('yyyy');
export const formatDatecccMMMdyyyy = (date) => DateTime.fromISO(date).toFormat('ccc, MMM d, yyyy');
export const formatDateMMMddyyyy = (date) => DateTime.fromISO(date).toFormat('MMM dd, yyyy');
export const formatDateMMMMddyyyy = (date) => DateTime.fromISO(date).toFormat('MMMM dd, yyyy');
export const formatDatecccMMMMddyyyyHHmm = (date) => DateTime.fromISO(date).toFormat('ccc, MMMM dd, yyyy HH:mm');
export const formatDateMMMMddyyyyZZZZ = (date) => DateTime.fromISO(date).toFormat('MMMM dd, yyyy ZZZZ');
export const formatDateMMMMddyyyyHHmmssZZZZ = (date) => DateTime.fromISO(date).toFormat('MMMM dd, yyyy HH:mm:ss ZZZZ');

export const formatLocalDateString = (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd');
export const formatLocalDateTimeString = (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd\'T\'HH:mm');

export const checkDateToDay = (date1, date2) => (date1.hasSame(date2, 'day'));
export const isDatePast = (date) => ((DateTime.fromISO(date) - DateTime.now().startOf('day')) < 0);
export const isStartDateAfterEndDate = (startDate, endDate) => ((DateTime.fromISO(endDate) - DateTime.fromISO(startDate)) < 0);
export const isEndDateBeforeStartDate = (endDate, startDate) => ((DateTime.fromISO(endDate) - DateTime.fromISO(startDate)) < 0);

export const setLocalTime = (date) => DateTime.fromISO(date);
export const breakfastTime = (date) => DateTime.fromISO(date).set({ hour: 8, minute: 0, second: 0, millisecond: 0 });
export const lunchTime = (date) => DateTime.fromISO(date).set({ hour: 12, minute: 0, second: 0, millisecond: 0 });
export const dinnerTime = (date) => DateTime.fromISO(date).set({ hour: 18, minute: 0, second: 0, millisecond: 0 });

export const isTimeValid = (startValue, endValue, tripData, name) => {
  if (startValue === '') {
    return '';
  }

  const time = DateTime.fromISO(startValue);
  if (!time.isValid) {
    return `Invalid ${name} Time format`;
  }

  const now = DateTime.local();
  if (time < now) {
    return `${name} Time cannot be past`;
  }
  // e.g., 2025-07-25T00:00:00-06:00
  const startDate = DateTime.fromISO(tripData.start_date).startOf('day');
  if (time < startDate) {
    return `${name} Time cannot be before Trip Start Date`;
  }
  // Exclusive end: 2025-07-26T00:00:00-06:00
  const endDate = DateTime.fromISO(tripData.end_date).plus({ days: 1 }).startOf('day');
  if (time >= endDate) {
    return `${name} Time cannot be after Trip End Date`;
  }

  const lowerName = name.toLowerCase();
  if (lowerName.includes('check-in') && endValue) {
    const checkOut = DateTime.fromISO(endValue);
    if (checkOut.isValid && time >= checkOut) {
      return `${name} cannot be on or after Check-out`;
    }
  } else if (lowerName.includes('check-out') && endValue) {
    const checkIn = DateTime.fromISO(endValue);
    if (checkIn.isValid && time <= checkIn) {
      return `${name} cannot be on or before Check-in`;
    }
  }

  if (lowerName.includes('departure_time') && endValue) {
    const arrivalTime = DateTime.fromISO(endValue);
    if (arrivalTime.isValid && time >= arrivalTime) {
      return `${name} cannot be on or after arrival_time`;
    }
  } else if (lowerName.includes('arrival_time') && endValue) {
    const departureTime = DateTime.fromISO(endValue);
    if (departureTime.isValid && time <= departureTime) {
      return `${name} cannot be on or before departure_time`;
    }
  }

  return '';
};

export const isMileageExpired = (mileageExpiredAt) => {
  // Parse PostgreSQL timestamp as UTC (adjust time zone if needed)
  const expiryDate = DateTime.fromISO(mileageExpiredAt, { zone: 'utc' });

  // Get current date at midnight in UTC
  const today = DateTime.local().setZone('utc').startOf('day');

  return (expiryDate <= today);
};
