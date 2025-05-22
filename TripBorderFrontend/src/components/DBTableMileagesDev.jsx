import { useState } from 'react';
import { useGetMileagesAllQuery } from '../api/mileagesAPI';
import CustomButton from './CustomButton';
import CustomImageComponent from './CustomImageComponent';
import { arrayToBase64 } from '../utility/processBytea';

function DBTableMileagesDev() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, isLoading, isFetching, error } = useGetMileagesAllQuery({ page, limit });
  const { mileages, total, totalPages, page: currentPage } = data || {};

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
      <div>mileages</div>
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
            <th>is_listed</th>
            <th>is_verified</th>
            <th>is_ocr_verified</th>
            <th>owner_email</th>
            <th>uuid</th>
            <th>frequent_flyer_number</th>
            <th>airline</th>
            <th>mileage_price</th>
            <th>mileage_amount</th>
            <th>mileage_unit</th>
            <td>mileage_picture</td>
            <td>mileage_picture_base64</td>
            <th>mileage_expired_at</th>
            <th>created_at</th>
            <th>updated_at</th>
          </tr>
        </thead>
        <tbody>
          {mileages?.map((mileage) => (
            <tr key={mileage.uuid}>
              <td>{mileage.is_listed.toString()}</td>
              <td>{mileage.is_verified.toString()}</td>
              <td>{mileage.is_ocr_verified.toString()}</td>
              <td>{mileage.owner_email}</td>
              <td>{mileage.uuid}</td>
              <td>{mileage.frequent_flyer_number}</td>
              <td>{mileage.airline}</td>
              <td>{mileage.mileage_price}</td>
              <td>{mileage.mileage_amount}</td>
              <td>{mileage.mileage_unit}</td>
              <td>
                <CustomImageComponent
                  uuid={mileage.uuid}
                  bytea={mileage.mileage_picture}
                />
              </td>
              <td>
                {arrayToBase64(mileage.mileage_picture.data).slice(0, 20)}
              </td>
              <td>{mileage.mileage_expired_at}</td>
              <td>{mileage.created_at}</td>
              <td>{mileage.updated_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DBTableMileagesDev;
