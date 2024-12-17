/* eslint-disable react/prop-types */
import 'mapbox-gl/dist/mapbox-gl.css';
import { useCallback, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Map, { FullscreenControl, GeolocateControl, NavigationControl } from 'react-map-gl';
import { FourSquareResponsePropTypes } from '../constants/fourSquarePropTypes';
import {
  setViewState,
  setMarker,
  setGPSLonLat,
  setLongPressedLonLat,
  setIsShowingOnlySelectedPOI,
  setIsShowingSideBar,
  setIsNavigating,
} from '../redux/reducers/mapReducer';
import { MAPBOX_API_KEY } from '../constants/constants';
import { useLazyGetDirectionsQuery } from '../api/mapboxSliceAPI';
import ClickMarker from './ClickMarker';
import ProximityMarkers from './ProximityMarkers';
import AdditionalMarkerInfo from './AdditionalMarkerInfo';
import DirectionLayer from './DirectionLayer';
import NearbyPOIList from './NearbyPOIList';
import CustomButton from './CustomButton';
import GeocoderControl from './GeoCoderControl';

// react-map-gl component
export default function CustomMap({ data, getPOIPhotosQueryResult, getPOIPhotosQueryTrigger }) {
  const [getDirectionsQueryTrigger, getDirectionsQueryResults] = useLazyGetDirectionsQuery();

  const mapStyle = useSelector((state) => state.mapReducer.mapStyle);
  const viewState = useSelector((state) => state.mapReducer.viewState);
  const isShowingAddtionalPopUp = useSelector((state) => state.mapReducer.isShowingAddtionalPopUp);
  const isShowingSideBar = useSelector((state) => state.mapReducer.isShowingSideBar);
  const isNavigating = useSelector((state) => state.mapReducer.isNavigating);
  const isThrowingDice = useSelector((state) => state.mapReducer.isThrowingDice);
  const isDarkMode = useSelector((state) => state.mapReducer.isDarkMode);

  const [mapLoaded, setMapLoaded] = useState(false);
  const dispatch = useDispatch();
  const mapCSSStyle = { width: '100%', height: '90vh', borderRadius: 10 };
  const pressTimer = useRef(null);

  const handleStyleLoad = (map) => {
    setMapLoaded(true);
    map.target.touchZoomRotate.enable();
    map.target.touchZoomRotate.disableRotation();
    map.target.dragRotate.enable();
    map.target.dragRotate._mousePitch.enable();
    map.target.dragRotate._mouseRotate.disable();
    if (isDarkMode) {
      map.target.setConfigProperty('basemap', 'lightPreset', 'night');
    } else {
      map.target.setConfigProperty('basemap', 'lightPreset', 'day');
    }
  };

  const onMove = useCallback((event) => {
    dispatch(setViewState(event.viewState));
  }, []);

  const handleCurrentLocation = (event) => {
    dispatch(setGPSLonLat({
      longitude: event.coords.longitude,
      latitude: event.coords.latitude,
    }));
  };

  const handleClick = () => {
    if (!isNavigating) {
      dispatch(setIsShowingOnlySelectedPOI(false));
    }

    if (isThrowingDice) {
      dispatch(setIsShowingOnlySelectedPOI(true));
    }
  };

  const handleMouseDown = (event) => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
    pressTimer.current = setTimeout(() => {
      const { lng, lat } = event.lngLat;
      const newMarker = {
        id: new Date().getTime(),
        lng: lng,
        lat: lat
      };
      dispatch(setLongPressedLonLat({
        longitude: lng,
        latitude: lat,
      }));
      dispatch(setMarker(newMarker));
    }, 500); // 500ms delay before considered a 'hold'
  };

  const handleMouseUp = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const handleSideBarToggle = () => {
    dispatch(setIsShowingSideBar(!isShowingSideBar));
  };

  const handleCancelDirectionButton = () => {
    if (isThrowingDice) {
      dispatch(setIsShowingOnlySelectedPOI(true));
    } else {
      dispatch(setIsShowingOnlySelectedPOI(false));
    }
    dispatch(setIsNavigating(false));
    dispatch(setIsShowingSideBar(false));
  };

  const renderBottomMenu = () => {
    if (data && data.results.length > 0 && !isThrowingDice) {
      return (
        <div className={`bottommenu ${isShowingAddtionalPopUp ? 'blur-sm' : ''}`}>
          <NearbyPOIList poi={data} />
        </div>
      );
    }
    return null;
  };

  const renderDirectionMenu = () => {
    if (getDirectionsQueryResults.isSuccess && !getDirectionsQueryResults.isUninitialized && isNavigating) {
      return (
        <div className={`${isShowingSideBar ? 'sidebarInstructions flex-center left' : 'sidebarInstructions flex-center left collapsed'}`}>
          <div className=' flex-center text-lg top-20'>
            <div className='sidebarInstructionsContent'>
              {getDirectionsQueryResults.data.routes[0].legs[0].steps.map((step, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <div key={getDirectionsQueryResults.data.uuid + i}>
                  {i + 1} {step.maneuver.instruction}
                </div>
              ))}
              <CustomButton className='poiCancelButton justify-center' label='Cancel Navigation' onClick={handleCancelDirectionButton} />
            </div>
            <button className='sidebarInstructionsToggle left' onClick={handleSideBarToggle}>
              {(isShowingSideBar) ? String.fromCharCode(0x2190) : String.fromCharCode(0x2192)}
            </button>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Map
      reuseMaps
      {...viewState}
      onMove={onMove}
      onClick={handleClick}
      onLoad={(map) => handleStyleLoad(map)}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMoveStart={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      onTouchMove={handleMouseUp}
      style={mapCSSStyle}
      mapStyle={mapStyle}
      mapLib={import('mapbox-gl')}
      mapboxAccessToken={MAPBOX_API_KEY}
      projection='mercator'
      pitchWithRotate={false}
      dragRotate={false}
      touchZoomRotate={false}
    >
      <GeocoderControl
        className='poiButton'
        mapboxAccessToken={MAPBOX_API_KEY}
        position='top-left'
      />
      <FullscreenControl position='top-right' />
      <GeolocateControl
        position='top-right'
        positionOptions={{ enableHighAccuracy: true }}
        onGeolocate={handleCurrentLocation}
        showUserHeading
        showUserLocation
        trackUserLocation
      />
      <NavigationControl />
      <ProximityMarkers data={data} getPOIPhotosQueryTrigger={getPOIPhotosQueryTrigger} />
      <AdditionalMarkerInfo data={data} getPOIPhotosQueryResult={getPOIPhotosQueryResult} getDirectionsQueryTrigger={getDirectionsQueryTrigger} />
      {(mapLoaded) ? <ClickMarker /> : null}
      {(mapLoaded) ? <DirectionLayer getDirectionsQueryResults={getDirectionsQueryResults} /> : null}
      {renderBottomMenu()}
      {renderDirectionMenu()}
    </Map>
  );
}

CustomMap.propTypes = {
  data: FourSquareResponsePropTypes,
};
