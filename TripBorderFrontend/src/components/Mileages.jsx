import { useState } from 'react';
import { useSelector } from 'react-redux';
import { processBytea } from '../utility/processBytea';
import { getLocalTime } from '../utility/time';
import { useGetMileagesQuery, useUpdateMileagesVerificationMutation } from '../api/mileagesAPI';
import { authAPI } from '../api/authAPI';
import CustomButton from './CustomButton';

function Mileages() {
  const [selectedUUID, setSelectedUUID] = useState();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const { data: mileages, isLoading, error } = useGetMileagesQuery();
  const [updateMileagesVerification, verification] = useUpdateMileagesVerificationMutation();
  const user = useSelector(authAPI.endpoints.checkAuthStatus.select());

  const showPopup = () => setIsPopupOpen(true);
  const hidePopup = () => setIsPopupOpen(false);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{`Status: ${error.status} - ${error.error}`}</div>;
  }

  const handleMileageVerification = (uuid, verified) => {
    updateMileagesVerification({ uuid: uuid, verified: verified });
    setSelectedUUID(uuid);
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
            {/* {isPopupOpen && (
              <div className='popup' onClick={hidePopup}>
                <div className='popup-content' onClick={(e) => e.stopPropagation()}>
                  <h2>Popup Title</h2>
                  <p>This is a popup overlay!</p>
                  <button onClick={hidePopup}>Close</button>
                </div>
              </div>
            )} */}
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
          <div className='flex justify-center text-center'>
            <div>
              <CustomButton
                disabled={mileage.is_verified}
                label='Verify'
                onClick={() => handleMileageVerification(mileage.uuid, true)}
              />
              <CustomButton
                disabled={!mileage.is_verified}
                label='Unverify'
                onClick={() => handleMileageVerification(mileage.uuid, false)}
              />
              <div>
                {(verification.data && selectedUUID === mileage.uuid)
                  ? (verification.data.message)
                  : null}
              </div>
            </div>
          </div>
          {renderMileagesItem(mileage)}
        </div>
      )));
    }
    return (mileages?.filter((mileage) => mileage.is_verified)?.map((mileage) => (
      <div key={mileage.uuid}>
        <div className='cardMileage'>
          {renderMileagesItem(mileage)}
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
