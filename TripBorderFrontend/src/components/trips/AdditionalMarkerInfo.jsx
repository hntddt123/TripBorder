/* eslint-disable react/prop-types */
import { Popup } from 'react-map-gl';
import { useDispatch, useSelector } from 'react-redux';
import { FourSquareResponsePropTypes } from '../../constants/fourSquarePropTypes';
import CustomButton from '../CustomButton';
import { setIsShowingAddtionalPopUp, setIsShowingOnlySelectedPOI, setIsNavigating, setIsShowingSideBar } from '../../redux/reducers/mapReducer';

export default function ProximityMarkersInfo({ data, getPOIPhotosQueryResult, getDirectionsQueryTrigger }) {
  const selectedPOI = useSelector((state) => state.mapReducer.selectedPOI);
  const selectedPOILonLat = useSelector((state) => state.mapReducer.selectedPOILonLat);
  const gpsLonLat = useSelector((state) => state.mapReducer.gpsLonLat);
  const longPressedLonLat = useSelector((state) => state.mapReducer.longPressedLonLat);
  const isShowingAddtionalPopUp = useSelector((state) => state.mapReducer.isShowingAddtionalPopUp);
  const isThrowingDice = useSelector((state) => state.mapReducer.isThrowingDice);
  const dispatch = useDispatch();

  const setRouteQuery = (lonStart, latStart, lonEnd, latEnd) => ({ lonStart, latStart, lonEnd, latEnd });

  const handleCloseButton = () => {
    if (isThrowingDice) {
      dispatch(setIsShowingOnlySelectedPOI(true));
    }
    dispatch(setIsShowingAddtionalPopUp(false));
  };

  const handleDirectionButton = () => {
    if (gpsLonLat.longitude !== null
      && gpsLonLat.latitude !== null) {
      try {
        getDirectionsQueryTrigger(setRouteQuery(
          gpsLonLat.longitude,
          gpsLonLat.latitude,
          selectedPOILonLat.longitude,
          selectedPOILonLat.latitude
        ));
      } catch (err) {
        console.error(err);
      }
    }
    dispatch(setIsShowingAddtionalPopUp(false));
    dispatch(setIsShowingOnlySelectedPOI(true));
    dispatch(setIsShowingSideBar(true));
    dispatch(setIsNavigating(true));
  };

  const handlePinDirectionButton = () => {
    if (longPressedLonLat.longitude !== null
      && longPressedLonLat.latitude !== null) {
      try {
        getDirectionsQueryTrigger(setRouteQuery(
          longPressedLonLat.longitude,
          longPressedLonLat.latitude,
          selectedPOILonLat.longitude,
          selectedPOILonLat.latitude
        ));
      } catch (err) {
        console.error(err);
      }
    }
    dispatch(setIsShowingAddtionalPopUp(false));
    dispatch(setIsShowingOnlySelectedPOI(true));
    dispatch(setIsShowingSideBar(true));
    dispatch(setIsNavigating(true));
  };

  const formatPhotos = () => ((getPOIPhotosQueryResult.data && getPOIPhotosQueryResult.data.length > 0)
    ? getPOIPhotosQueryResult.data.map((photo) => (
      <button key={photo.id} tabIndex={0} className='pictureContainer'>
        <img
          className='picture'
          src={`${photo.prefix}400x400${photo.suffix}`}
          alt={`${photo.prefix}400x400${photo.suffix}`}
        />
      </button>
    )) : null);

  const getPhotos = () => {
    if (getPOIPhotosQueryResult.isFetching) {
      return 'Loading';
    }
    if (getPOIPhotosQueryResult.isError) {
      return 'Photo Not Found';
    }
    if (getPOIPhotosQueryResult.isSuccess) {
      return formatPhotos();
    }
    return null;
  };

  if (data && data.results.length > 0 && isShowingAddtionalPopUp) {
    const filteredResult = data.results.filter((marker) => marker.fsq_id === selectedPOI)[0];
    if (filteredResult) {
      return (
        <div className='flex'>
          <Popup
            key={filteredResult.geocodes.main.longitude + filteredResult.geocodes.main.latitude}
            longitude={filteredResult.geocodes.main.longitude}
            latitude={filteredResult.geocodes.main.latitude}
            anchor='bottom'
            closeOnClick={false}
            closeButton={false}
            style={{ display: 'none' }}
          />
          <div
            className='mapboxgl-popup-content text-xl cardPOIAddInfo'
            style={{
              borderRadius: 20,
              backgroundColor: 'rgba(0,0,0,0.7)',
              overflow: 'auto',
              width: 'calc(100vw - env(safe-area-inset-left) - env(safe-area-inset-right)'
            }}
          >
            <CustomButton className='cancelButton' label='X' onClick={handleCloseButton} />
            <CustomButton className='poiButton justify-center ml-4' label='Walk from here' onClick={handleDirectionButton} />
            <CustomButton className='poiButton justify-center ml-4' label='Walk from 📍' onClick={handlePinDirectionButton} />
            <div className='text-2xl'>
              {`${filteredResult.name} (${filteredResult.location.address}) ${filteredResult.distance} m`}
            </div>
            <div className='cardPOIAddInfoPictures'>
              {getPhotos()}
            </div>
          </div>
        </div>
      );
    }
  }
  return null;
}

ProximityMarkersInfo.propTypes = {
  data: FourSquareResponsePropTypes,
};
