import { useState, useCallback } from 'react';
import { getLocalTime } from '../utility/time';
import { useGetMileagesQuery } from '../api/mileagesAPI';
import CustomButton from './CustomButton';
import CustomImageComponent from './CustomImageComponent';

function Mileages() {
  const [selectedUUID, setSelectedUUID] = useState();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isFetching, error } = useGetMileagesQuery({ page, limit });

  const { mileages, totalPages, page: currentPage } = data || {};

  const handlePageChange = (newPage) => {
    if (newPage > 0 && (!data || newPage <= data.totalPages)) {
      setPage(newPage);
    }
  };

  const handlePreviousPage = useCallback(() => {
    handlePageChange(page - 1);
  }, [page]);

  const handleNextPage = useCallback(() => {
    handlePageChange(page + 1);
  }, [page]);

  const handlePictureClick = (mileage) => {
    if (mileage.mileage_picture.data.length > 0) {
      setIsPopupOpen(true);
      setSelectedUUID(mileage.uuid);
    }
  };

  const hidePopup = () => setIsPopupOpen(false);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{`Status: ${error.status} - ${error.data?.error}`}</div>;
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

  const renderMileagesItem = (mileage) => (
    <div className='flex justify-center'>
      <div className='container overflow-x-auto font-mono -tracking-wider text-center'>
        <div>{`Airline: ${mileage.airline}`}</div>
        <div>{`Frequent Flyer No: ${mileage.frequent_flyer_number}`}</div>
        <div>{`Price: $${mileage.mileage_price}`}</div>
        <div>{`Mileage: ${mileage.mileage_amount} ${mileage.mileage_unit}`}</div>
        <div>{`Expire: ${getLocalTime(mileage.mileage_expired_at)}`}</div>
        <div>{`Created: ${getLocalTime(mileage.created_at)}`}</div>
        <div>{`Updated: ${getLocalTime(mileage.updated_at)}`}</div>
        <div>
          <button
            aria-label={`Mileage Picture Button ${mileage.uuid}`}
            id={mileage.uuid}
            onClick={() => handlePictureClick(mileage)}
          >
            <CustomImageComponent
              uuid={mileage.uuid}
              bytea={mileage.mileage_picture}
            />
          </button>
        </div>
      </div>
    </div>
  );

  const renderMileages = () => (mileages
    ?.filter((mileage) => mileage.is_verified)
    ?.filter((mileage) => mileage.is_listed)
    ?.map((mileage) => (
      <div key={mileage.uuid}>
        <div className='cardMileage'>
          {renderMileagesItem(mileage)}
        </div>
      </div>
    )));

  const filteredMileages = data?.mileages.filter(
    (mileage) => mileage.is_verified && mileage.is_listed
  );

  return (
    <div className='text-3xl overflow-x-auto table-fixed whitespace-nowrap'>
      <div className='text-center'>Mileages Exchange</div>
      <div className='text-center'>
        <div>
          Listed {filteredMileages.length} Mileages
        </div>
        <div>Page {currentPage} of {totalPages}</div>
        {isFetching && <div>Fetching new page...</div>}
        <CustomButton
          aria-label='Next Page Button'
          label='Previous'
          onClick={handlePreviousPage}
          disabled={page === 1 || isFetching}
        />
        <CustomButton
          aria-label='Previous Page Button'
          label='Next'
          onClick={handleNextPage}
          disabled={page === totalPages || isFetching}
        />
      </div>
      {renderMileages()}
      {renderPopUp()}
    </div>
  );
}

export default Mileages;
