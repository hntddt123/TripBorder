import { useState } from 'react';
import { useGetTripTagsAllQuery } from '../../api/tripTagsAPI';
import CustomButton from '../CustomButton';

function DBTableTripTagsDev() {
  const [page, setPage] = useState(1);
  const limit = 3;
  const { data, isLoading, isFetching, error } = useGetTripTagsAllQuery({ page, limit });
  const { tripTags, total, totalPages, page: currentPage } = data || {};

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
      <div>trip_tags</div>
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
            <th>tags_uuid</th>
          </tr>
        </thead>
        <tbody>
          {tripTags?.map((tripTag) => (
            <tr key={tripTag.uuid}>
              <td>{tripTag.uuid}</td>
              <td>{tripTag.trips_uuid}</td>
              <td>{tripTag.tags_uuid}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DBTableTripTagsDev;
