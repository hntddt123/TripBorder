import { useState, useEffect } from 'react';
import { BACKEND_DOMAIN, PORT } from '../constants/constants';
import MileageUploadForm from './MileageUploadForm';
import { processBytea } from '../utility/processBytea';

const fetchMileages = async () => {
  const response = await fetch(`https://${BACKEND_DOMAIN}:${PORT}/api/mileages`, {
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

  const renderMileAgeCards = () => (
    mileages.map((mileage) => (
      <div key={mileage.uuid}>
        <button className='cardMileage'>
          <div className='flex overflow-x-auto max-w-full items-center'>
            <div className='p-4 space-x-2 space-y-2'>
              {/* <div>{`${mileage.uuid}`}</div> */}
              <div>{`${mileage.airline}`}</div>
              <div>{`${mileage.frequent_flyer_number}`}</div>
              <div>{`$${mileage.mileage_price}`}</div>
              <div>{`${mileage.mileage_amount} ${mileage.mileage_unit}`}</div>
            </div>
            <div className='p-4 space-x-2 space-y-2'>
              <div>{`Expire at ${getLocalTime(mileage.mileage_expired_at)}`}</div>
              <div>{`Created at ${getLocalTime(mileage.created_at)}`}</div>
              <div>{`Updated at ${getLocalTime(mileage.updated_at)}`}</div>
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
      </div>
    ))
  );

  if (mileageError) {
    return <div className='text-2xl'>Error: Milage {mileageError}</div>;
  }
  return (
    <div className='cardTrip text-left'>
      <div className='grid grid-cols-1 container mx-auto max-w-6xl'>
        <div className='m-2 text-xl overflow-x-auto table-fixed whitespace-nowrap'>
          <MileageUploadForm />
          <div className='text-center'>Mileages Exchange</div>
          {renderMileAgeCards()}
        </div>
      </div>
    </div>
  );
}

export default Mileages;
