import { DateTime } from 'luxon';

export const getDate = (date) => DateTime.fromISO(date).toISODate();

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

export const breakfastTime = DateTime.now().set({ hour: 8, minute: 0, second: 0, millisecond: 0 });
export const lunchTime = DateTime.now().set({ hour: 12, minute: 0, second: 0, millisecond: 0 });
export const dinnerTime = DateTime.now().set({ hour: 18, minute: 0, second: 0, millisecond: 0 });
export const checkInTime = DateTime.now();
export const checkOutTime = DateTime.now();

export const isMileageExpired = (mileageExpiredAt) => {
  // Parse PostgreSQL timestamp as UTC (adjust time zone if needed)
  const expiryDate = DateTime.fromISO(mileageExpiredAt, { zone: 'utc' });

  // Get current date at midnight in UTC
  const today = DateTime.now().setZone('utc').startOf('day');

  return (expiryDate <= today);
};
