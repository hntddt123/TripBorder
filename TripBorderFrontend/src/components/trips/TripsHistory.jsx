import Trips from './Trips';

function TripsHistory() {
  return (
    <div className='cardTrip'>
      <div className='grid grid-cols-1 container mx-auto max-w-6xl'>
        <div className='cardInfo p-4'>
          <div className='text-3xl'>Trip History</div>
          <Trips />
        </div>
      </div>
    </div>
  );
}

export default TripsHistory;
