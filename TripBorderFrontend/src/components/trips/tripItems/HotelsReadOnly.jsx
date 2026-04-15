import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  useGetHotelsByTripIDQuery,
} from '../../../api/hotelsAPI';
import {
  formatDatecccMMMdyyyy,
  setLocalTime
} from '../../../utility/time';
import { setTripMarker } from '../../../redux/reducers/mapReducer';
import { hotelIcon } from '../../../constants/constants';
import CustomToggle from '../../CustomToggle';
import CustomError from '../../CustomError';
import CustomButton from '../../CustomButton';
import CustomFetching from '../../CustomFetching';
import CustomLoading from '../../CustomLoading';

export default function HotelsReadOnly({ tripID, handleFlyTo }) {
  const { data, isLoading, isFetching, error } = useGetHotelsByTripIDQuery({ tripID });
  const { hotels } = data || {};

  const dispatch = useDispatch();

  // Group hotels by formatted date
  const dateGroupedHotels = hotels?.reduce((result, hotel) => {
    const checkInDate = setLocalTime(hotel.check_in);
    const checkOutDate = setLocalTime(hotel.check_out);
    const newResult = { ...result };

    let currentDate = checkInDate;
    while (currentDate < checkOutDate) {
      const formattedDate = formatDatecccMMMdyyyy(currentDate);
      newResult[formattedDate] = (newResult[formattedDate] || []).concat([hotel]);
      currentDate = currentDate.plus({ days: 1 });
    }

    return newResult;
  }, {}) ?? {};

  const flyToLocation = (hotel) => () => {
    if (hotel.location && handleFlyTo) {
      const newMarker = [{
        id: new Date().getTime(),
        icon: hotelIcon,
        text: hotel.name,
        lng: hotel.location.x,
        lat: hotel.location.y
      }];
      dispatch(setTripMarker(newMarker));
      handleFlyTo(hotel.location.x, hotel.location.y, 17);
    }
  };

  const renderDetail = (hotel) => (
    <div className='text-pretty'>
      {(hotel.booking_reference)
        ? (
          <>
            <div className='underline underline-offset-2'>Booking reference</div>
            <div>{hotel.booking_reference}
            </div>
          </>
        )
        : null}
      <div className='underline underline-offset-2'>Check in</div>
      <div className='px-2 font-mono'>{formatDatecccMMMdyyyy(hotel.check_in)}</div>
      <div className='underline underline-offset-2'>Check out</div>
      <div className='px-2 font-mono'>{formatDatecccMMMdyyyy(hotel.check_out)}</div>
      <div className='underline underline-offset-2'>Address</div>
      <div className='px-2 font-mono'>{hotel.address}</div>
    </div>
  );

  return (
    <div>
      <div className='text-lg text-center'>
        {(hotels?.length > 0) ? <span>Hotels</span> : null}
      </div>
      {(dateGroupedHotels)
        ? Object.entries(dateGroupedHotels)
          .map(([date, hotelsForDate]) => (
            <div key={date}>
              <div>
                {date}
              </div>
              {hotelsForDate?.map((hotel) => (
                <div key={`${hotel.uuid}${date}`}>
                  <div className='text-pretty px-2'>
                    <CustomButton
                      className='buttonLocate'
                      label={hotelIcon}
                      onClick={flyToLocation(hotel)}
                    />
                    <CustomToggle
                      translate='no'
                      className='toggle toggleTrip'
                      aria-label={`Hotel Button ${hotel.uuid}`}
                      id={hotel.uuid}
                      titleOn={`${hotel.name} ▼`}
                      titleOff={`${hotel.name}`}
                      component={renderDetail(hotel)}
                    />
                  </div>
                </div>
              ))}
            </div>
          ))
        : hotels?.map(((hotel) => (
          <div key={`${hotel.uuid}`}>
            {`${formatDatecccMMMdyyyy(hotel.check_in)} - ${formatDatecccMMMdyyyy(hotel.check_out)}`}
            <div className='text-pretty px-2'>
              <CustomToggle
                translate='no'
                className='toggle toggleTrip'
                aria-label={`Hotel Button ${hotel.uuid}`}
                id={hotel.uuid}
                titleOn={`${hotel.name} ▼`}
                titleOff={`${hotel.name}`}
                component={renderDetail(hotel)}
              />
            </div>
          </div>
        )))}
      <div>
        <CustomLoading isLoading={isLoading} text='Loading Hotels' />
      </div>
      <div>
        <CustomFetching isFetching={isFetching} text='Fetching new page' />
      </div>
      <div>
        <CustomError error={error} />
      </div>
    </div>
  );
}

HotelsReadOnly.propTypes = {
  tripID: PropTypes.string,
  handleFlyTo: PropTypes.func
};
