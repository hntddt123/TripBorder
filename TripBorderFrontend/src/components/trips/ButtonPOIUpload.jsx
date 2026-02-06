import { useSelector } from 'react-redux';
import { usePostPOIByTripIDMutation } from '../../api/poisAPI';
import { OSMPropTypes } from '../../constants/osmPropTypes';
import { getOSMAddress } from '../../utility/osmFormat';
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
        address: getOSMAddress(filteredResult),
        visit_time: startDate,
        location: {
          longitude: filteredResult.lon,
          latitude: filteredResult.lat
        }
      };
      PostPOIByTripID(poi);
    }
  };

  return (
    <>
      <CustomButton
        className='buttonPOIAdd'
        label='🏞️ Tour'
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
