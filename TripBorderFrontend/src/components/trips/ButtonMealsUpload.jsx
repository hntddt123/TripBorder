import { useSelector } from 'react-redux';
import { usePostMealByTripIDMutation } from '../../api/mealsAPI';
import {
  setLocalTime,
} from '../../utility/time';
import CustomButton from '../CustomButton';
import CustomError from '../CustomError';
import CustomLoading from '../CustomLoading';
import { OSMPropTypes } from '../../constants/osmPropTypes';
import { getOSMAddress } from '../../utility/osmFormat';

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
        address: getOSMAddress(filteredResult),
        meal_time: mealTime,
        location: {
          longitude: filteredResult.lon,
          latitude: filteredResult.lat
        }
      };
      PostMealByTripID(meals);
    }
  };

  return (
    <>
      <CustomButton
        className='buttonPOIAdd'
        label='🍱 Meal'
        onClick={handleClick(setLocalTime(startDate))}
        disabled={uuid === ''}
      />
      <CustomLoading isLoading={isLoading} text='Creating...' />
      <CustomError error={error} />
    </>
  );
}

ButtonMealsUpload.propTypes = {
  filteredResult: OSMPropTypes
};
