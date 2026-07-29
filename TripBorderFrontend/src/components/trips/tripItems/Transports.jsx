import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  useGetTransportByTripIDQuery,
  useUpdateTransportByUUIDMutation,
  useDeleteTransportMutation
} from '../../../api/transportsAPI';
import {
  formatDatecccMMMdyyyy,
  formatDatecccMMMMddyyyyHHmm,
  formatDateHHmm,
  formatLocalDateTimeString,
  isTimeValid,
  setLocalTime
} from '../../../utility/time';
import { transportIcon } from '../../../constants/constants';
import { setTripMarker } from '../../../redux/reducers/mapReducer';
import CustomToggle from '../../CustomToggle';
import CustomError from '../../CustomError';
import CustomButton from '../../CustomButton';
import CustomLoading from '../../CustomLoading';
import CustomFetching from '../../CustomFetching';

export default function Transports({ tripID, handleFlyTo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [departureTimes, setDepartureTimes] = useState({});
  const [arrivalTimes, setArrivalTimes] = useState({});
  const [inputErrors, setInputErrors] = useState({});

  const trip = useSelector((state) => state.tripReducer);
  const isLoadTrip = useSelector((state) => state.tripReducer.isLoadTrip);

  const { data, isLoading, isFetching, error } = useGetTransportByTripIDQuery({ tripID });
  const { transports } = data || {};

  const [updateTransport] = useUpdateTransportByUUIDMutation();
  const [deleteTransport] = useDeleteTransportMutation();

  const dispatch = useDispatch();
  const datePickerRefs = useRef({});

  // Group transports by formatted date
  const dateGroupedTransports = (() => {
    const result = {};
    transports?.forEach((transport) => {
      const date = formatDatecccMMMdyyyy(transport.departure_time);
      result[date] = (result[date] || []).concat([transport]);
    });
    return result;
  })();

  const openPicker = (id) => () => {
    const input = datePickerRefs.current[id];
    if (input.showPicker) {
      input.showPicker();
    } else {
      input.click();
    }
  };

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

  const handleSubmit = (transportID, departureTime, arrivalTime) => {
    const newDepartureTime = formatLocalDateTimeString(departureTime);
    const newArrivalTime = formatLocalDateTimeString(arrivalTime);

    if (newDepartureTime && newArrivalTime) {
      updateTransport({
        uuid: transportID,
        updates: {
          departure_time: setLocalTime(newDepartureTime),
          arrival_time: setLocalTime(newArrivalTime)
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

    if (!departureTimeError) {
      handleSubmit(transportID, value, currentArrival);
    }
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
    if (!arrivalTimeError) {
      handleSubmit(transportID, currentDeparture, value);
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
      <div className={`flex items-center justify-center text-lg ${isLoadTrip ? '' : 'ml-10'}`}>
        {(transports?.length > 0) && !isEditing ? <div>Transports</div> : null}
        {(isEditing) ? <div>Edit Transports</div> : null}
        {transports?.length > 0 && !isLoadTrip
          ? (
            <CustomButton
              translate='no'
              className='buttonEdit select-none'
              label='✏️'
              onClick={handleEditButton}
            />
          ) : null}
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
                      <>
                        <input
                          ref={(el) => {
                            if (el) {
                              datePickerRefs.current[`departure_time_${transport.uuid}`] = el;
                            } else {
                              // clean-up ref when item removed
                              delete datePickerRefs.current[`departure_time_${transport.uuid}`];
                            }
                          }}
                          className='sr-only'
                          id={`departure_time_${transport.uuid}`}
                          type='datetime-local'
                          name='departure_time'
                          value={getDepartureTimeValue(transport)}
                          onChange={handleDepartureTimeChange(transport.uuid)}
                          required
                        />
                        <input
                          ref={(el) => {
                            if (el) {
                              datePickerRefs.current[`arrival_time_${transport.uuid}`] = el;
                            } else {
                              // clean-up ref when item removed
                              delete datePickerRefs.current[`arrival_time_${transport.uuid}`];
                            }
                          }}
                          className='sr-only'
                          id={`arrival_time_${transport.uuid}`}
                          type='datetime-local'
                          name='arrival_time'
                          value={getArrivalTimeValue(transport)}
                          onChange={handleArrivalTimeChange(transport.uuid)}
                          required
                        />
                        <CustomButton
                          className='buttonLocate text-sm'
                          label={formatDateHHmm(transport.departure_time)}
                          onClick={openPicker(`departure_time_${transport.uuid}`)}
                        />
                        <CustomButton
                          className='buttonLocate text-sm'
                          label={formatDateHHmm(transport.arrival_time)}
                          onClick={openPicker(`arrival_time_${transport.uuid}`)}
                        />
                        <CustomButton
                          className='buttonLocate'
                          label={transportIcon}
                          onClick={flyToLocation(transport)}
                        />
                      </>
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
                  <div className='text-red-600'>{inputErrors[transport.uuid]?.departure || ''}</div>
                  <div className='text-red-600'>{inputErrors[transport.uuid]?.arrival || ''}</div>
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
