import { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useGetTransportByTripIDQuery, useDeleteTransportMutation } from '../../api/transportsAPI';
import { formatDateMMMMddyyyyZZZZ } from '../../utility/time';
import CustomToggle from '../CustomToggle';
import CustomError from '../CustomError';
import CustomButton from '../CustomButton';

function Transports({ tripID }) {
  const [isEditing, setIsEditing] = useState(false);

  const isLoadTrip = useSelector((state) => state.userSettingsReducer.isLoadTrip);
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
      {(transport.departure_time)
        ? <div className='px-2 font-mono'>{formatDateMMMMddyyyyZZZZ(transport.departure_time)}</div>
        : 'Time not selected'}
      <div className='underline underline-offset-2'>Arrival Time</div>
      {(transport.arrival_time)
        ? <div className='px-2 font-mono'>{formatDateMMMMddyyyyZZZZ(transport.arrival_time)}</div>
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
          {transports?.length > 0 ? <span>Transports</span> : null}
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
      {transports?.map(((transport) => (
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
