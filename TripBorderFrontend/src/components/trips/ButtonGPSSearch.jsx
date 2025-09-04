import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  setIsShowingOnlySelectedPOI,
  setSelectedPOI,
  setIsShowingAdditionalPopUp,
  setIsUsingGPSLonLat
} from '../../redux/reducers/mapReducer';
import { GPSIcon } from '../../constants/constants';
import CustomButton from '../CustomButton';

export default function ButtonGPSSearch({ handleGPSSearch, isFetching }) {
  const {
    gpsLonLat,
    isThrowingDice,
  } = useSelector((state) => state.mapReducer);

  const dispatch = useDispatch();

  const hasGPSLonLat = () => (
    gpsLonLat.longitude !== null
    && gpsLonLat.latitude !== null
  );

  const handleButtonGPSSearch = () => {
    if (hasGPSLonLat()) {
      dispatch(setIsUsingGPSLonLat(true));
      handleGPSSearch(gpsLonLat.longitude, gpsLonLat.latitude);

      if (isThrowingDice) {
        dispatch(setIsShowingOnlySelectedPOI(true));
      } else {
        dispatch(setIsShowingOnlySelectedPOI(false));
        dispatch(setSelectedPOI(''));
      }
      dispatch(setIsShowingAdditionalPopUp(false));
    }
  };

  return (
    <CustomButton
      translate='no'
      className='buttonGPS'
      label={GPSIcon}
      onClick={handleButtonGPSSearch}
      disabled={!hasGPSLonLat() || isFetching}
    />
  );
}

ButtonGPSSearch.propTypes = {
  handleGPSSearch: PropTypes.func,
  isFetching: PropTypes.bool
};
