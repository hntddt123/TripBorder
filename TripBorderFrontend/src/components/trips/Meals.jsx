import { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  useGetMealsByTripIDQuery,
  useUpdateMealByUUIDMutation,
  useDeleteMealMutation
} from '../../api/mealsAPI';
import {
  formatDateMMMMddyyyyHHmm,
  formatDateMMMdyyyy,
  setLocalTime,
  isTimeValid
} from '../../utility/time';
import CustomToggle from '../CustomToggle';
import CustomError from '../CustomError';
import CustomButton from '../CustomButton';

function Meals({ tripID }) {
  const [isEditing, setIsEditing] = useState(false);
  const [mealTimes, setMealTimes] = useState({});
  const [inputErrors, setInputErrors] = useState({});

  const tripData = useSelector((state) => state.tripReducer);
  const isLoadTrip = useSelector((state) => state.userSettingsReducer.isLoadTrip);

  const { data, isLoading, isFetching, error } = useGetMealsByTripIDQuery({ tripID });
  const [updateMeal] = useUpdateMealByUUIDMutation();
  const [deleteMeal] = useDeleteMealMutation();
  const { meals } = data || {};

  // Group meals by formatted date
  const dateGroupedMeals = (() => {
    const result = {};
    meals?.forEach((meal) => {
      const date = formatDateMMMdyyyy(meal.meal_time);
      result[date] = (result[date] || []).concat([meal]);
    });
    return result;
  })();

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
      <div className='underline underline-offset-2'>Meal Time</div>
      <div className='px-2 font-mono'>{formatDateMMMMddyyyyHHmm(meal.meal_time)}</div>
      {(isEditing) ? (
        <div>
          <input
            className='customInput'
            id={`meal_time_${meal.uuid}`}
            type='datetime-local'
            name='meal_time'
            value={mealTimes[meal.uuid] || ''}
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
                    title={meal.name}
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
      {(isLoading) ? <div>Loading Meals...</div> : null}
      {isFetching && <div>Fetching new page...</div>}
      {(error) ? <CustomError error={error} /> : null}
    </div>
  );
}

Meals.propTypes = {
  tripID: PropTypes.string,
};

export default Meals;
