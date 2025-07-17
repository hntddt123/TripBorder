import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  pinIcon
} from '../../constants/constants';
import {
  setViewState,
  setIsShowingOnlySelectedPOI,
  setSelectedPOI,
  setIsShowingAddtionalPopUp
} from '../../redux/reducers/mapReducer';
import CustomButton from '../CustomButton';

function ButtonPinSearch({ getNearbyPOIQueryTrigger }) {
  const longPressedLonLat = useSelector((state) => state.mapReducer.longPressedLonLat);
  const isThrowingDice = useSelector((state) => state.mapReducer.isThrowingDice);
  const selectedPOIIDNumber = useSelector((state) => state.mapReducer.selectedPOIIDNumber);
  const selectedPOICount = useSelector((state) => state.mapReducer.selectedPOICount);
  const selectedPOIRadius = useSelector((state) => state.mapReducer.selectedPOIRadius);
  const selectedPOIIcon = useSelector((state) => state.mapReducer.selectedPOIIcon);
  const dispatch = useDispatch();

  const hasLongPressedLonLat = () => (
    longPressedLonLat.longitude !== null
    && longPressedLonLat.latitude !== null
  );

  const handleLongPressedMarkerButton = () => {
    if (hasLongPressedLonLat()) {
      getNearbyPOIQueryTrigger({
        ll: `${longPressedLonLat.latitude},${longPressedLonLat.longitude}`,
        radius: selectedPOIRadius,
        limit: selectedPOICount,
        category: selectedPOIIDNumber,
        icon: selectedPOIIcon
      }, true);
      dispatch(setViewState({
        longitude: longPressedLonLat.longitude,
        latitude: longPressedLonLat.latitude,
        pitch: 30,
        zoom: 15
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
      className='poiAddButton'
      label={pinIcon}
      onClick={handleLongPressedMarkerButton}
      disabled={!hasLongPressedLonLat()}
    />
  );
}


ButtonPinSearch.propTypes = {
  getNearbyPOIQueryTrigger: PropTypes.func
};

export default ButtonPinSearch;
