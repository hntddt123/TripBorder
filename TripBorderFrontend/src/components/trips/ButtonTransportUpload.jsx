import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { usePostTransportByTripIDMutation } from '../../api/transportsAPI';
import CustomButton from '../CustomButton';
import CustomError from '../CustomError';
import CustomLoading from '../CustomLoading';

/**
 Transport data structure
 uuid: knexDBInstance.fn.uuid(),
 trips_uuid: transport.trips_uuid,
 name: transport.name,
 type: transport.type || 'Unselected',
 address: transport.address,
 provider: transport.provider,
 booking_reference: transport.booking_reference,
 departure_time: transport.departure_time,
 arrival_time: transport.arrival_time,
 origin: transport.origin,
 destination: transport.destination
*/
export default function ButtonPOIUpload({ filteredResult }) {
  const {
    uuid,
    startDate,
  } = useSelector((state) => state.tripReducer);
  const [PostTransportByTripID, { isLoading, error }] = usePostTransportByTripIDMutation();

  const handleClick = () => {
    if (uuid) {
      const transport = {
        trips_uuid: uuid,
        name: filteredResult.name,
        address: filteredResult.location.formatted_address,
        departure_time: startDate,
        arrival_time: startDate
      };
      PostTransportByTripID(transport);
    }
  };

  return (
    <>
      <CustomButton
        className='buttonPOIAdd'
        label='+Transport'
        onClick={handleClick}
        disabled={uuid === ''}
      />
      <CustomLoading isLoading={isLoading} text='Creating...' />
      <CustomError error={error} />
    </>
  );
}

ButtonPOIUpload.propTypes = {
  filteredResult: PropTypes.shape({
    name: PropTypes.string,
    location: PropTypes.shape({
      formatted_address: PropTypes.string
    })
  })
};
