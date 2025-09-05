import { useSelector } from 'react-redux';
import { usePostTransportByTripIDMutation } from '../../api/transportsAPI';
import { OSMPropTypes } from '../../constants/osmPropTypes';
import { getOSMAddress } from '../../utility/osmFormat';
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
        address: getOSMAddress(filteredResult),
        departure_time: startDate,
        arrival_time: startDate,
        location: {
          longitude: filteredResult.lon,
          latitude: filteredResult.lat
        }
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
  filteredResult: OSMPropTypes
};
