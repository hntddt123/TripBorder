/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from 'react-redux';
import { FourSquareResponsePropTypes } from '../../constants/fourSquarePropTypes';
import CustomButton from '../CustomButton';
import {
  setIsShowingAddtionalPopUp,
  setIsShowingOnlySelectedPOI,
  setIsNavigating,
  setIsShowingSideBar,
  setSelectedPOI
} from '../../redux/reducers/mapReducer';
import ButtonMealsUpload from './ButtonMealsUpload';
import ButtonHotelsUpload from './ButtonHotelsUpload';
import ButtonPOIUpload from './ButtonPOIUpload';
import ButtonTransportUpload from './ButtonTransportUpload';
import { markerIcon } from '../../constants/constants';
import CustomFetching from '../CustomFetching';

export default function ProximityMarkersInfo({ data, getPOIPhotosQueryResult, getDirectionsQueryTrigger }) {
  const {
    selectedPOI,
    selectedPOILonLat,
    gpsLonLat,
    longPressedLonLat,
    isShowingAddtionalPopUp,
    isThrowingDice
  } = useSelector((state) => state.mapReducer);
  const dispatch = useDispatch();

  const setRouteQuery = (lonStart, latStart, lonEnd, latEnd) => ({ lonStart, latStart, lonEnd, latEnd });

  const handleCloseButton = () => {
    dispatch(setIsShowingOnlySelectedPOI(false));
    if (isThrowingDice) {
      dispatch(setIsShowingOnlySelectedPOI(true));
    }
    dispatch(setIsShowingAddtionalPopUp(false));
    dispatch(setSelectedPOI(''));
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
    ))
    : null
  );

  const getPhotos = () => {
    if (getPOIPhotosQueryResult.isFetching) {
      return <CustomFetching isFetching={getPOIPhotosQueryResult.isFetching} text='Getting Photos' />;
    }
    if (getPOIPhotosQueryResult.isError) {
      return <span>Photo Not Found</span>;
    }
    if (getPOIPhotosQueryResult.isSuccess) {
      return formatPhotos();
    }
    return null;
  };

  if (data && data.results.length > 0 && isShowingAddtionalPopUp) {
    const filteredResult = data.results.filter((marker) => marker.fsq_id === selectedPOI)[0];
    const index = data.results.findIndex((marker) => marker.fsq_id === selectedPOI) + 1;

    if (filteredResult) {
      return (
        <div className='flex'>
          <div
            className='text-base cardPOIAddInfo'
            style={{
              borderRadius: 10,
              backgroundColor: 'rgba(0,0,0,0.8)',
              overflow: 'auto',
              width: 'calc(100vw - env(safe-area-inset-left) - env(safe-area-inset-right)'
            }}
          >
            <CustomButton
              translate='no'
              className='buttonCancel'
              label='X'
              onClick={handleCloseButton}
            />
            <CustomButton
              className='buttonPOI ml-4'
              label='Walk'
              onClick={handleDirectionButton}
            />
            <CustomButton
              className='buttonPOI'
              label={`Walk from ${markerIcon}`}
              onClick={handlePinDirectionButton}
              disabled={longPressedLonLat.longitude === null && longPressedLonLat.latitude === null}
            />
            <div>
              <ButtonMealsUpload filteredResult={filteredResult} />
              <ButtonHotelsUpload filteredResult={filteredResult} />
              <ButtonPOIUpload filteredResult={filteredResult} />
              <ButtonTransportUpload filteredResult={filteredResult} />
            </div>
            <div translate='no' className='flex text-lg min-h-8'>
              {(filteredResult.location.address)
                ? (
                  <div className='min-w-10/12 text-left text-nowrap overflow-x-scroll'>
                    {`${index}. ${filteredResult.name} (${filteredResult.location.address})`}
                  </div>
                )
                : (
                  <div className='min-w-10/12 text-left text-nowrap overflow-x-scroll'>
                    {`${index}. ${filteredResult.name}`}
                  </div>
                )}
              <div className='min-w-2/12 text-right'>
                {`${filteredResult.distance}m`}
              </div>
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
