/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from 'react-redux';
import {
  setSelectedPOI,
  setViewState,
  setIsShowingAddtionalPopUp,
  setIsShowingOnlySelectedPOI
} from '../../redux/reducers/mapReducer';

function NearbyPOIList({ poi }) {
  const viewState = useSelector((state) => state.mapReducer.viewState);
  const dispatch = useDispatch();

  const handlePOIListItemClick = (marker) => () => {
    dispatch(setIsShowingAddtionalPopUp(false));
    dispatch(setIsShowingOnlySelectedPOI(true));
    dispatch(setSelectedPOI(marker.fsq_id));
    dispatch(setViewState({ latitude: marker.geocodes.main.latitude, longitude: marker.geocodes.main.longitude, zoom: viewState.zoom }));
  };

  return (
    <div>
      {(poi && poi.results.length > 0) ? poi.results.map((marker, i) => (
        <button translate='no' className='flex cardPOI justify-between items-center' key={marker.fsq_id} onClick={handlePOIListItemClick(marker)}>
          <div>{`${i + 1} ${marker.name} (${marker.location.address})`}</div>
          <div className='justify-end'>
            <div>{`${marker.distance} m`}</div>
          </div>
        </button>
      )) : null}
    </div>
  );
}

export default NearbyPOIList;
