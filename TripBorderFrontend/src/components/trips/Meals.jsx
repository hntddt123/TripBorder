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

  const renderMealsItem = (meal) => (
    <CustomToggle
      translate='no'
      className='container overflow-x-auto -tracking-wider text-center'
      aria-label={`Meal Button ${meal.uuid}`}
      id={meal.uuid}
      title={meal.name}
      component={renderDetail(meal)}
    />
  );

  return (
    <div>
      <div className='text-center'>
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
        {meals?.map(((meal) => (
          <div key={meal.uuid}>
            <div className='text-pretty'>
              {renderMealsItem(meal)}
            </div>
            <div>
              {(isEditing)
                ? (
                  <CustomButton
                    translate='no'
                    label={`🗑️ ${meal.name}`}
                    onClick={() => deleteMeal(meal.uuid)}
                  />
                )
                : null}
            </div>
          </div>
        )))}
      </div>
      {isFetching && <div>Fetching new page...</div>}
      {(isLoading) ? <div>Loading Meals...</div> : null}
      {(error) ? <CustomError error={error} /> : null}
    </div>
  );
}

Meals.propTypes = {
  tripID: PropTypes.string,
};

export default Meals;
