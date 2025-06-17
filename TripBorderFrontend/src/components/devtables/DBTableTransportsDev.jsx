import { useState } from 'react';
import { useGetTransportsAllQuery } from '../../api/transportsAPI';
import CustomButton from '../CustomButton';

function DBTableTransportsDev() {
  const [page, setPage] = useState(1);
  const limit = 3;
  const { data, isLoading, isFetching, error } = useGetTransportsAllQuery({ page, limit });
  const { transports, total, totalPages, page: currentPage } = data || {};

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
      <div>transports</div>
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
            <th>type</th>
            <th>address</th>
            <th>provider</th>
            <th>booking_reference</th>
            <th>departure_time</th>
            <th>arrival_time</th>
            <th>origin</th>
            <th>destination</th>
          </tr>
        </thead>
        <tbody>
          {transports?.map((transport) => (
            <tr key={transport.uuid}>
              <td>{transport.uuid}</td>
              <td>{transport.trips_uuid}</td>
              <td>{transport.name}</td>
              <td>{transport.type}</td>
              <td>{transport.address}</td>
              <td>{transport.provider}</td>
              <td>{transport.booking_reference}</td>
              <td>{transport.departure_time}</td>
              <td>{transport.arrival_time}</td>
              <td>{transport.origin}</td>
              <td>{transport.destination}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DBTableTransportsDev;
