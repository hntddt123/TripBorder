import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { usePostHotelsByTripIDMutation } from '../../api/hotelsAPI';
import CustomButton from '../CustomButton';
import CustomError from '../CustomError';
import CustomLoading from '../CustomLoading';

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
        address: filteredResult.location.formatted_address,
        check_in: startDate,
        check_out: endDate,
        // booking_reference: booking_reference
        location: filteredResult.geocodes.main
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
  filteredResult: PropTypes.shape({
    name: PropTypes.string,
    location: PropTypes.shape({
      formatted_address: PropTypes.string
    }),
    geocodes: PropTypes.shape({
      main: PropTypes.shape({
        longitude: PropTypes.number,
        latitude: PropTypes.number
      })
    })
  })
};
