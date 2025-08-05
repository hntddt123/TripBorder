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
      {(poi && poi.results.length > 0) ? poi.results.map((marker, i) => (
        <button
          translate='no'
          key={marker.fsq_id}
          className='flex cardPOI justify-between items-center'
          onClick={handlePOIListItemClick(marker)}
        >
          {(marker.location.address)
            ? <div>{`${i + 1} ${marker.name} (${marker.location.address})`}</div>
            : <div>{`${i + 1} ${marker.name}`}</div>}
          <div className='justify-end'>
            <div>{`${marker.distance} m`}</div>
          </div>
        </button>
      )) : null}
    </div>
  );
}

NearbyPOIList.propTypes = {
  poi: FourSquareResponsePropTypes,
  handleFlyTo: PropTypes.func,
};
