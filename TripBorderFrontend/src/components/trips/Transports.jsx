import { useState } from 'react';
import { useSelector } from 'react-redux';
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
import CustomToggle from '../CustomToggle';
import CustomError from '../CustomError';
import CustomButton from '../CustomButton';

export default function Transports({ tripID }) {
  const [isEditing, setIsEditing] = useState(false);
  const [departureTimes, setDepartureTimes] = useState({});
  const [arrivalTimes, setArrivalTimes] = useState({});
  const [inputErrors, setInputErrors] = useState({});

  const tripData = useSelector((state) => state.tripReducer);
  const isLoadTrip = useSelector((state) => state.userSettingsReducer.isLoadTrip);
  const { data, isLoading, isFetching, error } = useGetTransportByTripIDQuery({ tripID });
  const { transports } = data || {};

  const [updateTransport] = useUpdateTransportByUUIDMutation();
  const [deleteTransport] = useDeleteTransportMutation();

  // Group transports by formatted date
  const dateGroupedTransports = (() => {
    const result = {};
    transports?.forEach((transport) => {
      const date = formatDatecccMMMdyyyy(transport.departure_time);
      result[date] = (result[date] || []).concat([transport]);
    });
    return result;
  })();

  const handleSubmit = (transportID) => (e) => {
    e.preventDefault();
    updateTransport({
      uuid: transportID,
      updates: {
        departure_time: setLocalTime(departureTimes[transportID]),
        arrival_time: setLocalTime(arrivalTimes[transportID])
      }
    });
  };

  const validateDepartureTime = (value, arrivalTime) => isTimeValid(value, arrivalTime, tripData, 'Departure_time');
  const validateArrivalTime = (value, departureTime) => isTimeValid(value, departureTime, tripData, 'Arrival_time');

  const handleDepartureTimeChange = (transportID) => (e) => {
    const { value } = e.target;

    const departureTimeError = validateDepartureTime(value, arrivalTimes[transportID]);

    setInputErrors((prevErrors) => ({
      ...prevErrors,
      [transportID]: departureTimeError,
    }));

    if (!departureTimeError) {
      setDepartureTimes((prevTimes) => ({
        ...prevTimes,
        [transportID]: value,
      }));
    }
  };

  const handleArrivalTimeChange = (transportID) => (e) => {
    const { value } = e.target;

    const arrivalTimeError = validateArrivalTime(value, departureTimes[transportID]);

    setInputErrors((prevErrors) => ({
      ...prevErrors,
      [transportID]: arrivalTimeError,
    }));

    if (!arrivalTimeError) {
      setArrivalTimes((prevTimes) => ({
        ...prevTimes,
        [transportID]: value,
      }));
    }
  };

  const handleEditButton = () => {
    setIsEditing(!isEditing);
  };

  const renderDetail = (transport) => (
    <div className='text-pretty'>
      <form onSubmit={handleSubmit(transport.uuid)} encType='multipart/form-data'>
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
              value={departureTimes[transport.uuid] || formatLocalDateTimeString(transport.departure_time)}
              onChange={handleDepartureTimeChange(transport.uuid)}
              required
            />
            <div className='text-red-600'>{inputErrors[transport.uuid] || ''}</div>
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
              value={arrivalTimes[transport.uuid] || formatLocalDateTimeString(transport.arrival_time)}
              onChange={handleArrivalTimeChange(transport.uuid)}
              required
            />
            <div className='text-red-600'>{inputErrors[transport.uuid] || ''}</div>
            <CustomButton type='submit' label='Update' />
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
                  <CustomToggle
                    translate='no'
                    className='toggle min-h-12 min-w-72 max-w-72 overflow-x-auto text-center px-4 mb-1'
                    aria-label={`Transport Button ${transport.uuid}`}
                    id={transport.uuid}
                    title={transport.name}
                    component={renderDetail(transport)}
                  />
                </div>
                <div>
                  {(isEditing)
                    ? (
                      <CustomButton
                        className='buttonDelete'
                        translate='no'
                        label={`🗑️ ${transport.name}`}
                        onClick={() => deleteTransport(transport.uuid)}
                      />
                    )
                    : null}
                </div>
              </div>
            ))}
          </div>
        )) : null}
      {(isLoading) ? <div>Loading Transports...</div> : null}
      {isFetching && <div>Fetching new page...</div>}
      {(error) ? <CustomError error={error} /> : null}
    </div>
  );
}

Transports.propTypes = {
  tripID: PropTypes.string,
};
