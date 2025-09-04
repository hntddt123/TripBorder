import { useSelector } from 'react-redux';
import { usePostHotelsByTripIDMutation } from '../../api/hotelsAPI';
import CustomButton from '../CustomButton';
import CustomError from '../CustomError';
import CustomLoading from '../CustomLoading';
import { getOSMAddress } from '../../utility/osmFormat';
import { OSMPropTypes } from '../../constants/osmPropTypes';

export default function ButtonHotelsUpload({ filteredResult }) {
  const {
    uuid,
    startDate,
    endDate
  } = useSelector((state) => state.tripReducer);

  const [PostHotelsByTripID, { isLoading, error }] = usePostHotelsByTripIDMutation();

  const handleClick = () => {
    if (uuid) {
      const hotels = {
        trips_uuid: uuid,
        name: filteredResult.name,
        address: getOSMAddress(filteredResult.address),
        check_in: startDate,
        check_out: endDate,
        // booking_reference: booking_reference
        location: {
          longitude: filteredResult.lon,
          latitude: filteredResult.lat
        }
      };
      PostHotelsByTripID(hotels);
    }
  };

  return (
    <>
      <CustomButton
        className='buttonPOIAdd'
        label='+Hotels'
        onClick={handleClick}
        disabled={uuid === '' || (startDate === endDate)}
      />
      <CustomLoading isLoading={isLoading} text='Creating...' />
      <CustomError error={error} />
    </>
  );
}

ButtonHotelsUpload.propTypes = {
  filteredResult: OSMPropTypes
};
