import { useState } from 'react';
import { useGetHotelsAllQuery } from '../../api/hotelsAPI';
import CustomButton from '../CustomButton';
import CustomError from '../CustomError';
import CustomLoading from '../CustomLoading';
import CustomFetching from '../CustomFetching';

export default function DBTableHotelsDev() {
  const [page, setPage] = useState(1);
  const limit = 3;
  const { data, isLoading, isFetching, error } = useGetHotelsAllQuery({ page, limit });
  const { hotels, total, totalPages, page: currentPage } = data || {};

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
      <div>hotels</div>
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
            <th>check_in</th>
            <th>check_out</th>
            <th>booking_reference</th>
          </tr>
        </thead>
        <tbody>
          {hotels?.map((hotel) => (
            <tr key={hotel.uuid}>
              <td>{hotel.uuid}</td>
              <td>{hotel.trips_uuid}</td>
              <td>{hotel.name}</td>
              <td>{hotel.address}</td>
              <td>{hotel.check_in}</td>
              <td>{hotel.check_out}</td>
              <td>{hotel.booking_reference}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
