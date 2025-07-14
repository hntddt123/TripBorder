import { useState } from 'react';
import PropTypes from 'prop-types';
import { useDeleteMealsMutation, useGetMealsByTripIDQuery } from '../../api/mealsAPI';
import { getLocalTimeToSecond } from '../../utility/time';
import CustomToggle from '../CustomToggle';
import CustomError from '../CustomError';
import CustomButton from '../CustomButton';

function Meals({ tripID }) {
  const { data, isLoading, isFetching, error } = useGetMealsByTripIDQuery({ tripID });
  const [deleteMeal] = useDeleteMealsMutation();
  const { meals } = data || {};

  const [isEditing, setIsEditing] = useState(false);

  const handleEditButton = () => {
    setIsEditing(!isEditing);
  };

  const renderDetail = (meal) => (
    <div>
      <div>{`Time: ${getLocalTimeToSecond(meal.meal_time)}`}</div>
      <div>{`Address: ${meal.address}`}</div>
    </div>
  );

  const renderMealsItem = (meal) => (
    <div className='flex justify-center'>
      <CustomToggle
        className='container overflow-x-auto -tracking-wider text-center'
        aria-label={`Meal Button ${meal.uuid}`}
        id={meal.uuid}
        title={meal.name}
        component={renderDetail(meal)}
      />
    </div>
  );

  return (
    <div className='overflow-x-auto table-fixed whitespace-nowrap'>
      <div className='text-center'>
        {meals?.length > 0 ? 'Meals' : null}
        {meals?.length > 0 ? <CustomButton className='editButton' label='✏️' onClick={handleEditButton} /> : null}
      </div>
      {meals?.map(((meal) => (
        <div key={meal.uuid}>
          <div>
            {renderMealsItem(meal)}
          </div>
          <div className='text-center'>
            {(isEditing) ? <CustomButton label={`🗑️ ${meal.name}`} onClick={() => deleteMeal(meal.uuid)} /> : null}
          </div>
        </div>
      )))}
      {isFetching && <div>Fetching new page...</div>}
      {(isLoading) ? <div>Creating...</div> : null}
      {(error) ? <CustomError error={error} /> : null}
    </div>
  );
}

Meals.propTypes = {
  tripID: PropTypes.string,
};

export default Meals;
