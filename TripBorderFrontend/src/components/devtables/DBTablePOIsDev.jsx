import { useState } from 'react';
import { useGetPOIsAllQuery } from '../../api/poisAPI';
import CustomButton from '../CustomButton';

function DBTablePOIsDev() {
  const [page, setPage] = useState(1);
  const limit = 3;
  const { data, isLoading, isFetching, error } = useGetPOIsAllQuery({ page, limit });
  const { pois, total, totalPages, page: currentPage } = data || {};

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
      <div>points_of_interest</div>
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
            <th>trips_uuid</th>
            <th>name</th>
            <th>address</th>
          </tr>
        </thead>
        <tbody>
          {pois?.map((poi) => (
            <tr key={poi.uuid}>
              <td>{poi.uuid}</td>
              <td>{poi.trips_uuid}</td>
              <td>{poi.name}</td>
              <td>{poi.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DBTablePOIsDev;
