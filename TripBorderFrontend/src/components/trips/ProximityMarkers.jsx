import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Marker } from 'react-map-gl';
import { useSelector, useDispatch } from 'react-redux';
import {
  setSelectedPOI,
  setIsShowingAddtionalPopUp,
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
    isThrowingDice,
    viewState,
    randomPOINumber
  } = useSelector((state) => state.mapReducer);

  useEffect(() => {
    if (data?.results?.length > 0) {
      dispatch(setRandomPOINumber(Math.floor(Math.random() * data.results.length)));
    }
  }, [data, dispatch]);

  const handlePOIMarkerClick = (marker) => () => {
    getPOIPhotosQueryTrigger({ fsqId: marker.fsq_id });
    dispatch(setSelectedPOI(marker.fsq_id));
    dispatch(setSelectedPOILonLat({
      longitude: marker.geocodes.main.longitude,
      latitude: marker.geocodes.main.latitude
    }));
    handleFlyTo(marker.geocodes.main.longitude, marker.geocodes.main.latitude, viewState.zoom, 420);
    dispatch(setIsShowingAddtionalPopUp(true));
  };

  const getPOILabel = (poi, index) => {
    const { name } = poi;
    const dist = poi.distance;
    let label = `${index + 1}`;

    if (isFullPOIname) {
      label = `${label} ${name}`;
    }
    if (isShowingDistance) {
      label = `${label} ${dist}m`;
    }

    return label;
  };

  const renderSingleMarker = (poi, index) => {
    const label = getPOILabel(poi, index);
    const offsetY = 30;

    return (
      <div key={poi.fsq_id}>
        <Marker
          longitude={poi.geocodes.main.longitude}
          latitude={poi.geocodes.main.latitude}
          offset={[0, -offsetY]}
        >
          <div className='text-xl' translate='no'>{selectedPOIIcon}</div>
        </Marker>

        <Marker
          onClick={handlePOIMarkerClick(poi)}
          longitude={poi.geocodes.main.longitude}
          latitude={poi.geocodes.main.latitude}
        >
          <CustomButton
            translate='no'
            className='cardPOIMarker'
            label={label}
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
      markersToRender = [renderSingleMarker(poi, randomPOINumber, true)];
    }
  } else if (isShowingOnlySelectedPOI) {
    const index = data.results.findIndex((marker) => marker.fsq_id === selectedPOI);
    if (index !== -1) {
      const poi = data.results[index];
      markersToRender = [renderSingleMarker(poi, index, true)];
    }
  } else {
    markersToRender = data.results.map((poi, index) => renderSingleMarker(poi, index, false));
  }

  return markersToRender;
}

ProximityMarkers.propTypes = {
  data: FourSquareResponsePropTypes,
  getPOIPhotosQueryTrigger: PropTypes.func,
  isFetching: PropTypes.bool,
  handleFlyTo: PropTypes.func
};
