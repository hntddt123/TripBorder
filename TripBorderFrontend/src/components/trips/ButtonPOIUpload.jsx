import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { usePostPOIByTripIDMutation } from '../../api/poisAPI';
import CustomButton from '../CustomButton';
import CustomError from '../CustomError';
import CustomLoading from '../CustomLoading';

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
      <CustomLoading isLoading={isLoading} text='Creating...' />
      <CustomError error={error} />
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
