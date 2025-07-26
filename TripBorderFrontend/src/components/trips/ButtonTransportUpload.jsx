import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import CustomButton from '../CustomButton';
import { usePostTransportByTripIDMutation } from '../../api/transportsAPI';
import CustomError from '../CustomError';

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
function ButtonPOIUpload({ filteredResult }) {
  const tripData = useSelector((state) => state.tripReducer);
  const [PostTransportByTripID, { isLoading, error }] = usePostTransportByTripIDMutation();

  const handleClick = () => {
    if (tripData.uuid) {
      const transport = {
        trips_uuid: tripData.uuid,
        name: filteredResult.name,
        address: filteredResult.location.formatted_address,
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
        disabled={tripData.uuid === ''}
      />
      {(isLoading) ? <div>Creating...</div> : null}
      {(error) ? <CustomError error={error} /> : null}
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

export default ButtonPOIUpload;
