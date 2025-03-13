import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetMileagesByEmailMutation, useDeleteMileagesMutation } from '../api/mileagesAPI';
import { authAPI } from '../api/authAPI';
import { processBytea } from '../utility/processBytea';
import { getLocalTime } from '../utility/time';

function MileagesByEmail() {
  const user = useSelector(authAPI.endpoints.checkAuthStatus.select());
  const email = user.data?.email;

  const [getMileagesByEmail, { data: mileages, isLoading, error }] = useGetMileagesByEmailMutation();
  const [deleteMielage] = useDeleteMileagesMutation();

  useEffect(() => {
    if (email) {
      getMileagesByEmail(email);
    }
  }, [email, getMileagesByEmail]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{`Status: ${error.status} - ${error.error}`}</div>;
  }

  const removeMileage = (uuid) => {
    deleteMielage(uuid);
  };

  return (
    <div>
      <div className='cardInfo text-3xl p-4'>Uploaded Mileages</div>
      {mileages?.map((mileage) => (
        <div key={mileage.uuid} className='cardMileage overflow-x-auto max-w-full items-center'>
          <div className='p-4'>
            <div>{mileage.is_verified ? 'Verified ✅' : 'Verified ❌'}</div>
            <div>{mileage.is_listed ? 'Listed ✅' : 'Listed ❌'}</div>
          </div>
          <div className='flex-col overflow-x-auto max-w-full items-center'>
            <div className=''>
              <div>{`Airline: ${mileage.airline}`}</div>
              <div>{`Frequent Flyer No: ${mileage.frequent_flyer_number}`}</div>
              <div>{`Price: $${mileage.mileage_price}`}</div>
              <div>{`Mileage: ${mileage.mileage_amount} ${mileage.mileage_unit}`}</div>
            </div>
            <div className=''>
              <div>{`Expire: ${getLocalTime(mileage.mileage_expired_at)}`}</div>
              <div>{`Created: ${getLocalTime(mileage.created_at)}`}</div>
              <div>{`Updated: ${getLocalTime(mileage.updated_at)}`}</div>
            </div>
          </div>
          <div>
            <button className='pictureContainer'>
              <img
                src={`data:image/png;base64,${processBytea(mileage.mileage_picture)}`}
                alt='Mileage'
              />
            </button>
          </div>
          <div className='p-4'>
            <button onClick={() => removeMileage(mileage.uuid)}>Click to Delete 🗑️</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MileagesByEmail;
