import PropTypes from 'prop-types';
import { useGetHotelsByTripIDQuery } from '../../api/hotelsAPI';
import { getLocalTime } from '../../utility/time';
import CustomToggle from '../CustomToggle';
import CustomError from '../CustomError';

function Hotels({ tripID }) {
  const { data, isLoading, isFetching, error } = useGetHotelsByTripIDQuery({ tripID });
  const { hotels } = data || {};

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <CustomError error={error} />;
  }

  const renderDetail = (hotel) => (
    <div>
      <div>{`Booking reference: ${hotel.booking_reference}`}</div>
      <div>{`Check in: ${getLocalTime(hotel.check_in)}`}</div>
      <div>{`Check out: ${getLocalTime(hotel.check_out)}`}</div>
      <div>{`Address: ${hotel.address}`}</div>
    </div>
  );

  const renderHotelsItem = (hotel) => (
    <div className='flex justify-center'>
      <CustomToggle
        className='container overflow-x-auto -tracking-wider text-center'
        aria-label={`Hotel Button ${hotel.uuid}`}
        id={hotel.uuid}
        title={hotel.name}
        component={renderDetail(hotel)}
      />
    </div>
  );

  return (
    <div className='overflow-x-auto table-fixed whitespace-nowrap'>
      {isFetching && <div>Fetching new page...</div>}
      {hotels?.map(((hotel) => (
        <div key={hotel.uuid}>
          <div>
            {renderHotelsItem(hotel)}
          </div>
        </div>
      )))}
    </div>
  );
}

Hotels.propTypes = {
  tripID: PropTypes.string,
};

export default Hotels;
