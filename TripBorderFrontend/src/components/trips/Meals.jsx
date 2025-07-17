import { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useDeleteMealsMutation, useGetMealsByTripIDQuery } from '../../api/mealsAPI';
import { formatDateMMMMddyyyyhhmmss } from '../../utility/time';
import CustomToggle from '../CustomToggle';
import CustomError from '../CustomError';
import CustomButton from '../CustomButton';

function Meals({ tripID }) {
  const tripData = useSelector((state) => state.tripReducer);
  const [isEditing, setIsEditing] = useState(false);

  const { data, isLoading, isFetching, error } = useGetMealsByTripIDQuery({ tripID });
  const [deleteMeal] = useDeleteMealsMutation();
  const { meals } = data || {};

  const handleEditButton = () => {
    setIsEditing(!isEditing);
  };

  const renderDetail = (meal) => (
    <div>
      <div>{`Time: ${formatDateMMMMddyyyyhhmmss(meal.meal_time)}`}</div>
      <div translate='no'>{`Address: ${meal.address}`}</div>
    </div>
  );

  return (
    <div>
      <div className='text-xl text-center'>
        {meals?.length > 0 ? <span>Meals</span> : null}
        {meals?.length > 0 && !tripData.isLoadTrip
          ? (
            <CustomButton
              translate='no'
              className='editButton'
              label='✏️'
              onClick={handleEditButton}
            />
          ) : null}
      </div>
      {meals?.map(((meal) => (
        <div key={meal.uuid}>
          <div className='text-pretty px-2'>
            <CustomToggle
              translate='no'
              className='toggle container overflow-x-auto -tracking-wider text-left px-2 mb-1'
              aria-label={`Meal Button ${meal.uuid}`}
              id={meal.uuid}
              title={meal.name}
              component={renderDetail(meal)}
            />
          </div>
          <div>
            {(isEditing)
              ? (
                <CustomButton
                  className='tripButton'
                  translate='no'
                  label={`🗑️ ${meal.name}`}
                  onClick={() => deleteMeal(meal.uuid)}
                />
              )
              : null}
          </div>
        </div>
      )))}
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
