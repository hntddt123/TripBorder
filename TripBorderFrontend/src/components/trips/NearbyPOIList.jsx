import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  setSelectedPOI,
  setIsShowingAdditionalPopUp,
  setIsShowingOnlySelectedPOI,
  setSelectedPOILonLat
} from '../../redux/reducers/mapReducer';
import { FourSquareResponsePropTypes } from '../../constants/fourSquarePropTypes';

export default function NearbyPOIList({ poi, handleFlyTo, getPOIPhotosQueryTrigger }) {
  const {
    viewState,
    isShowingAdditionalPopUp,
    isNavigating
  } = useSelector((state) => state.mapReducer);
  const dispatch = useDispatch();
  const isPOIExist = (poi && poi.results.length) > 0;
  const pressTimer = useRef(null);

  const handlePOIListItemClick = (marker) => () => {
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

  const handleMouseEnter = (marker) => () => {
    if (!isShowingAdditionalPopUp
      && !isNavigating) {
      dispatch(setSelectedPOI(marker.fsq_id));
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
      dispatch(setSelectedPOI(marker.fsq_id));
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

  return (
    <div>
      {(isPOIExist)
        ? poi.results.map((marker, i) => (
          // event sequence touchstart → touchend → mousedown → mouseup → click
          <button
            translate='no'
            key={marker.fsq_id}
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
            {(marker.location.address)
              ? (
                <div className='min-w-9/12 overflow-scroll text-left cursor-pointer'>
                  {`${marker.name} (${marker.location.address})`}
                </div>
              )
              : (
                <div className='min-w-9/12 overflow-scroll text-left'>
                  {`${marker.name}`}
                </div>
              )}
            <div className='min-w-2/12 text-right'>
              {`${marker.distance}m`}
            </div>
          </button>
        ))
        : null}
    </div>
  );
}

NearbyPOIList.propTypes = {
  poi: FourSquareResponsePropTypes,
  getPOIPhotosQueryTrigger: PropTypes.func,
  handleFlyTo: PropTypes.func,
};
