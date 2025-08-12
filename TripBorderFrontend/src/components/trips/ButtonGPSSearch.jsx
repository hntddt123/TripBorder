import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  setViewState,
  setIsShowingOnlySelectedPOI,
  setSelectedPOI,
  setIsShowingAddtionalPopUp,
  setIsUsingGPSLonLat
} from '../../redux/reducers/mapReducer';
import { GPSIcon } from '../../constants/constants';
import CustomButton from '../CustomButton';

export default function ButtonGPSSearch({ getNearbyPOIQueryTrigger }) {
  const {
    gpsLonLat,
    selectedPOIIDNumber,
    selectedPOICount,
    selectedPOIRadius,
    selectedPOIIcon,
    isThrowingDice,
    sessionIDFSQ
  } = useSelector((state) => state.mapReducer);

  const dispatch = useDispatch();

  const hasGPSLonLat = () => (
    gpsLonLat.longitude !== null
    && gpsLonLat.latitude !== null
  );

  const handleButtonGPSSearch = () => {
    if (hasGPSLonLat()) {
      dispatch(setIsUsingGPSLonLat(true));
      getNearbyPOIQueryTrigger({
        ll: `${gpsLonLat.latitude},${gpsLonLat.longitude}`,
        radius: selectedPOIRadius,
        limit: selectedPOICount,
        category: selectedPOIIDNumber,
        icon: selectedPOIIcon,
        sessionToken: sessionIDFSQ
      }, true);
      dispatch(setViewState({
        longitude: gpsLonLat.longitude,
        latitude: gpsLonLat.latitude,
        pitch: 30,
        zoom: 15.5
      }));

      if (isThrowingDice) {
        dispatch(setIsShowingOnlySelectedPOI(true));
      } else {
        dispatch(setIsShowingOnlySelectedPOI(false));
        dispatch(setSelectedPOI(''));
      }
      dispatch(setIsShowingAddtionalPopUp(false));
    }
  };

  return (
    <CustomButton
      translate='no'
      className='buttonGPS'
      label={GPSIcon}
      onClick={handleButtonGPSSearch}
      disabled={!hasGPSLonLat()}
    />
  );
}

ButtonGPSSearch.propTypes = {
  getNearbyPOIQueryTrigger: PropTypes.func
};
