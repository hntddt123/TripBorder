import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import CustomButton from '../CustomButton';
import { usePostHotelsByTripIDMutation } from '../../api/hotelsAPI';
import CustomError from '../CustomError';
import { checkInTime, checkOutTime } from '../../utility/time';

function ButtonHotelsUpload({ filteredResult }) {
  const tripData = useSelector((state) => state.tripReducer);
  const [PostHotelsByTripID, { isLoading, error }] = usePostHotelsByTripIDMutation();

  const handleClick = () => {
    if (tripData.uuid) {
      const hotels = {
        trips_uuid: tripData.uuid,
        name: filteredResult.name,
        address: filteredResult.location.formatted_address,
        check_in: checkInTime,
        check_out: checkOutTime,
        // booking_reference: hotels.booking_reference
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
        disabled={tripData.uuid === ''}
      />
      {(isLoading) ? <div>Creating...</div> : null}
      {(error) ? <CustomError error={error} /> : null}
    </>
  );
}

ButtonHotelsUpload.propTypes = {
  filteredResult: PropTypes.shape({
    name: PropTypes.string,
    location: PropTypes.shape({
      formatted_address: PropTypes.string
    })
  })
};

export default ButtonHotelsUpload;
