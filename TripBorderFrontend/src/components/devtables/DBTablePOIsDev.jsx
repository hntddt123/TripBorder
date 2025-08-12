import { useState } from 'react';
import { useGetPOIsAllQuery } from '../../api/poisAPI';
import CustomButton from '../CustomButton';
import CustomError from '../CustomError';
import CustomLoading from '../CustomLoading';
import CustomFetching from '../CustomFetching';

export default function DBTablePOIsDev() {
  const [page, setPage] = useState(1);
  const limit = 3;
  const { data, isLoading, isFetching, error } = useGetPOIsAllQuery({ page, limit });
  const { pois, total, totalPages, page: currentPage } = data || {};

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (isLoading) {
    return <div><CustomLoading isLoading={isLoading} /></div>;
  }

  if (error) {
    return <CustomError error={error} />;
  }

  return (
    <div>
      <div>points_of_interest</div>
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
      <div>
        <CustomFetching isFetching={isFetching} text='Fetching new page' />
      </div>
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
