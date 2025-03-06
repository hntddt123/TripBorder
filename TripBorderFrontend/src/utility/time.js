export const getLocalTime = (date) => new Date(date).toLocaleString(undefined, {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZoneName: 'shortOffset',
  hour12: false
});
