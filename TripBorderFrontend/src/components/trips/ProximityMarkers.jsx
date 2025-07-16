import { Marker } from 'react-map-gl';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setSelectedPOI,
  setViewState,
  setIsShowingAddtionalPopUp,
  setIsShowingOnlySelectedPOI,
  setSelectedPOILonLat,
  setRandomPOINumber
} from '../../redux/reducers/mapReducer';
import { FourSquareResponsePropTypes } from '../../constants/fourSquarePropTypes';
import CustomButton from '../CustomButton';

export default function ProximityMarkers({ data, getPOIPhotosQueryTrigger }) {
  const selectedPOIIcon = useSelector((state) => state.mapReducer.selectedPOIIcon);
  const selectedPOI = useSelector((state) => state.mapReducer.selectedPOI);
  const isFullPOIname = useSelector((state) => state.mapReducer.isFullPOIname);
  const isShowingOnlySelectedPOI = useSelector((state) => state.mapReducer.isShowingOnlySelectedPOI);
  const isThrowingDice = useSelector((state) => state.mapReducer.isThrowingDice);
  const viewState = useSelector((state) => state.mapReducer.viewState);
  const randomPOINumber = useSelector((state) => state.mapReducer.randomPOINumber);
  const dispatch = useDispatch();
  const setPOIPhotosQuery = (fsqId) => ({ fsqId });

  useEffect(() => {
    if (data && data.results.length > 0) {
      dispatch(setRandomPOINumber(Math.floor(Math.random() * data.results.length)));
    }
  }, [data]);

  const handlePOIMarkerClick = (marker) => {
    getPOIPhotosQueryTrigger(setPOIPhotosQuery(marker.fsq_id));
    dispatch(setSelectedPOI(marker.fsq_id));
    dispatch(setSelectedPOILonLat({
      longitude: marker.geocodes.main.longitude,
      latitude: marker.geocodes.main.latitude
    }));

    dispatch(setViewState({
      latitude: marker.geocodes.main.latitude,
      longitude: marker.geocodes.main.longitude,
      zoom: viewState.zoom,
    }));
    dispatch(setIsShowingAddtionalPopUp(true));
    dispatch(setIsShowingOnlySelectedPOI(true));
  };

  const renderPOIMarkers = () => data.results.map((marker, i) => (
    <div key={marker.fsq_id}>
      <Marker longitude={marker.geocodes.main.longitude} latitude={marker.geocodes.main.latitude}>
        <div className='text-2xl' translate='no'>{selectedPOIIcon}</div>
      </Marker>
      <Marker
        onClick={() => handlePOIMarkerClick(marker)}
        longitude={marker.geocodes.main.longitude}
        latitude={marker.geocodes.main.latitude}
        offset={[0, 30]}
      >
        <CustomButton
          translate='no'
          className='cardPOIMarker'
          label={`${i + 1} ${isFullPOIname ? `${marker.name} ${marker.distance}m` : ''}`}
        />
      </Marker>
    </div>
  ));

  const renderRandomSelectedPOIMarker = () => {
    let filteredResult;

    if (isThrowingDice) {
      filteredResult = data.results[randomPOINumber];
    } else {
      [filteredResult] = data.results.filter((marker) => marker.fsq_id === selectedPOI);
    }
    if (filteredResult) {
      const filterText = (isFullPOIname)
        ? `${randomPOINumber + 1} ${filteredResult.name} ${filteredResult.distance}m`
        : `${randomPOINumber + 1} ${filteredResult.distance}m`;
      return (
        <div key={filteredResult.fsq_id}>
          <Marker longitude={filteredResult.geocodes.main.longitude} latitude={filteredResult.geocodes.main.latitude}>
            <div className='text-2xl' translate='no'>{selectedPOIIcon}</div>
          </Marker>
          <Marker
            onClick={() => handlePOIMarkerClick(filteredResult)}
            longitude={filteredResult.geocodes.main.longitude}
            latitude={filteredResult.geocodes.main.latitude}
            offset={[0, 30]}
          >
            <CustomButton className='cardPOIMarker' label={filterText} />
          </Marker>
        </div>
      );
    }
    return null;
  };

  const renderSelectedPOIMarker = () => {
    const filteredResult = data.results.filter((marker) => marker.fsq_id === selectedPOI)[0];
    const index = data.results.findIndex((marker) => marker.fsq_id === filteredResult.fsq_id) + 1;

    if (filteredResult) {
      const filterText = (isFullPOIname)
        ? `${index} ${filteredResult.name} ${filteredResult.distance}m`
        : `${index} ${filteredResult.distance}m`;

      return (
        <div key={filteredResult.fsq_id}>
          <Marker longitude={filteredResult.geocodes.main.longitude} latitude={filteredResult.geocodes.main.latitude}>
            <div className='text-3xl' translate='no'>{selectedPOIIcon}</div>
          </Marker>
          <Marker
            onClick={() => handlePOIMarkerClick(filteredResult)}
            longitude={filteredResult.geocodes.main.longitude}
            latitude={filteredResult.geocodes.main.latitude}
            offset={[0, 40]}
          >
            <CustomButton className='cardPOIMarker' label={filterText} />
          </Marker>
        </div>
      );
    }
    return null;
  };

  if ((data && data.results.length > 0 && !isShowingOnlySelectedPOI && !isThrowingDice)) {
    return renderPOIMarkers();
  }
  if (data && data.results.length > 0 && isThrowingDice) {
    return renderRandomSelectedPOIMarker();
  }
  if (data && data.results.length > 0 && isShowingOnlySelectedPOI && !isThrowingDice) {
    return renderSelectedPOIMarker();
  }
}

ProximityMarkers.propTypes = {
  data: FourSquareResponsePropTypes,
};
