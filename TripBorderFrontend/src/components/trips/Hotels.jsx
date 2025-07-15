import PropTypes from 'prop-types';
import { useGetHotelsByTripIDQuery } from '../../api/hotelsAPI';
import { getLocalTime } from '../../utility/time';
import CustomToggle from '../CustomToggle';
import CustomError from '../CustomError';

function Hotels({ tripID }) {
  const { data, isLoading, isFetching, error } = useGetHotelsByTripIDQuery({ tripID });
  const { hotels } = data || {};

  const renderDetail = (hotel) => (
    <div className='text-pretty'>
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
      {hotels?.map(((hotel) => (
        <div key={hotel.uuid}>
          <div>
            {renderHotelsItem(hotel)}
          </div>
        </div>
      )))}
      {(isLoading) ? <div>Loading Hotels...</div> : null}
      {isFetching && <div>Fetching new page...</div>}
      {(error) ? <CustomError error={error} /> : null}
    </div>
  );
}

Hotels.propTypes = {
  tripID: PropTypes.string,
};

export default Hotels;
