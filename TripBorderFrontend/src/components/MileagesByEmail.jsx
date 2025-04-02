import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetMileagesByEmailQuery, useDeleteMileagesMutation } from '../api/mileagesAPI';
import { authAPI } from '../api/authAPI';
import { getLocalTime } from '../utility/time';
import CustomButton from './CustomButton';
import CustomImageComponent from './CustomImageComponent';

function MileagesByEmail() {
  const user = useSelector(authAPI.endpoints.checkAuthStatus.select());
  const email = user.data?.email;

  const { data: mileages, isLoading, error } = useGetMileagesByEmailQuery(email);
  const [deleteMielage] = useDeleteMileagesMutation();
  const [selectedUUID, setSelectedUUID] = useState();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{`Status: ${error.status} - ${error.error}`}</div>;
  }

  const handlePictureClick = (uuid) => {
    setIsPopupOpen(true);
    setSelectedUUID(uuid);
  };

  const hidePopup = () => setIsPopupOpen(false);

  const removeMileage = (uuid) => {
    deleteMielage(uuid);
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
      {mileages?.map((mileage) => (
        <div key={mileage.uuid} className='cardMileage overflow-x-auto max-w-full items-center'>
          <div className='flex-col overflow-x-auto max-w-full items-center'>
            <div className='overflow-x-auto font-mono -tracking-wider'>
              <div>{mileage.is_verified ? 'Verified ✅' : 'Verified ❌'}</div>
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
                    uuid={mileage.uuid}
                    bytea={mileage.mileage_picture}
                  />
                </button>
              </div>
            </div>
          </div>
          <div className='p-4'>
            <CustomButton label='Delete 🗑️' onClick={() => removeMileage(mileage.uuid)} />
          </div>
        </div>
      ))}
      {renderPopUp()}
    </div>
  );
}

export default MileagesByEmail;
