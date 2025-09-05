import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  setSelectedPOI,
  setIsShowingAdditionalPopUp,
  setIsShowingOnlySelectedPOI,
  setSelectedPOILonLat
} from '../../redux/reducers/mapReducer';
import { OSMPropTypes } from '../../constants/osmPropTypes';
import { calculateDistance } from '../../utility/geoCalculation';

export default function NearbyPOIList({ data, handleFlyTo, activeQueryType }) {
  const {
    viewState,
    isShowingAdditionalPopUp,
    isNavigating,
    longPressedLonLat
  } = useSelector((state) => state.mapReducer);
  const dispatch = useDispatch();
  const isPOIExist = (data && data.length) > 0;
  const pressTimer = useRef(null);

  const handlePOIListItemClick = (marker) => () => {
    clearTimeout(pressTimer.current);

    handleFlyTo(
      marker.lon,
      marker.lat,
      viewState.zoom,
      1420
    );

    dispatch(setSelectedPOI(marker.place_id));
    dispatch(setSelectedPOILonLat({
      longitude: marker.lon,
      latitude: marker.lat
    }));
    dispatch(setIsShowingOnlySelectedPOI(true));
    dispatch(setIsShowingAdditionalPopUp(true));
  };

  const handleMouseEnter = (marker) => () => {
    if (!isShowingAdditionalPopUp
      && !isNavigating) {
      dispatch(setSelectedPOI(marker.place_id));
    }
  };

  const handleMouseLeave = () => {
    if (!isShowingAdditionalPopUp
      && !isNavigating) {
      dispatch(setSelectedPOI(null));
    }
  };

  const handleTouchDown = (marker) => () => {
    if (!isShowingAdditionalPopUp
      && !isNavigating) {
      dispatch(setSelectedPOI(marker.place_id));
    }
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
  };

  const handleTouchUp = () => {
    if (!isShowingAdditionalPopUp
      && !isNavigating) {
      pressTimer.current = setTimeout(() => {
        dispatch(setSelectedPOI(null));
      }, 420);
    }
  };

  const renderDistance = (marker) => `${calculateDistance(
    marker.lat,
    marker.lon,
    longPressedLonLat.latitude,
    longPressedLonLat.longitude,
    'm'
  )} m`;

  const renderPOINameAddress = (marker) => {
    if (marker.address.house_number && marker.address.road) {
      return `${marker.name} (${marker.address?.house_number} ${marker.address.road})`;
    }
    if (marker.address.road) {
      return `${marker.name} (${marker.address.road})`;
    }
    if (marker.name) {
      return `${marker.name}`;
    }
    return 'No Data';
  };

  if (isPOIExist) {
    return (
      <div>
        {data.map((marker, i) => (
          // event sequence touchstart → touchend → mousedown → mouseup → click
          <button
            translate='no'
            key={marker.place_id}
            className='flex cardPOI'
            onClick={handlePOIListItemClick(marker)}
            onMouseEnter={handleMouseEnter(marker)}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchDown(marker)}
            onTouchEnd={handleTouchUp}
          >
            <div className='min-w-1/12 text-center'>
              {`${i + 1}`}
            </div>
            <div className='min-w-9/12 text-left cursor-pointer'>
              {renderPOINameAddress(marker)}
            </div>
            <div className='min-w-2/12 text-right'>
              {(activeQueryType === 'pin') ? renderDistance(marker) : null}
            </div>
          </button>
        ))}
      </div>
    );
  }
  return null;
}

NearbyPOIList.propTypes = {
  data: PropTypes.arrayOf(OSMPropTypes),
  handleFlyTo: PropTypes.func,
  activeQueryType: PropTypes.string
};
