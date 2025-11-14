import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  useGetTransportByTripIDQuery,
  useUpdateTransportByUUIDMutation,
  useDeleteTransportMutation
} from '../../api/transportsAPI';
import {
  formatDatecccMMMdyyyy,
  formatDatecccMMMMddyyyyHHmm,
  formatLocalDateTimeString,
  isTimeValid,
  setLocalTime
} from '../../utility/time';
import { transportIcon } from '../../constants/constants';
import { setMarker } from '../../redux/reducers/mapReducer';
import CustomToggle from '../CustomToggle';
import CustomError from '../CustomError';
import CustomButton from '../CustomButton';
import CustomLoading from '../CustomLoading';
import CustomFetching from '../CustomFetching';

export default function Transports({ tripID, handleFlyTo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [departureTimes, setDepartureTimes] = useState({});
  const [arrivalTimes, setArrivalTimes] = useState({});
  const [inputErrors, setInputErrors] = useState({});

  const trip = useSelector((state) => state.tripReducer);
  const isLoadTrip = useSelector((state) => state.userSettingsReducer.isLoadTrip);

  const { data, isLoading, isFetching, error } = useGetTransportByTripIDQuery({ tripID });
  const { transports } = data || {};

  const [updateTransport] = useUpdateTransportByUUIDMutation();
  const [deleteTransport] = useDeleteTransportMutation();

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
      const newMarker = {
        id: new Date().getTime(),
        icon: transportIcon,
        lng: transport.location.x,
        lat: transport.location.y
      };
      dispatch(setMarker(newMarker));
      handleFlyTo(transport.location.x, transport.location.y, 16);
    }
  };

  const getDepartureTimeValue = (transport) => {
    if (departureTimes[transport.uuid] === undefined) {
      setDepartureTimes((prevTimes) => ({
        ...prevTimes,
        [transport.uuid]: formatLocalDateTimeString(transport.departure_time),
      }));
    }
    return departureTimes[transport.uuid];
  };

  const getArrivalTimeValue = (transport) => {
    if (arrivalTimes[transport.uuid] === undefined) {
      setArrivalTimes((prevTimes) => ({
        ...prevTimes,
        [transport.uuid]: formatLocalDateTimeString(transport.arrival_time),
      }));
    }
    return arrivalTimes[transport.uuid];
  };

  const handleSubmit = (transport) => (e) => {
    e.preventDefault();

    const transportID = transport.uuid;
    const departureTime = departureTimes[transportID]
      || formatLocalDateTimeString(transport.departure_time);
    const arrivalTime = arrivalTimes[transportID]
      || formatLocalDateTimeString(transport.arrival_time);

    if (departureTime && arrivalTime) {
      updateTransport({
        uuid: transportID,
        updates: {
          departure_time: setLocalTime(departureTime),
          arrival_time: setLocalTime(arrivalTime)
        }
      });
    }
  };

  const validateDepartureTime = (value, arrivalTime) => isTimeValid(value, arrivalTime, trip, 'Departure_time');
  const validateArrivalTime = (value, departureTime) => isTimeValid(value, departureTime, trip, 'Arrival_time');

  const handleDepartureTimeChange = (transportID) => (e) => {
    const { value } = e.target;

    const currentArrival = arrivalTimes[transportID];
    const departureTimeError = validateDepartureTime(value, currentArrival);

    setDepartureTimes((prevTimes) => ({
      ...prevTimes,
      [transportID]: value,
    }));

    setInputErrors((prevErrors) => {
      const newErrors = { ...prevErrors };

      if (!newErrors[transportID]) {
        newErrors[transportID] = {};
      }
      newErrors[transportID].departure = departureTimeError;
      return newErrors;
    });
  };

  const handleArrivalTimeChange = (transportID) => (e) => {
    const { value } = e.target;

    const currentDeparture = departureTimes[transportID];
    const arrivalTimeError = validateArrivalTime(value, currentDeparture);

    setArrivalTimes((prevTimes) => ({
      ...prevTimes,
      [transportID]: value,
    }));

    setInputErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (!newErrors[transportID]) newErrors[transportID] = {};
      newErrors[transportID].arrival = arrivalTimeError;
      return newErrors;
    });

    if (currentDeparture) {
      const departureError = validateDepartureTime(currentDeparture, value);
      setInputErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        newErrors[transportID].departure = departureError;
        return newErrors;
      });
    }
  };

  const handleEditButton = () => {
    if (isEditing) {
      setDepartureTimes({});
      setArrivalTimes({});
      setInputErrors({});
    }
    setIsEditing(!isEditing);
  };

  const renderDetail = (transport) => (
    <div className='text-pretty'>
      <form onSubmit={handleSubmit(transport)} encType='multipart/form-data'>
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
        {(isEditing) ? (
          <div>
            <input
              className='customInput'
              id={`departure_time_${transport.uuid}`}
              type='datetime-local'
              name='departure_time'
              value={getDepartureTimeValue(transport)}
              onChange={handleDepartureTimeChange(transport.uuid)}
              required
            />
            <div className='text-red-600'>{inputErrors[transport.uuid]?.departure || ''}</div>
          </div>
        )
          : null}
        <div className='underline underline-offset-2'>Arrival Time</div>
        {(transport.arrival_time)
          ? <div className='px-2 font-mono'>{formatDatecccMMMMddyyyyHHmm(transport.arrival_time)}</div>
          : 'Time not selected'}
        {(isEditing) ? (
          <div>
            <input
              className='customInput'
              id={`arrival_time${transport.uuid}`}
              type='datetime-local'
              name='arrival_time'
              value={getArrivalTimeValue(transport)}
              onChange={handleArrivalTimeChange(transport.uuid)}
              required
            />
            <div className='text-red-600'>{inputErrors[transport.uuid]?.arrival || ''}</div>
            <CustomButton
              type='submit'
              label='Update Time'
              disabled={!!inputErrors[transport.uuid]?.arrival
                || !!inputErrors[transport.uuid]?.departure
                || departureTimes[transport.uuid] === ''
                || arrivalTimes[transport.uuid] === ''
                || (departureTimes[transport.uuid] === formatLocalDateTimeString(transport.departure_time)
                  && arrivalTimes[transport.uuid] === formatLocalDateTimeString(transport.arrival_time))}
            />
          </div>
        )
          : null}
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
      </form>
    </div>
  );

  return (
    <div>
      <div className='text-lg text-center'>
        <div>
          {(transports?.length > 0) && !isEditing ? <span>Transports</span> : null}
          {(isEditing) ? <span>Edit Transports</span> : null}
          {transports?.length > 0 && !isLoadTrip
            ? (
              <CustomButton
                translate='no'
                className='buttonEdit'
                label='✏️'
                onClick={handleEditButton}
              />
            ) : null}
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
                  {(isEditing)
                    ? (
                      <CustomButton
                        className='buttonDelete'
                        translate='no'
                        label='🗑️'
                        onClick={() => deleteTransport(transport.uuid)}
                      />
                    )
                    : (
                      <CustomButton
                        className='buttonLocate'
                        label={transportIcon}
                        onClick={flyToLocation(transport)}
                      />
                    )}
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

Transports.propTypes = {
  tripID: PropTypes.string,
  handleFlyTo: PropTypes.func
};
