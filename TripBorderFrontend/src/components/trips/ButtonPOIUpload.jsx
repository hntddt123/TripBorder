import { useDispatch, useSelector } from 'react-redux';
import { usePostPOIByTripIDMutation } from '../../api/poisAPI';
import {
  setIsShowingAdditionalPopUp
} from '../../redux/reducers/mapReducer';
import { OSMPropTypes } from '../../constants/osmPropTypes';
import { getAltName, getOSMAddress } from '../../utility/osmFormat';
import CustomButton from '../CustomButton';
import CustomError from '../CustomError';
import CustomLoading from '../CustomLoading';

export default function ButtonPOIUpload({ filteredResult }) {
  const {
    uuid,
    startDate
  } = useSelector((state) => state.tripReducer);
  const [PostPOIByTripID, { isLoading, error }] = usePostPOIByTripIDMutation();

  const dispatch = useDispatch();

  const handleClick = () => {
    if (uuid) {
      const poi = {
        trips_uuid: uuid,
        name: `${filteredResult.name} ${getAltName(filteredResult)}`,
        address: getOSMAddress(filteredResult),
        visit_time: startDate,
        location: {
          longitude: filteredResult.lon,
          latitude: filteredResult.lat
        }
      };
      PostPOIByTripID(poi);
      dispatch(setIsShowingAdditionalPopUp(false));
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
