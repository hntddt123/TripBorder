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
      <div>{`booking_reference: ${transport.booking_reference}`}</div>
      <div>{`Departure Time: ${getLocalTime(transport.departure_time)}`}</div>
      <div>{`Arrival Time: ${getLocalTime(transport.arrival_time)}`}</div>
      <div>{`origin: ${transport.origin}`}</div>
      <div>{`destination: ${transport.destination}`}</div>
      <div>{`Type: ${transport.type}`}</div>
      <div>{`Provider: ${transport.provider}`}</div>
      <div>{`Address: ${transport.address}`}</div>
    </div>
  );

  return (
    <div>
      <div className='text-xl text-center'>
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
