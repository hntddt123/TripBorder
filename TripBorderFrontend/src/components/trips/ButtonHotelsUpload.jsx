import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import CustomButton from '../CustomButton';
import { usePostHotelsByTripIDMutation } from '../../api/hotelsAPI';
import CustomError from '../CustomError';

function ButtonHotelsUpload({ filteredResult }) {
  const tripData = useSelector((state) => state.tripReducer);
  const [PostHotelsByTripID, { isLoading, error }] = usePostHotelsByTripIDMutation();

  const handleClick = () => {
    if (tripData.uuid) {
      const hotels = {
        trips_uuid: tripData.uuid,
        name: filteredResult.name,
        address: filteredResult.location.formatted_address,
        // check_in: hotels.check_in,
        // check_out: hotels.check_out,
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
