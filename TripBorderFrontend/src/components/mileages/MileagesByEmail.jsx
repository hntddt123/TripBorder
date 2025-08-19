import { useState, useCallback, useEffect } from 'react';
import { useLazyGetMileagesByEmailQuery, useDeleteMileagesMutation } from '../../api/mileagesAPI';
import { useCheckAuthStatusQuery } from '../../api/authAPI';
import { formatDateMMMMddyyyyZZZZ } from '../../utility/time';
import CustomButton from '../CustomButton';
import CustomImageComponent from '../CustomImageComponent';
import CustomError from '../CustomError';
import CustomLoading from '../CustomLoading';
import CustomFetching from '../CustomFetching';

export default function MileagesByEmail() {
  const { data: user } = useCheckAuthStatusQuery();
  const email = user?.email;

  const [selectedUUID, setSelectedUUID] = useState();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isAutoFetch, setIsAutoFetch] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 3;

  const [getMileagesByEmail, { data, isLoading, isFetching, error }] = useLazyGetMileagesByEmailQuery();
  const [deleteMileage] = useDeleteMileagesMutation();

  const { mileages, total, totalPages, page: currentPage } = data || {};

  useEffect(() => {
    if (email && isAutoFetch) {
      getMileagesByEmail({ email, page, limit });
    }
  }, [page, isAutoFetch]);

  const handleLoadMileages = () => {
    getMileagesByEmail({ email, page, limit });
    setIsAutoFetch(true);
  };

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
      {mileages?.length > 0
        ? (
          <div className='text-xl text-center'>
            <div>Total: {total}</div>
            <div>
              <CustomFetching isFetching={isFetching} />
            </div>
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
        )
        : (
          <CustomButton
            label='Load'
            onClick={handleLoadMileages}
          />
        )}
      <CustomLoading isLoading={isLoading} />
      <CustomError error={error} />
      {mileages?.map((mileage) => (
        <div key={mileage.uuid} className='cardBorderLR overflow-x-auto max-w-full items-center'>
          <div className='flex-col overflow-x-auto max-w-full items-center'>
            <div className='overflow-x-auto font-mono -tracking-wider'>
              <div>{mileage.is_verified ? 'Verified ✅' : 'Verified ❌'}</div>
              <div>{mileage.is_ocr_verified ? 'OCR Verified ✅' : 'OCR Verified ❌'}</div>
              <div>{mileage.is_listed ? 'Listed ✅' : 'Listed ❌'}</div>
              <div>{`Airline: ${mileage.airline}`}</div>
              <div>{`Frequent Flyer No: ${mileage.frequent_flyer_number}`}</div>
              <div>{`Price: $${mileage.mileage_price}`}</div>
              <div>{`Mileage: ${mileage.mileage_amount} ${mileage.mileage_unit}`}</div>
              <div>{`Expire: ${formatDateMMMMddyyyyZZZZ(mileage.mileage_expired_at)}`}</div>
              <div>{`Created: ${formatDateMMMMddyyyyZZZZ(mileage.created_at)}`}</div>
              <div>{`Updated: ${formatDateMMMMddyyyyZZZZ(mileage.updated_at)}`}</div>
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
