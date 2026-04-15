import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  useGetMealsByTripIDQuery,
} from '../../../api/mealsAPI';
import {
  formatDatecccMMMdyyyy,
  formatDateHHmm
} from '../../../utility/time';
import { setTripMarker } from '../../../redux/reducers/mapReducer';
import CustomToggle from '../../CustomToggle';
import CustomError from '../../CustomError';
import CustomButton from '../../CustomButton';
import CustomLoading from '../../CustomLoading';
import CustomFetching from '../../CustomFetching';
import { restaurantIcon } from '../../../constants/constants';

export default function MealsReadOnly({ tripID, handleFlyTo }) {
  const { data, isLoading, isFetching, error } = useGetMealsByTripIDQuery({ tripID });
  const { meals } = data || {};

  const dispatch = useDispatch();

  // Group meals by formatted date
  const dateGroupedMeals = (() => {
    const result = {};
    meals?.forEach((meal) => {
      const date = formatDatecccMMMdyyyy(meal.meal_time);
      result[date] = (result[date] || []).concat([meal]);
    });
    return result;
  })();

  const flyToLocation = (meal) => () => {
    if (meal.location && handleFlyTo) {
      const newMarker = [{
        id: new Date().getTime(),
        icon: restaurantIcon,
        text: meal.name,
        lng: meal.location.x,
        lat: meal.location.y
      }];
      dispatch(setTripMarker(newMarker));
      handleFlyTo(meal.location.x, meal.location.y, 17);
    }
  };

  const renderDetail = (meal) => (
    <div className='text-pretty px-4'>
      <div className='underline underline-offset-2'>Meal Time</div>
      <div className='px-2 font-mono'>{formatDateHHmm(meal.meal_time)}</div>
      <div className='underline underline-offset-2'>Address</div>
      <div className='px-2 font-mono' translate='no'>{meal.address}</div>
    </div>
  );

  return (
    <div>
      <div className='text-lg text-center'>
        {(meals?.length > 0) ? <span>Meals</span> : null}
      </div>
      {(dateGroupedMeals)
        ? Object.entries(dateGroupedMeals).map(([date, mealsForDate]) => (
          <div key={date}>
            <div>
              {date}
            </div>
            {mealsForDate.map((meal) => (
              <div key={meal.uuid}>
                <div className='text-pretty px-2'>
                  <CustomButton
                    className='buttonLocate'
                    label={restaurantIcon}
                    onClick={flyToLocation(meal)}
                  />
                  <CustomToggle
                    translate='no'
                    className='toggle toggleTrip'
                    aria-label={`Meal Button ${meal.uuid}`}
                    id={meal.uuid}
                    titleOn={`${meal.name} ▼`}
                    titleOff={`${meal.name}`}
                    component={renderDetail(meal)}
                  />
                </div>
              </div>
            ))}
          </div>
        ))
        : null}
      <div>
        <CustomLoading isLoading={isLoading} text='Loading Meals' />
      </div>
      <div>
        <CustomFetching isFetching={isFetching} text='Fetching New Page' />
      </div>
      <div>
        <CustomError error={error} />
      </div>
    </div>
  );
}

MealsReadOnly.propTypes = {
  tripID: PropTypes.string,
  handleFlyTo: PropTypes.func
};
