import PropTypes from 'prop-types';
import { useGetTransportByTripIDQuery } from '../../api/transportsAPI';
import { getLocalTime } from '../../utility/time';
import CustomToggle from '../CustomToggle';

function Transports({ tripID }) {
  const { data, isLoading, isFetching, error } = useGetTransportByTripIDQuery({ tripID });
  const { transports } = data || {};

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{`Status: ${error.status} - ${error.error}`}</div>;
  }

  const renderDetail = (transport) => (
    <div>
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

  const renderTransportsItem = (transport) => (
    <div className='flex justify-center'>
      <CustomToggle
        className='container overflow-x-auto -tracking-wider text-center'
        aria-label={`Transport Button ${transport.uuid}`}
        id={transport.uuid}
        title={transport.name}
        component={renderDetail(transport)}
      />
    </div>
  );

  return (
    <div className='overflow-x-auto table-fixed whitespace-nowrap'>
      {isFetching && <div>Fetching new page...</div>}
      {transports?.map(((transport) => (
        <div key={transport.uuid}>
          <div>
            {renderTransportsItem(transport)}
          </div>
        </div>
      )))}
    </div>
  );
}

Transports.propTypes = {
  tripID: PropTypes.string,
};

export default Transports;
