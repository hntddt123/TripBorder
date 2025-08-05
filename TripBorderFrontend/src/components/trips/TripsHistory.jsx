import TripsPast from './TripsPast';

export default function TripsHistory() {
  return (
    <div className='cardMX1'>
      <div className='grid grid-cols-1 container mx-auto max-w-6xl'>
        <div className='cardInfo p-4'>
          <div className='text-3xl'>Trip History</div>
          <TripsPast />
        </div>
      </div>
    </div>
  );
}
