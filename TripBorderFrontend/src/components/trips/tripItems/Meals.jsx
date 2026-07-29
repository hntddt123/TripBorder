import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  useGetMealsByTripIDQuery,
  useUpdateMealByUUIDMutation,
  useDeleteMealMutation
} from '../../../api/mealsAPI';
import {
  formatDatecccMMMdyyyy,
  formatLocalDateTimeString,
  setLocalTime,
  isTimeValid,
  formatDateHHmm
} from '../../../utility/time';
import { setTripMarker } from '../../../redux/reducers/mapReducer';
import CustomToggle from '../../CustomToggle';
import CustomError from '../../CustomError';
import CustomButton from '../../CustomButton';
import CustomLoading from '../../CustomLoading';
import CustomFetching from '../../CustomFetching';
import { restaurantIcon } from '../../../constants/constants';

export default function Meals({ tripID, handleFlyTo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [mealTimes, setMealTimes] = useState({});
  const [inputErrors, setInputErrors] = useState({});

  const trip = useSelector((state) => state.tripReducer);
  const { isLoadTrip } = useSelector((state) => state.tripReducer);

  const { data, isLoading, isFetching, error } = useGetMealsByTripIDQuery({ tripID });
  const [updateMeal] = useUpdateMealByUUIDMutation();
  const [deleteMeal] = useDeleteMealMutation();
  const { meals } = data || {};

  const dispatch = useDispatch();
  const datePickerRefs = useRef({});

  // Group meals by formatted date
  const dateGroupedMeals = (() => {
    const result = {};
    meals?.forEach((meal) => {
      const date = formatDatecccMMMdyyyy(meal.meal_time);
      result[date] = (result[date] || []).concat([meal]);
    });
    return result;
  })();

  const openPicker = (id) => (e) => {
    const input = datePickerRefs.current[id];
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    if (isIOS) {
      const btn = e.currentTarget.getBoundingClientRect();

      // Temporarily place a real-sized invisible input exactly on the button
      Object.assign(input.style, {
        position: 'fixed',
        left: `${btn.left}px`,
        top: `${btn.top}px`,
        width: `${btn.width}px`,
        height: `${btn.height}px`,
        opacity: '0.01',
        zIndex: '99999',
        pointerEvents: 'auto',
      });

      input.focus({ preventScroll: true });

      // Restore after the picker has a chance to open
      setTimeout(() => {
        Object.assign(input.style, {
          position: '',
          left: '',
          top: '',
          width: '',
          height: '',
          opacity: '',
          zIndex: '',
          pointerEvents: '',
        });
      }, 400);
    }
    if (input.showPicker) {
      input.showPicker();
    } else {
      input.click();
    }
  };

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

  const getMealTimeValue = (meal) => {
    if (mealTimes[meal.uuid] === undefined) {
      setMealTimes((prevTimes) => ({
        ...prevTimes,
        [meal.uuid]: formatLocalDateTimeString(meal.meal_time)
      }));
    }
    return mealTimes[meal.uuid];
  };

  const validateMealTime = (value) => isTimeValid(value, undefined, trip, 'Meal');

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
    if (isEditing) {
      setMealTimes({});
      setInputErrors({});
    }
    setIsEditing(!isEditing);
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
      <div className={`flex items-center justify-center text-lg ${isLoadTrip ? '' : 'ml-10'}`}>
        {(meals?.length > 0) && !isEditing ? <div>Meals</div> : null}
        {(isEditing) ? <div>Edit Meals</div> : null}
        {(meals?.length > 0) && !isLoadTrip
          ? (
            <CustomButton
              translate='no'
              className='buttonEdit select-none'
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
                  {(isEditing) ? (
                    <CustomButton
                      className='buttonDelete'
                      translate='no'
                      label='🗑️'
                      onClick={handleDeleteButton(meal.uuid)}
                    />
                  ) : (
                    <>
                      <CustomButton
                        className='buttonLocate text-sm'
                        label={formatDateHHmm(meal.meal_time)}
                        onClick={openPicker(meal.uuid)}
                      />
                      <CustomButton
                        className='buttonLocate'
                        label={restaurantIcon}
                        onClick={flyToLocation(meal)}
                      />
                      <input
                        ref={(el) => {
                          if (el) {
                            datePickerRefs.current[meal.uuid] = el;
                          } else {
                            // clean-up ref when item removed
                            delete datePickerRefs.current[meal.uuid];
                          }
                        }}
                        className='w-0 h-0'
                        id={meal.uuid}
                        type='datetime-local'
                        name='meal_time'
                        value={getMealTimeValue(meal)}
                        onChange={handleInputChange(meal.uuid)}
                        required
                      />
                    </>
                  )}
                  <CustomToggle
                    translate='no'
                    className='toggle toggleTrip'
                    aria-label={`Meal Button ${meal.uuid}`}
                    id={meal.uuid}
                    titleOn={`${meal.name} ▼`}
                    titleOff={`${meal.name}`}
                    component={renderDetail(meal)}
                  />
                  <div className='text-red-600'>{inputErrors[meal.uuid] || ''}</div>
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
