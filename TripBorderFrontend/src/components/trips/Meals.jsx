import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  useGetMealsByTripIDQuery,
  useUpdateMealByUUIDMutation,
  useDeleteMealMutation
} from '../../api/mealsAPI';
import {
  formatDatecccMMMMddyyyyHHmm,
  formatDatecccMMMdyyyy,
  formatLocalDateTimeString,
  setLocalTime,
  isTimeValid
} from '../../utility/time';
import { setMarker } from '../../redux/reducers/mapReducer';
import CustomToggle from '../CustomToggle';
import CustomError from '../CustomError';
import CustomButton from '../CustomButton';
import CustomLoading from '../CustomLoading';
import CustomFetching from '../CustomFetching';
import { restaurantIcon } from '../../constants/constants';

export default function Meals({ tripID, handleFlyTo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [mealTimes, setMealTimes] = useState({});
  const [inputErrors, setInputErrors] = useState({});

  const tripData = useSelector((state) => state.tripReducer);
  const isLoadTrip = useSelector((state) => state.userSettingsReducer.isLoadTrip);

  const { data, isLoading, isFetching, error } = useGetMealsByTripIDQuery({ tripID });
  const [updateMeal] = useUpdateMealByUUIDMutation();
  const [deleteMeal] = useDeleteMealMutation();
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
      const newMarker = {
        id: new Date().getTime(),
        icon: restaurantIcon,
        lng: meal.location.x,
        lat: meal.location.y
      };
      dispatch(setMarker(newMarker));
      handleFlyTo(meal.location.x, meal.location.y, 18);
    }
  };

  const validateMealTime = (value) => isTimeValid(value, undefined, tripData, 'Meal');

  const handleInputChange = (mealID) => (e) => {
    const { value } = e.target;

    const mealTimeError = validateMealTime(value);

    setInputErrors((prevErrors) => ({
      ...prevErrors,
      [mealID]: mealTimeError,
    }));

    if (!mealTimeError) {
      setMealTimes((prevTimes) => ({
        ...prevTimes,
        [mealID]: value,
      }));
      if (value !== '') {
        updateMeal({
          uuid: mealID,
          updates: {
            meal_time: setLocalTime(value)
          }
        });
      }
    }
  };

  const handleDeleteButton = (mealID) => () => {
    deleteMeal(mealID);
  };
  const handleEditButton = () => {
    setIsEditing(!isEditing);
  };

  const renderDetail = (meal) => (
    <div className='text-pretty px-4'>
      <CustomButton
        label={`Locate ${restaurantIcon}`}
        onClick={flyToLocation(meal)}
      />
      <div className='underline underline-offset-2'>Meal Time</div>
      <div className='px-2 font-mono'>{formatDatecccMMMMddyyyyHHmm(meal.meal_time)}</div>
      {(isEditing) ? (
        <div>
          <input
            className='customInput'
            id={`meal_time_${meal.uuid}`}
            type='datetime-local'
            name='meal_time'
            value={mealTimes[meal.uuid] || formatLocalDateTimeString(meal.meal_time)}
            onChange={handleInputChange(meal.uuid)}
            required
          />
          <div className='text-red-600'>{inputErrors[meal.uuid] || ''}</div>
        </div>
      )
        : null}
      <div className='underline underline-offset-2'>Address</div>
      <div className='px-2 font-mono' translate='no'>{meal.address}</div>
    </div>
  );

  return (
    <div>
      <div className='text-lg text-center'>
        {(meals?.length > 0) && !isEditing ? <span>Meals</span> : null}
        {(isEditing) ? <span>Edit Meals</span> : null}
        {(meals?.length > 0) && !isLoadTrip
          ? (
            <CustomButton
              translate='no'
              className='buttonEdit'
              label='✏️'
              onClick={handleEditButton}
            />
          ) : null}
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
                  <CustomToggle
                    translate='no'
                    className='toggle min-h-12 min-w-72 max-w-72 overflow-x-auto text-center px-4 mb-1'
                    aria-label={`Meal Button ${meal.uuid}`}
                    id={meal.uuid}
                    titleOn={`${meal.name} ▼`}
                    titleOff={`${meal.name} ▶`}
                    component={renderDetail(meal)}
                  />
                </div>
                <div>
                  {(isEditing) ? (
                    <div>
                      <div>
                        <CustomButton
                          className='buttonDelete'
                          translate='no'
                          label={`🗑️ ${meal.name}`}
                          onClick={handleDeleteButton(meal.uuid)}
                        />
                      </div>
                    </div>
                  ) : null}
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

Meals.propTypes = {
  tripID: PropTypes.string,
  handleFlyTo: PropTypes.func
};
