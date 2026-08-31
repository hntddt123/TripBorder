import { setLocalTime, isLocalTimeSameDate } from './time';

export const getDateFillGroupedMeals = (mealsData, startDate, endDate) => {
  const { meals } = mealsData;

  let cursor = setLocalTime(startDate);
  const last = setLocalTime(endDate);

  const result = [];
  while (cursor <= last) {
    const dateLabel = cursor;
    result.push({
      date: dateLabel,
      mealsForDate: meals
        .filter((meal) => (isLocalTimeSameDate(meal.meal_time, dateLabel)
          ? meal
          : null))
    });
    cursor = cursor.plus({ days: 1 });
  }
  return result;
};

export const getDateGroupedHotels = (hotelsData, startDate, endDate) => {
  const { hotels } = hotelsData;

  let cursor = setLocalTime(startDate);
  const last = setLocalTime(endDate);

  const result = [];
  while (cursor <= last) {
    const dateLabel = cursor;
    result.push({
      date: dateLabel,
      hotelsForDate: hotels
        .filter((hotel) => (isLocalTimeSameDate(hotel.check_in, dateLabel)
          || (isLocalTimeSameDate(setLocalTime(hotel.check_out).minus({ days: 1 }), dateLabel))
          ? hotel
          : null))
    });
    cursor = cursor.plus({ days: 1 });
  }
  return result;
};

export const getDateFillGroupedPOIs = (poisData, startDate, endDate) => {
  const { points_of_interest: pois } = poisData;

  let cursor = setLocalTime(startDate);
  const last = setLocalTime(endDate);

  const result = [];
  while (cursor <= last) {
    const dateLabel = cursor;
    result.push({
      date: dateLabel,
      poisForDate: pois
        .filter((poi) => (isLocalTimeSameDate(poi.visit_time, dateLabel)
          ? poi
          : null))
    });
    cursor = cursor.plus({ days: 1 });
  }
  return result;
};

export const getDateFillGroupedTransports = (transportsData, startDate, endDate) => {
  const { transports } = transportsData;

  let cursor = setLocalTime(startDate);
  const last = setLocalTime(endDate);

  const result = [];
  while (cursor <= last) {
    const dateLabel = cursor;
    result.push({
      date: dateLabel,
      transportsForDate: transports
        .filter((transport) => (isLocalTimeSameDate(transport.departure_time, dateLabel)
          ? transport
          : null))
    });
    cursor = cursor.plus({ days: 1 });
  }
  return result;
};
