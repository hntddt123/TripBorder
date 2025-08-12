import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { usePostMealByTripIDMutation } from '../../api/mealsAPI';
import {
  setLocalTime,
} from '../../utility/time';
import CustomButton from '../CustomButton';
import CustomError from '../CustomError';
import CustomLoading from '../CustomLoading';

export default function ButtonMealsUpload({ filteredResult }) {
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
      <CustomLoading isLoading={isLoading} text='Creating...' />
      <CustomError error={error} />
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
