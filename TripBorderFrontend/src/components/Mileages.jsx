import { useState, useEffect } from 'react';
import { BACKEND_DOMAIN } from '../constants/constants';

const fetchMileages = async () => {
  const response = await fetch(`https://${BACKEND_DOMAIN}/api/mileages`, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

function Mileages() {
  const [mileages, setMilages] = useState([]);
  const [mileageError, setMileageError] = useState(null);

  useEffect(() => {
    fetchMileages()
      .then((data) => setMilages(data))
      .catch((err) => setMileageError(err.message));
  }, []);

  const getLocalTime = (date) => new Date(date).toLocaleString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZoneName: 'shortOffset',
    hour12: false
  });

  const renderMileAgeCard = () => (
    mileages.map((mileage) => (
      <div className='' key={mileage.id}>
        <button className='m-2 cardMileage'>
          <div className='flex overflow-x-auto max-w-full items-center'>
            <div className='flex-shrink-0'>
              <img className='w-128 h-128 object-cover rounded' src={`${mileage.mileage_picture}`} alt='Mileage' />
            </div>
            <div className='flex-1 space-y-2'>
              {/* <div>{`${mileage.id}`}</div> */}
              <div>{`${mileage.airline}`}</div>
              <div>{`${mileage.frequent_flyer_number}`}</div>
              <div>{`Price: ${mileage.mileage_price}`}</div>
              <div>{`Mileage: ${mileage.mileage_amount} ${mileage.mileage_unit}`}</div>
            </div>
            <div className='flex-1 space-y-2'>
              <div>{`Expire at ${getLocalTime(mileage.mileage_expired_at)}`}</div>
              <div>{`Created at ${getLocalTime(mileage.created_at)}`}</div>
              <div>{`Updated at ${getLocalTime(mileage.updated_at)}`}</div>
            </div>
          </div>
        </button>
      </div>
    ))
  );

  if (mileageError) {
    return <div className='customdiv text-2xl'>Error: Milage {mileageError}</div>;
  }
  return (
    <div className='customdiv cardTrip text-left'>
      <div className='grid grid-cols-1 container mx-auto max-w-4xl'>
        <div className='m-2'>
          <div className='text-xl overflow-x-auto table-fixed whitespace-nowrap'>
            <div>Mileages Exchange</div>
            {renderMileAgeCard()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Mileages;
