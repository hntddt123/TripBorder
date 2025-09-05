import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Sheet } from 'react-modal-sheet';
import { OSMPropTypes } from '../../constants/osmPropTypes';
import {
  setIsShowingAdditionalPopUp,
  setIsShowingOnlySelectedPOI,
  setIsNavigating,
  setIsShowingSideBar,
  setSelectedPOI
} from '../../redux/reducers/mapReducer';
import { markerIcon } from '../../constants/constants';
import { useOrientation } from '../../hooks/useOrientation';
import { calculateDistance } from '../../utility/geoCalculation';
import CustomButton from '../CustomButton';
import ButtonMealsUpload from './ButtonMealsUpload';
import ButtonHotelsUpload from './ButtonHotelsUpload';
import ButtonPOIUpload from './ButtonPOIUpload';
import ButtonTransportUpload from './ButtonTransportUpload';

export default function ProximityMarkersInfo({ data, getDirectionsQueryTrigger, activeQueryType }) {
  const [remountKey, setRemountKey] = useState(0);
  const { isPortrait } = useOrientation();
  const {
    selectedPOI,
    selectedPOILonLat,
    gpsLonLat,
    longPressedLonLat,
    isShowingAdditionalPopUp,
    isThrowingDice
  } = useSelector((state) => state.mapReducer);

  useEffect(() => {
    setRemountKey((prev) => prev + 1);
  }, [isPortrait]);

  const dispatch = useDispatch();

  const handleCloseEvent = () => {
    dispatch(setIsShowingAdditionalPopUp(false));
    dispatch(setIsShowingOnlySelectedPOI(false));
  };

  const setRouteQuery = (lonStart, latStart, lonEnd, latEnd) => ({ lonStart, latStart, lonEnd, latEnd });

  const handleCloseButton = () => {
    dispatch(setIsShowingOnlySelectedPOI(false));
    if (isThrowingDice) {
      dispatch(setIsShowingOnlySelectedPOI(true));
    }
    dispatch(setIsShowingAdditionalPopUp(false));
    dispatch(setSelectedPOI(null));
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
    dispatch(setIsShowingAdditionalPopUp(false));
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
    dispatch(setIsShowingAdditionalPopUp(false));
    dispatch(setIsShowingOnlySelectedPOI(true));
    dispatch(setIsShowingSideBar(true));
    dispatch(setIsNavigating(true));
  };

  const renderDistance = (marker) => `${calculateDistance(
    marker.lat,
    marker.lon,
    longPressedLonLat.latitude,
    longPressedLonLat.longitude,
    'm'
  )} m`;

  const getPOINameAddress = (index, filteredResult) => {
    if (filteredResult.address.house_number && filteredResult.address.road) {
      return `${index} 
      ${filteredResult.name}
      (${filteredResult.address?.house_number} ${filteredResult.address.road})`;
    }
    if (filteredResult.address.road) {
      return `${index} ${filteredResult.name} (${filteredResult.address.road})`;
    }
    if (filteredResult.name) {
      return `${index} ${filteredResult.name}`;
    }
    return 'No Data';
  };

  if (data && data.length > 0 && isShowingAdditionalPopUp) {
    const filteredResult = data.filter((marker) => marker.place_id === selectedPOI)[0];
    const index = data.findIndex((marker) => marker.place_id === selectedPOI) + 1;

    if (filteredResult) {
      return (
        <div className='flex'>
          <Sheet
            key={remountKey}
            isOpen
            onClose={handleCloseEvent}
            initialSnap={2}
            snapPoints={[1, 0.7, 0.5, 0]}
          >
            <Sheet.Container>
              <Sheet.Header className='bg-black' />
              <Sheet.Content
                className='safeArea bg-black'
              >
                <Sheet.Scroller className='select-text'>
                  <div className='cardPOIAddInfo'>
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
                      disabled={longPressedLonLat.longitude === null
                        && longPressedLonLat.latitude === null}
                    />
                    <div>
                      <ButtonMealsUpload filteredResult={filteredResult} />
                      <ButtonHotelsUpload filteredResult={filteredResult} />
                      <ButtonPOIUpload filteredResult={filteredResult} />
                      <ButtonTransportUpload filteredResult={filteredResult} />
                    </div>
                    <div translate='no' className='flex text-lg min-h-8'>
                      <div className='min-w-10/12 text-left text-nowrap overflow-x-auto'>
                        {getPOINameAddress(index, filteredResult)}
                      </div>
                      <div className='min-w-2/12 text-right'>
                        {(activeQueryType === 'pin') ? renderDistance(filteredResult) : null}
                      </div>
                    </div>
                  </div>
                </Sheet.Scroller>
              </Sheet.Content>
            </Sheet.Container>
          </Sheet>
        </div>
      );
    }
  }
  return null;
}

ProximityMarkersInfo.propTypes = {
  data: PropTypes.arrayOf(OSMPropTypes),
  getDirectionsQueryTrigger: PropTypes.func,
  activeQueryType: PropTypes.string
};
