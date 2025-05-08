import { DateTime } from 'luxon';

export const getLocalTime = (date) => new Date(date).toLocaleString(undefined, {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
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
