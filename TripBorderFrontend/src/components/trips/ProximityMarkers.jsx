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
import { FourSquareResponsePropTypes } from '../../constants/fourSquarePropTypes';
import CustomButton from '../CustomButton';

export default function ProximityMarkers({
  data, getPOIPhotosQueryTrigger, isFetching, handleFlyTo
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
    if (data?.results?.length > 0) {
      dispatch(setRandomPOINumber(Math.floor(Math.random() * data.results.length)));
    }
  }, [data, dispatch]);

  const handlePOIMarkerClick = (marker) => () => {
    clearTimeout(pressTimer.current);

    getPOIPhotosQueryTrigger({ fsqId: marker.fsq_id });
    handleFlyTo(
      marker.geocodes.main.longitude,
      marker.geocodes.main.latitude,
      viewState.zoom,
      1420
    );

    dispatch(setSelectedPOI(marker.fsq_id));
    dispatch(setSelectedPOILonLat({
      longitude: marker.geocodes.main.longitude,
      latitude: marker.geocodes.main.latitude
    }));
    dispatch(setIsShowingOnlySelectedPOI(true));
    dispatch(setIsShowingAdditionalPopUp(true));
  };

  const handleMouseEnter = (poi) => () => {
    if (!isShowingAdditionalPopUp
      && !isNavigating) {
      dispatch(setSelectedPOI(poi.fsq_id));
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
      dispatch(setSelectedPOI(poi.fsq_id));
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
    const isHovered = (selectedPOI === poi.fsq_id);

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
      <div key={poi.fsq_id}>
        <Marker
          longitude={poi.geocodes.main.longitude}
          latitude={poi.geocodes.main.latitude}
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
            className={(selectedPOI === poi.fsq_id)
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

  if (isFetching || !data?.results?.length) return null;

  let markersToRender = [];

  if (isThrowingDice) {
    const poi = data.results[randomPOINumber];
    if (poi) {
      markersToRender = [renderSingleMarker(poi, randomPOINumber)];
    }
  } else if (isShowingOnlySelectedPOI) {
    const index = data.results.findIndex((marker) => marker.fsq_id === selectedPOI);
    if (index !== -1) {
      const poi = data.results[index];
      markersToRender = [renderSingleMarker(poi, index)];
    }
  } else {
    markersToRender = data.results.map((poi, index) => renderSingleMarker(poi, index));
  }
  return markersToRender;
}

ProximityMarkers.propTypes = {
  data: FourSquareResponsePropTypes,
  getPOIPhotosQueryTrigger: PropTypes.func,
  isFetching: PropTypes.bool,
  handleFlyTo: PropTypes.func
};
