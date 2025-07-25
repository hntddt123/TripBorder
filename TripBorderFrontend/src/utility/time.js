import { DateTime } from 'luxon';

export const formatDateMM = (date) => DateTime.fromISO(date).toFormat('MM');
export const formatDateMMM = (date) => DateTime.fromISO(date).toFormat('MMM');
export const formatDateMMMM = (date) => DateTime.fromISO(date).toFormat('MMMM');
export const formatDatedd = (date) => DateTime.fromISO(date).toFormat('dd');
export const formatDateyyyy = (date) => DateTime.fromISO(date).toFormat('yyyy');
export const formatDateMMMddyyyy = (date) => DateTime.fromISO(date).toFormat('MMM dd, yyyy');
export const formatDateMMMMddyyyy = (date) => DateTime.fromISO(date).toFormat('MMMM dd, yyyy');
export const formatDateMMMMddyyyyHHmm = (date) => DateTime.fromISO(date).toFormat('MMMM dd, yyyy HH:mm');
export const formatDateMMMMddyyyyZZZZ = (date) => DateTime.fromISO(date).toFormat('MMMM dd, yyyy ZZZZ');
export const formatDateMMMMddyyyyHHmmssZZZZ = (date) => DateTime.fromISO(date).toFormat('MMMM dd, yyyy HH:mm:ss ZZZZ');
export const formatDateyyyyMMdd = (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd');

export const checkDateToDay = (date1, date2) => (date1.hasSame(date2, 'day'));
export const isDatePast = (date) => ((DateTime.fromISO(date) - DateTime.now().startOf('day')) < 0);
export const isStartDateAfterEndDate = (startDate, endDate) => ((DateTime.fromISO(endDate) - DateTime.fromISO(startDate)) < 0);
export const isEndDateBeforeStartDate = (endDate, startDate) => ((DateTime.fromISO(endDate) - DateTime.fromISO(startDate)) < 0);

export const setLocalTime = (date) => DateTime.fromISO(date);
export const breakfastTime = DateTime.local().set({ hour: 8, minute: 0, second: 0, millisecond: 0 });
export const lunchTime = DateTime.local().set({ hour: 12, minute: 0, second: 0, millisecond: 0 });
export const dinnerTime = DateTime.local().set({ hour: 18, minute: 0, second: 0, millisecond: 0 });

export const isMealTimeValid = (value, tripData) => {
  if (value === '') {
    return '';
  }

  const mealTime = DateTime.fromISO(value);
  if (!mealTime.isValid) {
    return 'Invalid Meal Time format';
  }

  const now = DateTime.local();
  if (mealTime < now) {
    return 'Meal Time cannot be past';
  }
  // e.g., 2025-07-25T00:00:00-06:00
  const startDate = DateTime.fromISO(tripData.start_date).startOf('day');
  if (mealTime < startDate) {
    return 'Meal Time cannot be before Trip Start Date';
  }
  // Exclusive end: 2025-07-26T00:00:00-06:00
  const endDate = DateTime.fromISO(tripData.end_date).plus({ days: 1 }).startOf('day');
  if (mealTime >= endDate) {
    return 'Meal Time cannot be after Trip End Date';
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
