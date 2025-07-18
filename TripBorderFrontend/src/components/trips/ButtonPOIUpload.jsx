import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import CustomButton from '../CustomButton';
import { usePostPOIByTripIDMutation } from '../../api/poisAPI';
import CustomError from '../CustomError';

function ButtonPOIUpload({ filteredResult }) {
  const tripData = useSelector((state) => state.tripReducer);
  const [PostPOIByTripID, { isLoading, error }] = usePostPOIByTripIDMutation();

  const handleClick = () => {
    if (tripData.uuid) {
      const poi = {
        trips_uuid: tripData.uuid,
        name: filteredResult.name,
        address: filteredResult.location.formatted_address,
      };
      PostPOIByTripID(poi);
    }
  };

  return (
    <>
      <CustomButton
        className='buttonPOIAdd'
        label='+Tour Spot'
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
