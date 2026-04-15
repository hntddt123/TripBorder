import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  useGetTransportByTripIDQuery
} from '../../../api/transportsAPI';
import {
  formatDatecccMMMdyyyy,
  formatDatecccMMMMddyyyyHHmm
} from '../../../utility/time';
import { transportIcon } from '../../../constants/constants';
import { setTripMarker } from '../../../redux/reducers/mapReducer';
import CustomToggle from '../../CustomToggle';
import CustomError from '../../CustomError';
import CustomButton from '../../CustomButton';
import CustomLoading from '../../CustomLoading';
import CustomFetching from '../../CustomFetching';

export default function TransportsReadOnly({ tripID, handleFlyTo }) {
  const { data, isLoading, isFetching, error } = useGetTransportByTripIDQuery({ tripID });
  const { transports } = data || {};

  const dispatch = useDispatch();

  // Group transports by formatted date
  const dateGroupedTransports = (() => {
    const result = {};
    transports?.forEach((transport) => {
      const date = formatDatecccMMMdyyyy(transport.departure_time);
      result[date] = (result[date] || []).concat([transport]);
    });
    return result;
  })();

  const flyToLocation = (transport) => () => {
    if (transport.location && handleFlyTo) {
      const newMarker = [{
        id: new Date().getTime(),
        icon: transportIcon,
        text: transport.name,
        lng: transport.location.x,
        lat: transport.location.y
      }];
      dispatch(setTripMarker(newMarker));
      handleFlyTo(transport.location.x, transport.location.y, 16);
    }
  };

  const renderDetail = (transport) => (
    <div className='text-pretty'>
      {transport.booking_reference
        ? (
          <>
            <div className='underline underline-offset-2'>booking_reference</div>
            <div>{transport.booking_reference}</div>
          </>
        )
        : null}
      <div className='underline underline-offset-2'>Departure Time</div>
      {(transport.departure_time)
        ? <div className='px-2 font-mono'>{formatDatecccMMMMddyyyyHHmm(transport.departure_time)}</div>
        : 'Time not selected'}
      <div className='underline underline-offset-2'>Arrival Time</div>
      {(transport.arrival_time)
        ? <div className='px-2 font-mono'>{formatDatecccMMMMddyyyyHHmm(transport.arrival_time)}</div>
        : 'Time not selected'}
      {transport.origin
        ? (
          <>
            <div className='underline underline-offset-2'>origin</div>
            <div>{transport.origin}</div>
          </>
        )
        : null}
      {transport.destination
        ? (
          <>
            <div className='underline underline-offset-2'>destination</div>
            <div>{transport.destination}</div>
          </>
        )
        : null}
      {transport.type !== 'Unselected'
        ? (
          <>
            <div className='underline underline-offset-2'>Type</div>
            <div>{transport.type}</div>
          </>
        )
        : null}
      {transport.type !== 'Unselected'
        ? (
          <>
            <div className='underline underline-offset-2'>Provider</div>
            <div>{transport.provider}</div>
          </>
        )
        : null}
      <div className='underline underline-offset-2'>Address</div>
      <div className='px-2 font-mono'>{transport.address}</div>
    </div>
  );

  return (
    <div>
      <div className='text-lg text-center'>
        <div>
          {(transports?.length > 0) ? <span>Transports</span> : null}
        </div>
      </div>
      {(dateGroupedTransports)
        ? Object.entries(dateGroupedTransports).map(([date, TransportsForDate]) => (
          <div key={date}>
            <div>
              {date}
            </div>
            {TransportsForDate?.map((transport) => (
              <div key={transport.uuid}>
                <div className='text-pretty px-2'>
                  <CustomButton
                    className='buttonLocate'
                    label={transportIcon}
                    onClick={flyToLocation(transport)}
                  />
                  <CustomToggle
                    translate='no'
                    className='toggle toggleTrip'
                    aria-label={`Transport Button ${transport.uuid}`}
                    id={transport.uuid}
                    titleOn={`${transport.name} ▼`}
                    titleOff={`${transport.name}`}
                    component={renderDetail(transport)}
                  />
                </div>
              </div>
            ))}
          </div>
        )) : null}
      <div>
        <CustomLoading isLoading={isLoading} text='Loading Transports' />
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

TransportsReadOnly.propTypes = {
  tripID: PropTypes.string,
  handleFlyTo: PropTypes.func
};
