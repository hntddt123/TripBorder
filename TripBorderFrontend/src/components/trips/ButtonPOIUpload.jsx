import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import CustomButton from '../CustomButton';
import { usePostPOIByTripIDMutation } from '../../api/poisAPI';
import CustomError from '../CustomError';

export default function ButtonPOIUpload({ filteredResult }) {
  const {
    uuid,
    startDate,
  } = useSelector((state) => state.tripReducer);
  const [PostPOIByTripID, { isLoading, error }] = usePostPOIByTripIDMutation();

  const handleClick = () => {
    if (uuid) {
      const poi = {
        trips_uuid: uuid,
        name: filteredResult.name,
        address: filteredResult.location.formatted_address,
        visit_time: startDate
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
        disabled={uuid === ''}
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
