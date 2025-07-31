import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  setViewState,
  setIsShowingOnlySelectedPOI,
  setSelectedPOI,
  setIsShowingAddtionalPopUp
} from '../../redux/reducers/mapReducer';
import { GPSIcon } from '../../constants/constants';
import CustomButton from '../CustomButton';

function ButtonGPSSearch({ getNearbyPOIQueryTrigger }) {
  const gpsLonLat = useSelector((state) => state.mapReducer.gpsLonLat);
  const selectedPOIIDNumber = useSelector((state) => state.mapReducer.selectedPOIIDNumber);
  const selectedPOICount = useSelector((state) => state.mapReducer.selectedPOICount);
  const selectedPOIRadius = useSelector((state) => state.mapReducer.selectedPOIRadius);
  const selectedPOIIcon = useSelector((state) => state.mapReducer.selectedPOIIcon);
  const isThrowingDice = useSelector((state) => state.mapReducer.isThrowingDice);

  const dispatch = useDispatch();

  const hasGPSLonLat = () => (
    gpsLonLat.longitude !== null
    && gpsLonLat.latitude !== null
  );

  const handleButtonGPSSearch = () => {
    if (hasGPSLonLat()) {
      getNearbyPOIQueryTrigger({
        ll: `${gpsLonLat.latitude},${gpsLonLat.longitude}`,
        radius: selectedPOIRadius,
        limit: selectedPOICount,
        category: selectedPOIIDNumber,
        icon: selectedPOIIcon
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
      className='buttonTopbar'
      label={GPSIcon}
      onClick={handleButtonGPSSearch}
      disabled={!hasGPSLonLat()}
    />
  );
}

ButtonGPSSearch.propTypes = {
  getNearbyPOIQueryTrigger: PropTypes.func
};

export default ButtonGPSSearch;
