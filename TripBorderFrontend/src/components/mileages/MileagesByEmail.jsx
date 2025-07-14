import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useGetMileagesByEmailQuery, useDeleteMileagesMutation } from '../../api/mileagesAPI';
import { authAPI } from '../../api/authAPI';
import { getLocalTime } from '../../utility/time';
import CustomButton from '../CustomButton';
import CustomImageComponent from '../CustomImageComponent';
import CustomError from '../CustomError';

function MileagesByEmail() {
  const user = useSelector(authAPI.endpoints.checkAuthStatus.select());
  const email = user.data?.email;

  const [selectedUUID, setSelectedUUID] = useState();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 3;

  const { data, isLoading, isFetching, error } = useGetMileagesByEmailQuery({ email, page, limit });
  const [deleteMileage] = useDeleteMileagesMutation();

  const { mileages, total, totalPages, page: currentPage } = data || {};

  const handlePreviousPage = useCallback(() => {
    setPage(page - 1);
  }, [page]);

  const handleNextPage = useCallback(() => {
    setPage(page + 1);
  }, [page]);

  const handlePictureClick = (uuid) => {
    setIsPopupOpen(true);
    setSelectedUUID(uuid);
  };

  const hidePopup = () => setIsPopupOpen(false);

  const removeMileage = (uuid) => {
    deleteMileage(uuid);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <CustomError error={error} />;
  }

  const renderPopUp = () => {
    let mileage;
    if (selectedUUID !== undefined) {
      mileage = mileages?.filter((m) => m.uuid === selectedUUID)[0];
    }
    if (isPopupOpen && mileage.mileage_picture && mileage.mileage_picture.data.length > 0) {
      return (
        <div className='popup'>
          <div className='popup-content'>
            <div className='flex justify-center'>
              <CustomImageComponent
                className='max-h-96'
                uuid={mileage.uuid}
                bytea={mileage.mileage_picture}
              />
            </div>
            <CustomButton onClick={hidePopup} label='Close' />
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div className='cardInfo text-3xl p-4'>Uploaded Mileages</div>
      <div className='text-xl text-center'>
        <div>Total: {total}</div>
        {isFetching && <div>Fetching new page...</div>}
        <CustomButton
          aria-label='Previous Page Button'
          label='Previous'
          onClick={handlePreviousPage}
          disabled={page === 1 || isFetching}
        />
        <CustomButton
          aria-label='Next Page Button'
          label='Next'
          onClick={handleNextPage}
          disabled={page === totalPages || isFetching || totalPages === 0}
        />
        <div>Page {currentPage} of {totalPages}</div>
      </div>
      {mileages?.map((mileage) => (
        <div key={mileage.uuid} className='cardMileage overflow-x-auto max-w-full items-center'>
          <div className='flex-col overflow-x-auto max-w-full items-center'>
            <div className='overflow-x-auto font-mono -tracking-wider'>
              <div>{mileage.is_verified ? 'Verified ✅' : 'Verified ❌'}</div>
              <div>{mileage.is_ocr_verified ? 'OCR Verified ✅' : 'OCR Verified ❌'}</div>
              <div>{mileage.is_listed ? 'Listed ✅' : 'Listed ❌'}</div>
              <div>{`Airline: ${mileage.airline}`}</div>
              <div>{`Frequent Flyer No: ${mileage.frequent_flyer_number}`}</div>
              <div>{`Price: $${mileage.mileage_price}`}</div>
              <div>{`Mileage: ${mileage.mileage_amount} ${mileage.mileage_unit}`}</div>
              <div>{`Expire: ${getLocalTime(mileage.mileage_expired_at)}`}</div>
              <div>{`Created: ${getLocalTime(mileage.created_at)}`}</div>
              <div>{`Updated: ${getLocalTime(mileage.updated_at)}`}</div>
              <div>
                <button onClick={() => handlePictureClick(mileage.uuid)}>
                  <CustomImageComponent
                    className='max-h-60'
                    uuid={mileage.uuid}
                    bytea={mileage.mileage_picture}
                  />
                </button>
              </div>
            </div>
          </div>
          <div className='p-4'>
            <CustomButton translate='no' label='Delete 🗑️' onClick={() => removeMileage(mileage.uuid)} />
          </div>
        </div>
      ))}
      {renderPopUp()}
    </div>
  );
}

export default MileagesByEmail;
