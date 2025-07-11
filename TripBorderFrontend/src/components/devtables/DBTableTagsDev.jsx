import { useState } from 'react';
import { useGetTagsAllQuery } from '../../api/tagsAPI';
import CustomButton from '../CustomButton';
import CustomError from '../CustomError';

function DBTableTagsDev() {
  const [page, setPage] = useState(1);
  const limit = 3;
  const { data, isLoading, isFetching, error } = useGetTagsAllQuery({ page, limit });
  const { tags, total, totalPages, page: currentPage } = data || {};

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
      <div>tags</div>
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
            <th>name</th>
          </tr>
        </thead>
        <tbody>
          {tags?.map((tag) => (
            <tr key={tag.uuid}>
              <td>{tag.uuid}</td>
              <td>{tag.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DBTableTagsDev;
