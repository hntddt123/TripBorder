import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import CustomButton from '../CustomButton';
import { usePostMealsByTripIDMutation } from '../../api/mealsAPI';
import CustomError from '../CustomError';

function ButtonMealsUpload({ filteredResult }) {
  const [PostMealsByTripID, { isLoading, error }] = usePostMealsByTripIDMutation();
  const tripData = useSelector((state) => state.tripReducer);

  const handleClick = () => {
    if (tripData.uuid) {
      const meals = {
        trips_uuid: tripData.uuid,
        name: filteredResult.name,
        address: filteredResult.location.formatted_address,
        meal_time: tripData.start_date
      };
      PostMealsByTripID(meals);
    }
  };

  return (
    <>
      <CustomButton
        className='buttonPOIAdd'
        label='+Meals'
        onClick={handleClick}
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
