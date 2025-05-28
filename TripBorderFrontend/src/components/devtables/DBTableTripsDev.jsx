import { useState } from 'react';
import { useGetTripsAllQuery } from '../../api/tripsAPI';
import CustomButton from '../CustomButton';

function DBTableTripsDev() {
  const [page, setPage] = useState(1);
  const limit = 3;
  const { data, isLoading, isFetching, error } = useGetTripsAllQuery({ page, limit });
  const { trips, total, totalPages, page: currentPage } = data || {};

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{`Status: ${error.status} - ${error.error}`}</div>;
  }

  return (
    <div>
      <div>trips</div>
      <div className='text-center'>
        <CustomButton
          label='Previous'
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1 || isFetching}
        />

        <span>
          Page {currentPage} of {totalPages}
          (Total: {total} items)
        </span>

        <CustomButton
          label='Next'
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages || isFetching}
        />
      </div>
      {isFetching && <div>Fetching new page...</div>}
      <table>
        <thead>
          <tr>
            <th>uuid</th>
            <th>owner_email</th>
            <th>title</th>
            <th>start_date</th>
            <th>end_date</th>
            <th>created_at</th>
            <th>updated_at</th>
          </tr>
        </thead>
        <tbody>
          {trips?.map((trip) => (
            <tr key={trip.uuid}>
              <td>{trip.uuid}</td>
              <td>{trip.owner_email}</td>
              <td>{trip.title}</td>
              <td>{trip.start_date}</td>
              <td>{trip.end_date}</td>
              <td>{trip.created_at}</td>
              <td>{trip.updated_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DBTableTripsDev;
