import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { usePostHotelsByTripIDMutation } from '../../api/hotelsAPI';
import CustomButton from '../CustomButton';
import CustomError from '../CustomError';

function ButtonHotelsUpload({ filteredResult }) {
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
        address: filteredResult.location.formatted_address,
        check_in: startDate,
        check_out: endDate,
        // booking_reference: booking_reference
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
