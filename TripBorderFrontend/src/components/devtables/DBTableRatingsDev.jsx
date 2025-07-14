import { useState } from 'react';
import { useGetRatingsAllQuery } from '../../api/ratingsAPI';
import CustomButton from '../CustomButton';
import CustomError from '../CustomError';

function DBTableRatingsDev() {
  const [page, setPage] = useState(1);
  const limit = 3;
  const { data, isLoading, isFetching, error } = useGetRatingsAllQuery({ page, limit });
  const { ratings, total, totalPages, page: currentPage } = data || {};

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
      <div>ratings</div>
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
            <th>entity_id</th>
            <th>entity_type</th>
            <th>comment</th>
            <th>score</th>
            <th>owner_email</th>
            <th>created_at</th>
            <th>updated_at</th>
          </tr>
        </thead>
        <tbody>
          {ratings?.map((rating) => (
            <tr key={rating.uuid}>
              <td>{rating.uuid}</td>
              <td>{rating.trips_uuid}</td>
              <td>{rating.entity_id}</td>
              <td>{rating.entity_type}</td>
              <td>{rating.comment}</td>
              <td>{rating.score}</td>
              <td>{rating.owner_email}</td>
              <td>{rating.created_at}</td>
              <td>{rating.updated_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DBTableRatingsDev;
