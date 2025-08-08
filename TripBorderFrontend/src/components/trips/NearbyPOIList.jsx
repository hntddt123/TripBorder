import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSelectedPOI,
  setIsShowingAddtionalPopUp,
  setIsShowingOnlySelectedPOI
} from '../../redux/reducers/mapReducer';
import { FourSquareResponsePropTypes } from '../../constants/fourSquarePropTypes';

export default function NearbyPOIList({ poi, handleFlyTo }) {
  const viewState = useSelector((state) => state.mapReducer.viewState);
  const dispatch = useDispatch();
  const handlePOIListItemClick = (marker) => () => {
    dispatch(setIsShowingAddtionalPopUp(false));
    dispatch(setIsShowingOnlySelectedPOI(true));
    dispatch(setSelectedPOI(marker.fsq_id));
    handleFlyTo(
      marker.geocodes.main.longitude,
      marker.geocodes.main.latitude,
      viewState.zoom,
      1500
    );
  };

  return (
    <div>
      {(poi && poi.results.length > 0)
        ? poi.results.map((marker, i) => (
          <button
            translate='no'
            key={marker.fsq_id}
            className='flex cardPOI'
            onClick={handlePOIListItemClick(marker)}
          >
            <div className='min-w-1/12 text-left'>
              {`${i + 1}`}
            </div>
            {(marker.location.address)
              ? (
                <div className='min-w-9/12 overflow-scroll text-left'>
                  {`${marker.name} (${marker.location.address})`}
                </div>
              )
              : (
                <div>
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
  handleFlyTo: PropTypes.func,
};
