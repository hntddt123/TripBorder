import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Marker } from 'react-map-gl';
import { useSelector, useDispatch } from 'react-redux';
import {
  setSelectedPOI,
  setIsShowingAdditionalPopUp,
  setIsShowingOnlySelectedPOI,
  setSelectedPOILonLat,
  setRandomPOINumber
} from '../../redux/reducers/mapReducer';
import CustomButton from '../CustomButton';
import { OSMPropTypes } from '../../constants/osmPropTypes';

export default function ProximityMarkers({
  data, isFetching, handleFlyTo
}) {
  const dispatch = useDispatch();
  const {
    selectedPOIIcon,
    selectedPOI,
    isFullPOIname,
    isShowingDistance,
    isShowingOnlySelectedPOI,
    isShowingAdditionalPopUp,
    isNavigating,
    isThrowingDice,
    viewState,
    randomPOINumber
  } = useSelector((state) => state.mapReducer);
  const pressTimer = useRef(null);

  useEffect(() => {
    if (data?.length > 0) {
      dispatch(setRandomPOINumber(Math.floor(Math.random() * data.length)));
    }
  }, [data, dispatch]);

  const handlePOIMarkerClick = (marker) => () => {
    clearTimeout(pressTimer.current);

    handleFlyTo(
      marker.lon,
      marker.lat,
      viewState.zoom,
      1420
    );

    dispatch(setSelectedPOI(marker.place_id));
    dispatch(setSelectedPOILonLat({
      longitude: parseFloat(marker.lon),
      latitude: parseFloat(marker.lat)
    }));
    dispatch(setIsShowingOnlySelectedPOI(true));
    dispatch(setIsShowingAdditionalPopUp(true));
  };

  const handleMouseEnter = (poi) => () => {
    if (!isShowingAdditionalPopUp
      && !isNavigating) {
      dispatch(setSelectedPOI(poi.place_id));
    }
  };

  const handleMouseLeave = () => {
    if (!isShowingAdditionalPopUp
      && !isNavigating) {
      dispatch(setSelectedPOI(null));
    }
  };

  const handleTouchDown = (poi) => () => {
    if (!isShowingAdditionalPopUp
      && !isNavigating) {
      dispatch(setSelectedPOI(poi.place_id));
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

  const getPOILabel = (poi, index) => {
    const { name } = poi;
    const dist = poi.distance;
    const isHovered = (selectedPOI === poi.place_id);

    let label = `${index + 1}`;

    if (isFullPOIname || isHovered) {
      label = `${label} ${name}`;
    }
    if (isShowingDistance) {
      label = `${label} ${dist}m`;
    }

    return label;
  };

  const renderSingleMarker = (poi, index) => {
    const label = getPOILabel(poi, index);

    return (
      <div key={poi.place_id}>
        <Marker
          longitude={poi.lon}
          latitude={poi.lat}
        >
          <div
            className='text-2xl text-center'
            translate='no'
          >
            {selectedPOIIcon}
          </div>
          <CustomButton
            onClick={handlePOIMarkerClick(poi)}
            translate='no'
            className={(selectedPOI === poi.place_id)
              ? 'cardPOIMarkerTriggerHover'
              : 'cardPOIMarker'}
            label={label}
            onMouseEnter={handleMouseEnter(poi)}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchDown(poi)}
            onTouchEnd={handleTouchUp}
          />
        </Marker>
      </div>
    );
  };

  if (isFetching || !data?.length) return null;

  let markersToRender = [];

  if (isThrowingDice) {
    const poi = data[randomPOINumber];
    if (poi) {
      markersToRender = [renderSingleMarker(poi, randomPOINumber)];
    }
  } else if (isShowingOnlySelectedPOI) {
    const index = data.findIndex((marker) => marker.place_id === selectedPOI);
    if (index !== -1) {
      const poi = data[index];
      markersToRender = [renderSingleMarker(poi, index)];
    }
  } else {
    markersToRender = data.map((poi, index) => renderSingleMarker(poi, index));
  }
  return markersToRender;
}

ProximityMarkers.propTypes = {
  data: PropTypes.arrayOf(OSMPropTypes),
  isFetching: PropTypes.bool,
  handleFlyTo: PropTypes.func
};
