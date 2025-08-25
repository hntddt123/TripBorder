import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSelectedPOI,
  setIsShowingAddtionalPopUp,
  setIsShowingOnlySelectedPOI
} from '../../redux/reducers/mapReducer';
import { FourSquareResponsePropTypes } from '../../constants/fourSquarePropTypes';

export default function NearbyPOIList({ poi, handleFlyTo, getPOIPhotosQueryTrigger }) {
  const {
    viewState,
    isShowingAddtionalPopUp,
    isNavigating
  } = useSelector((state) => state.mapReducer);
  const dispatch = useDispatch();
  const isPOIExist = (poi && poi.results.length) > 0;

  const handlePOIListItemClick = (marker) => () => {
    getPOIPhotosQueryTrigger({ fsqId: marker.fsq_id });

    dispatch(setIsShowingAddtionalPopUp(true));
    dispatch(setIsShowingOnlySelectedPOI(true));
    dispatch(setSelectedPOI(marker.fsq_id));

    handleFlyTo(
      marker.geocodes.main.longitude,
      marker.geocodes.main.latitude,
      viewState.zoom,
      1420
    );
  };

  const handleMouseEnter = (marker) => () => {
    if (!isShowingAddtionalPopUp
      && !isNavigating) {
      dispatch(setSelectedPOI(marker.fsq_id));
    }
  };

  const handleMouseLeave = () => {
    if (!isShowingAddtionalPopUp
      && !isNavigating) {
      dispatch(setSelectedPOI(null));
    }
  };

  return (
    <div>
      {(isPOIExist)
        ? poi.results.map((marker, i) => (
          <button
            translate='no'
            key={marker.fsq_id}
            className='flex cardPOI'
            onClick={handlePOIListItemClick(marker)}
            onMouseEnter={handleMouseEnter(marker)}
            onMouseLeave={handleMouseLeave}
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
