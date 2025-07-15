import { DateTime } from 'luxon';

export const getDate = (date) => DateTime.fromISO(date).toISODate();

export const formatDateMMMMddyyyy = (date) => DateTime.fromISO(date).toFormat('MMMM dd, yyyy');
export const formatDateMMMMddyyyyhhmmss = (date) => DateTime.fromISO(date).toFormat('MMMM dd, yyyy hh:mm:ss');

export const getLocalTime = (date) => new Date(date).toLocaleString(undefined, {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZoneName: 'shortOffset',
  hour12: false
});

export const getLocalTimeToMin = (date) => new Date(date).toLocaleString(undefined, {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  timeZoneName: 'shortOffset',
  hour12: false
});

export const getLocalTimeToSecond = (date) => new Date(date).toLocaleString(undefined, {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: '2-digit',
  timeZoneName: 'shortOffset',
  hour12: false
});

export const isMileageExpired = (mileageExpiredAt) => {
  // Parse PostgreSQL timestamp as UTC (adjust time zone if needed)
  const expiryDate = DateTime.fromISO(mileageExpiredAt, { zone: 'utc' });

  // Get current date at midnight in UTC
  const today = DateTime.now().setZone('utc').startOf('day');

  return (expiryDate <= today);
};
