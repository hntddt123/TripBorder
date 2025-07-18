import { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useGetTransportByTripIDQuery, useDeleteTransportMutation } from '../../api/transportsAPI';
import { getLocalTime } from '../../utility/time';
import CustomToggle from '../CustomToggle';
import CustomError from '../CustomError';
import CustomButton from '../CustomButton';

function Transports({ tripID }) {
  const [isEditing, setIsEditing] = useState(false);

  const tripData = useSelector((state) => state.tripReducer);
  const { data, isLoading, isFetching, error } = useGetTransportByTripIDQuery({ tripID });
  const { transports } = data || {};
  const [deleteTransport] = useDeleteTransportMutation();

  const handleEditButton = () => {
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
      <div className='px-2 font-mono'>{getLocalTime(transport.departure_time)}</div>
      <div className='underline underline-offset-2'>Arrival Time</div>
      <div className='px-2 font-mono'>{getLocalTime(transport.arrival_time)}</div>
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
          {transports?.length > 0 ? <span>Transports</span> : null}
          {transports?.length > 0 && !tripData.isLoadTrip
            ? (
              <CustomButton
                translate='no'
                className='editButton'
                label='✏️'
                onClick={handleEditButton}
              />
            ) : null}
        </div>
      </div>
      {transports?.map(((transport) => (
        <div key={transport.uuid}>
          <div className='text-pretty px-2'>
            <CustomToggle
              className='toggle container overflow-x-auto -tracking-wider text-left px-2 mb-1'
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
                  className='tripButton'
                  translate='no'
                  label={`🗑️ ${transport.name}`}
                  onClick={() => deleteTransport(transport.uuid)}
                />
              )
              : null}
          </div>
        </div>
      )))}
      {(isLoading) ? <div>Loading Transports...</div> : null}
      {isFetching && <div>Fetching new page...</div>}
      {(error) ? <CustomError error={error} /> : null}
    </div>
  );
}

Transports.propTypes = {
  tripID: PropTypes.string,
};

export default Transports;
