import { useState } from 'react';
import { useSelector } from 'react-redux';
import { processBytea } from '../utility/processBytea';
import { getLocalTime } from '../utility/time';
import { useGetMileagesQuery, useUpdateMileagesMutation } from '../api/mileagesAPI';
import { authAPI } from '../api/authAPI';
import CustomButton from './CustomButton';

function Mileages() {
  const [selectedUUID, setSelectedUUID] = useState();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const { data: mileages, isLoading, error } = useGetMileagesQuery();
  const [updateMileages, update] = useUpdateMileagesMutation();
  const user = useSelector(authAPI.endpoints.checkAuthStatus.select());

  const showPopup = () => setIsPopupOpen(true);
  const hidePopup = () => setIsPopupOpen(false);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{`Status: ${error.status} - ${error.error}`}</div>;
  }

  const handleMileageUpdate = (uuid, updates) => {
    updateMileages({ uuid: uuid, updates: updates });
    setSelectedUUID(uuid);
  };

  const renderPopUp = (mileage) => {
    if (isPopupOpen) {
      return (
        <div className='popup'>
          <div className='popup-content'>
            <img
              className='pictureMileage'
              src={`data:image/png;base64,${processBytea(mileage.mileage_picture)}`}
              alt='Mileage'
            />
            <CustomButton onClick={hidePopup} label='Close' />
          </div>
        </div>
      );
    }
    return null;
  };

  const renderMileagesItem = (mileage) => (
    <div className='flex overflow-x-auto max-w-full justify-center'>
      <div>
        <div>{`Airline: ${mileage.airline}`}</div>
        <div>{`Frequent Flyer No: ${mileage.frequent_flyer_number}`}</div>
        <div>{`Price: $${mileage.mileage_price}`}</div>
        <div>{`Mileage: ${mileage.mileage_amount} ${mileage.mileage_unit}`}</div>
        <div>{`Expire: ${getLocalTime(mileage.mileage_expired_at)}`}</div>
        <div>{`Created: ${getLocalTime(mileage.created_at)}`}</div>
        <div>{`Updated: ${getLocalTime(mileage.updated_at)}`}</div>
        <div>
          <button onClick={showPopup}>
            <img
              className='pictureMileage'
              src={`data:image/png;base64,${processBytea(mileage.mileage_picture)}`}
              alt='Mileage'
            />
          </button>
        </div>
      </div>
    </div>
  );

  const renderMileages = () => {
    if (mileages && user.data?.role === 'admin') {
      return (mileages?.map((mileage) => (
        <div key={mileage.uuid} className='cardMileage'>
          <div className='flex-col justify-center text-center'>
            <div>
              <CustomButton
                disabled={mileage.is_verified}
                label='Verify'
                onClick={() => handleMileageUpdate(mileage.uuid, { is_verified: true })}
              />
              <CustomButton
                disabled={!mileage.is_verified}
                label='Unverify'
                onClick={() => handleMileageUpdate(mileage.uuid, { is_verified: false })}
              />
            </div>
            <div>
              <CustomButton
                disabled={mileage.is_listed}
                label='Enlist'
                onClick={() => handleMileageUpdate(mileage.uuid, { is_listed: true })}
              />
              <CustomButton
                disabled={!mileage.is_listed}
                label='Unlist'
                onClick={() => handleMileageUpdate(mileage.uuid, { is_listed: false })}
              />
              <div>
                {(update.data && selectedUUID === mileage.uuid)
                  ? (update.data.message)
                  : null}
              </div>
            </div>
          </div>
          {renderMileagesItem(mileage)}
          {renderPopUp(mileage)}
        </div>
      )));
    }
    return (mileages
      ?.filter((mileage) => mileage.is_verified)
      ?.filter((mileage) => mileage.is_listed)
      ?.map((mileage) => (
        <div key={mileage.uuid}>
          <div className='cardMileage'>
            {renderMileagesItem(mileage)}
            {renderPopUp(mileage)}
          </div>
        </div>
      )));
  };

  return (
    <div className='text-3xl overflow-x-auto table-fixed whitespace-nowrap'>
      <div className='text-center'>Mileages Exchange</div>
      {renderMileages()}
    </div>
  );
}

export default Mileages;
