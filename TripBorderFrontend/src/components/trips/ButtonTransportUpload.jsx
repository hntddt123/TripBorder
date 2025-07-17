import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import CustomButton from '../CustomButton';
import { usePostTransportByTripIDMutation } from '../../api/transportsAPI';
import CustomError from '../CustomError';

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
        className='poiAddButton'
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
