import { useCallback, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import Map, { FullscreenControl, GeolocateControl, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FourSquareResponsePropTypes } from '../../constants/fourSquarePropTypes';
import {
  setViewState,
  setMarker,
  setGPSLonLat,
  setLongPressedLonLat,
  setIsShowingOnlySelectedPOI,
  setIsShowingSideBar,
  setIsNavigating,
  setSelectedPOI,
  setIsShowingAddtionalPopUp
} from '../../redux/reducers/mapReducer';
import { MAPBOX_API_KEY } from '../../constants/constants';
import { useLazyGetDirectionsQuery } from '../../api/mapboxSliceAPI';
import ClickMarker from './ClickMarker';
import ProximityMarkers from './ProximityMarkers';
import AdditionalMarkerInfo from './AdditionalMarkerInfo';
import DirectionLayer from './DirectionLayer';
import NearbyPOIList from './NearbyPOIList';
import CustomButton from '../CustomButton';
import GeocoderControl from './GeoCoderControl';

// react-map-gl component
export default function CustomMap({ data, getNearbyPOIQueryTrigger, getPOIPhotosQueryTrigger, getPOIPhotosQueryResult }) {
  const [mapLoaded, setMapLoaded] = useState(false);

  const mapStyle = useSelector((state) => state.mapReducer.mapStyle);
  const viewState = useSelector((state) => state.mapReducer.viewState);

  const isShowingAddtionalPopUp = useSelector((state) => state.mapReducer.isShowingAddtionalPopUp);
  const isShowingSideBar = useSelector((state) => state.mapReducer.isShowingSideBar);
  const isNavigating = useSelector((state) => state.mapReducer.isNavigating);
  const isThrowingDice = useSelector((state) => state.mapReducer.isThrowingDice);
  const isDarkMode = useSelector((state) => state.mapReducer.isDarkMode);

  const selectedPOIIDNumber = useSelector((state) => state.mapReducer.selectedPOIIDNumber);
  const selectedPOICount = useSelector((state) => state.mapReducer.selectedPOICount);
  const selectedPOIRadius = useSelector((state) => state.mapReducer.selectedPOIRadius);
  const selectedPOIIcon = useSelector((state) => state.mapReducer.selectedPOIIcon);
  const dispatch = useDispatch();

  const [getDirectionsQueryTrigger, getDirectionsQueryResults] = useLazyGetDirectionsQuery();

  const mapCSSStyle = { width: '100%', height: '88vh', borderRadius: 10 };
  const mapRef = useRef();
  const pressTimer = useRef(null);
  const geoLocateRef = useRef(null);

  const screenHeight = window.innerHeight;
  // From your 0.0025° offset at zoom 15, assuming ~800px height and latitude ~0°
  const percentage = 7.28;
  const pixelShift = (percentage / 100) * screenHeight;
  // Nice for padding mechanics
  const mapViewPadding = isShowingAddtionalPopUp ? { bottom: 6.9 * pixelShift } : { bottom: 0 };

  const handleLongPressedMarkerSearch = (lng, lat) => {
    getNearbyPOIQueryTrigger({
      ll: `${lat},${lng}`,
      radius: selectedPOIRadius,
      limit: selectedPOICount,
      category: selectedPOIIDNumber,
      icon: selectedPOIIcon
    }, true);
    mapRef.current.flyTo({
      center: [lng, lat], // Target coordinates (array format: [longitude, latitude]).
      zoom: 15, // Target zoom level.
      pitch: 30, // Target pitch angle in degrees.
      duration: 1500, // Animation time in ms (e.g., 1000 = 1 second smooth transition).
      essential: true // Ensures animation runs even if user interacts (optional, for better UX).
    });
    if (isThrowingDice) {
      dispatch(setIsShowingOnlySelectedPOI(true));
    } else {
      dispatch(setIsShowingOnlySelectedPOI(false));
      dispatch(setSelectedPOI(''));
    }
    dispatch(setIsShowingAddtionalPopUp(false));
  };

  const handleGeoRef = (ref) => {
    geoLocateRef.current = ref;
  };

  const handleOnLoad = (map) => {
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
    setMapLoaded(true);
    geoLocateRef.current?.trigger();
  };

  const onMove = useCallback((event) => {
    dispatch(setViewState(event.viewState));
  }, [dispatch]);

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
      handleLongPressedMarkerSearch(lng, lat);
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
    if (getDirectionsQueryResults.isSuccess
      && !getDirectionsQueryResults.isUninitialized
      && isNavigating) {
      return (
        <div className={`${isShowingSideBar ? 'sidebarInstructions flex-center left' : 'sidebarInstructions flex-center left collapsed'}`}>
          <div className='flex-center text-lg top-14'>
            <div className='sidebarInstructionsContent'>
              {getDirectionsQueryResults.data.routes[0].legs[0].steps.map((step, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <div translate='no' key={getDirectionsQueryResults.data.uuid + i}>
                  {i + 1} {step.maneuver.instruction}
                </div>
              ))}
            </div>
            <button className='sidebarInstructionsToggle left' onClick={handleSideBarToggle}>
              {(isShowingSideBar) ? String.fromCharCode(0x2190) : String.fromCharCode(0x2192)}
            </button>
            <CustomButton className='buttonPOICancel' label='Stop Direction' onClick={handleCancelDirectionButton} />
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Map
      ref={mapRef}
      reuseMaps
      {...viewState}
      onMove={onMove}
      onClick={handleClick}
      onLoad={(map) => handleOnLoad(map)}
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
      padding={mapViewPadding}
    >
      <GeocoderControl
        mapboxAccessToken={MAPBOX_API_KEY}
        position='top-left'
      />
      <FullscreenControl position='top-right' />
      <GeolocateControl
        ref={(ref) => handleGeoRef(ref)}
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
      {(getDirectionsQueryResults.isError) ? null : renderDirectionMenu()}
    </Map>
  );
}

CustomMap.propTypes = {
  data: FourSquareResponsePropTypes,
  getNearbyPOIQueryTrigger: PropTypes.func,
  getPOIPhotosQueryTrigger: PropTypes.func,
  getPOIPhotosQueryResult: FourSquareResponsePropTypes
};
