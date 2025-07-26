import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import CustomButton from '../CustomButton';
import { usePostMealByTripIDMutation } from '../../api/mealsAPI';
import CustomError from '../CustomError';
import {
  breakfastTime,
  lunchTime,
  dinnerTime
} from '../../utility/time';

function ButtonMealsUpload({ filteredResult }) {
  const [PostMealByTripID, { isLoading, error }] = usePostMealByTripIDMutation();
  const tripData = useSelector((state) => state.tripReducer);

  const handleClick = (mealTime) => () => {
    if (tripData.uuid) {
      const meals = {
        trips_uuid: tripData.uuid,
        name: filteredResult.name,
        address: filteredResult.location.formatted_address,
        meal_time: mealTime
      };
      PostMealByTripID(meals);
    }
  };

  return (
    <>
      <CustomButton
        className='buttonPOIAdd'
        label='+Breakfast'
        onClick={handleClick(breakfastTime(tripData.start_date))}
        disabled={tripData.uuid === ''}
      />
      <CustomButton
        className='buttonPOIAdd'
        label='+Lunch'
        onClick={handleClick(lunchTime(tripData.start_date))}
        disabled={tripData.uuid === ''}
      />
      <CustomButton
        className='buttonPOIAdd'
        label='+Dinner'
        onClick={handleClick(dinnerTime(tripData.start_date))}
        disabled={tripData.uuid === ''}
      />
      {(isLoading) ? <div>Creating...</div> : null}
      {(error) ? <CustomError error={error} /> : null}
    </>
  );
}

ButtonMealsUpload.propTypes = {
  filteredResult: PropTypes.shape({
    name: PropTypes.string,
    location: PropTypes.shape({
      formatted_address: PropTypes.string
    })
  })
};

export default ButtonMealsUpload;
