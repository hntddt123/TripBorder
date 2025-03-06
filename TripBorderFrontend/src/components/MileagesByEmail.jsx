import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetMileagesByEmailMutation } from '../api/mileageAPI';
import { authAPI } from '../api/authAPI';
import { processBytea } from '../utility/processBytea';
import { getLocalTime } from '../utility/time';

function MileagesByEmail() {
  const user = useSelector(authAPI.endpoints.checkAuthStatus.select());
  const email = user.data?.email;

  const [getMileagesByEmail, { data: mileages, isLoading, error }] = useGetMileagesByEmailMutation();

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

  return (
    <div>
      <div className='cardInfo text-3xl p-4'>Uploaded Mileages</div>
      {(mileages) ? mileages.map((mileage) => (
        <button key={mileage.uuid} className='cardMileage' onClick={() => console.log(`${mileage.uuid}Clicked`)}>
          <div className='flex overflow-x-auto max-w-full items-center'>
            <div className='p-4 space-x-2 space-y-2'>
              <div>{`${mileage.airline}`}</div>
              <div>{`${mileage.frequent_flyer_number}`}</div>
              <div>{`$${mileage.mileage_price}`}</div>
              <div>{`${mileage.mileage_amount} ${mileage.mileage_unit}`}</div>
            </div>
            <div className='p-4 space-x-2 space-y-2'>
              <div>{`Expire at ${getLocalTime(mileage.mileage_expired_at)}`}</div>
              <div>{`Created at ${getLocalTime(mileage.created_at)}`}</div>
              <div>{`Updated at ${getLocalTime(mileage.updated_at)}`}</div>
              <div>{mileage.verified ? 'Verification' : 'Verification'}</div>
              <div>{mileage.verified ? '✅' : '❌'}</div>
            </div>
            <div className='space-x-2 space-y-2 h-48 group'>
              <img
                className='group-hover:absolute min-w-48 h-48 object-contain rounded hover:scale-125 transition-transform duration-300'
                src={`data:image/png;base64,${processBytea(mileage.mileage_picture)}`}
                alt='Mileage'
              />
            </div>
          </div>
        </button>
      )) : null}
    </div>
  );
}

export default MileagesByEmail;
