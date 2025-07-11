import { useState } from 'react';
import { useGetMealsAllQuery } from '../../api/mealsAPI';
import CustomButton from '../CustomButton';
import CustomError from '../CustomError';

function DBTableMealsDev() {
  const [page, setPage] = useState(1);
  const limit = 3;
  const { data, isLoading, isFetching, error } = useGetMealsAllQuery({ page, limit });
  const { meals, total, totalPages, page: currentPage } = data || {};

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <CustomError error={error} />;
  }

  return (
    <div>
      <div>meals</div>
      <div className='text-center'>
        <div>
          <CustomButton
            label='Previous'
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1 || isFetching}
          />
          <CustomButton
            label='Next'
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages || isFetching || totalPages === 0}
          />
        </div>
        <span>
          Page {currentPage} of {totalPages}
          (Total: {total} items)
        </span>
      </div>
      {isFetching && <div>Fetching new page...</div>}
      <table>
        <thead>
          <tr>
            <th>uuid</th>
            <th>trips_uuid</th>
            <th>name</th>
            <th>address</th>
            <th>meal time</th>
          </tr>
        </thead>
        <tbody>
          {meals?.map((meal) => (
            <tr key={meal.uuid}>
              <td>{meal.uuid}</td>
              <td>{meal.trips_uuid}</td>
              <td>{meal.name}</td>
              <td>{meal.address}</td>
              <td>{meal.meal_time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DBTableMealsDev;
