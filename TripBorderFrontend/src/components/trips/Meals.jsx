import PropTypes from 'prop-types';
import { useGetMealsByTripIDQuery } from '../../api/mealsAPI';
import { getLocalTime } from '../../utility/time';
import CustomToggle from '../CustomToggle';
import CustomError from '../CustomError';

function Meals({ tripID }) {
  const { data, isLoading, isFetching, error } = useGetMealsByTripIDQuery({ tripID });
  const { meals } = data || {};

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <CustomError error={error} />;
  }

  const renderDetail = (meal) => (
    <div>
      <div>{`Time: ${getLocalTime(meal.meal_time)}`}</div>
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
      {isFetching && <div>Fetching new page...</div>}
      {meals?.map(((meal) => (
        <div key={meal.uuid}>
          <div>
            {renderMealsItem(meal)}
          </div>
        </div>
      )))}
    </div>
  );
}

Meals.propTypes = {
  tripID: PropTypes.string,
};

export default Meals;
