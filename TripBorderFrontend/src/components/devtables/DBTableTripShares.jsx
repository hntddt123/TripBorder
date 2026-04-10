import { useState } from 'react';
import { useGetTripSharesAllQuery } from '../../api/tripSharesAPI';
import CustomButton from '../CustomButton';
import CustomError from '../CustomError';
import CustomLoading from '../CustomLoading';
import CustomFetching from '../CustomFetching';

export default function DBTableTripSharesDev() {
  const [page, setPage] = useState(1);
  const limit = 3;
  const { data, isLoading, isFetching, error } = useGetTripSharesAllQuery({ page, limit });
  const { tripShares, total, totalPages, page: currentPage } = data || {};

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
      <div>trip_shares</div>
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
            <th>shared_email</th>
            <th>shared_at</th>
            <th>created_at</th>
            <th>updated_at</th>
          </tr>
        </thead>
        <tbody>
          {tripShares?.map((tripShare) => (
            <tr key={tripShare.uuid}>
              <td className='tdScroll'>{tripShare.uuid}</td>
              <td className='tdScroll'>{tripShare.trips_uuid}</td>
              <td>{tripShare.shared_email}</td>
              <td>{tripShare.shared_at}</td>
              <td>{tripShare.created_at}</td>
              <td>{tripShare.updated_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
