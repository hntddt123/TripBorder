import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import CustomButton from '../CustomButton';
import { usePostMealByTripIDMutation } from '../../api/mealsAPI';
import CustomError from '../CustomError';
import {
  setLocalTime,
} from '../../utility/time';

function ButtonMealsUpload({ filteredResult }) {
  const {
    uuid,
    startDate,
  } = useSelector((state) => state.tripReducer);

  const [PostMealByTripID, { isLoading, error }] = usePostMealByTripIDMutation();

  const handleClick = (mealTime) => () => {
    if (uuid) {
      const meals = {
        trips_uuid: uuid,
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
        label='+Meal'
        onClick={handleClick(setLocalTime(startDate))}
        disabled={uuid === ''}
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
