import { useCallback, useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import Map, { GeolocateControl, ScaleControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  setViewState,
  setMarker,
  setGPSLonLat,
  setLongPressedLonLat,
  setIsShowingOnlySelectedPOI,
  setIsShowingSideBar,
  setIsNavigating,
  setSelectedPOI,
  setIsShowingAdditionalPopUp,
  setIsUsingGPSLonLat,
  setSessionIDFSQ,
  setSelectedPOIIcon,
  setIsNorthUp
} from '../../redux/reducers/mapReducer';
import { MAPBOX_API_KEY } from '../../constants/apiConstants';
import { useLazyGetDirectionsQuery } from '../../api/mapboxSliceAPI';
import {
  useLazyGetLandmarkFromKeywordQuery
} from '../../api/openstreemapSliceAPI';
import ClickMarker from './ClickMarker';
import ProximityMarkers from './ProximityMarkers';
import AdditionalMarkerInfo from './AdditionalMarkerInfo';
import DirectionLayer from './DirectionLayer';
import NearbyPOIList from './NearbyPOIList';
import CustomButton from '../CustomButton';
import GeocoderControl from './GeoCoderControl';
import InputLandmarkSearch from './InputLandmarkSearch';
import CustomToggle from '../CustomToggle';
import TripPlanningTools from './TripPlanningTools';
import TripSearchTools from './TripSearchTools';
import { searchIcon } from '../../constants/constants';
import Compass from './mapControls/Compass';
import TripMarker from './TripMarker';

// react-map-gl component
export default function CustomMap({ premium }) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeQueryType, setActiveQueryType] = useState('pin');
  const [sortedData, setSortedData] = useState([]);

  const {
    mapStyle,
    viewState,
    isShowingAdditionalPopUp,
    isShowingSideBar,
    isNavigating,
    isUsingMapBoxGeocoder,
    selectedPOI,
    selectedPOIName,
    isNorthUp,
    isShowingScaleRuler,
  } = useSelector((state) => state.mapReducer);
  const {
    isDarkMode,
  } = useSelector((state) => state.userSettingsReducer);

  const dispatch = useDispatch();

  const [getDirectionsQueryTrigger, getDirectionsQueryResults] = useLazyGetDirectionsQuery();
  const [getLandmarkFromKeywordTrigger,
    { data: resultKeyword, error: errorKeyword, isFetching: isFetchingKeyword }
  ] = useLazyGetLandmarkFromKeywordQuery();

  const mapCSSStyle = { width: '100%', height: '100dvh' };
  const mapRef = useRef();
  const pressTimer = useRef(null);

  const screenHeight = window.innerHeight;
  // From your 0.0025° offset at zoom 15, assuming ~800px height and latitude ~0°
  const percentage = 7.28;
  const pixelShift = (percentage / 100) * screenHeight;
  // Nice for padding mechanics
  const mapViewPadding = { bottom: 4.2 * pixelShift };

  useEffect(() => {
    if (resultKeyword && activeQueryType === 'keyword') {
      setSortedData(resultKeyword);
    }
  }, [resultKeyword, activeQueryType]);

  const orientationEvent = (e) => {
    if (!isNorthUp) {
      mapRef.current?.easeTo({ bearing: -e.alpha, pitch: 45, duration: 100 }); // e.alpha is the device heading
    }
  };

  useEffect(() => {
    const orient = 'deviceorientation';
    if (isNorthUp === false) {
      window.addEventListener(orient, orientationEvent);
    }
    return () => window.removeEventListener(orient, orientationEvent);
  }, [isNorthUp]);

  const handleNorthUp = async () => {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      const permissionState = await DeviceMotionEvent.requestPermission();
      if (permissionState === 'granted') {
        dispatch(setIsNorthUp(!isNorthUp));
      }
      mapRef.current?.easeTo({ bearing: 0, pitch: 45, duration: 400 });
    }
  };

  const handleFlyTo = (lng, lat, zoom = viewState.zoom, duration = 1000) => {
    mapRef.current?.flyTo({
      center: [lng, lat], // Target coordinates (array format: [longitude, latitude]).
      zoom: zoom, // Target zoom level.
      pitch: 45, // Target pitch angle in degrees.
      duration: duration, // Animation time in ms (e.g., 1000 = 1 second smooth transition).
      essential: true // Ensures animation runs even if user interacts (optional, for better UX).
    });
  };

  const handleFitBounds = (bounds, pad, zoom = viewState.zoom, duration = 1000) => {
    mapRef.current?.fitBounds(
      bounds, // W,S,E,N bounds order
      {
        padding: pad,
        zoom: (mapRef.current.getZoom() >= 16.0 && zoom >= 16.0) ? 12.0 : zoom,
        pitch: 45,
        duration: duration,
        essential: true
      }
    );
  };

  const handleKeywordSearch = async (keyword) => {
    setActiveQueryType('keyword');
    dispatch(setSelectedPOIIcon(searchIcon));
    const resultKey = (await getLandmarkFromKeywordTrigger(keyword)).data;

    if (resultKey.length > 0) {
      handleFlyTo(resultKey[0].lon, resultKey[0].lat, 15.5, 1500);
    }
    dispatch(setIsShowingOnlySelectedPOI(false));
    dispatch(setSelectedPOI(''));
    dispatch(setIsShowingAdditionalPopUp(false));
  };

  const onGeocoderResult = (event) => {
    const [lng, lat] = event.result.center;
    dispatch(setLongPressedLonLat({ longitude: lng, latitude: lat }));
    dispatch(setIsUsingGPSLonLat(false));
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
    dispatch(setSessionIDFSQ(uuidv4()));
  };

  const onMove = useCallback((event) => {
    dispatch(setViewState(event.viewState));
  }, [dispatch]);

  const handleCurrentLocation = (event) => {
    const { coords } = event;

    if (coords) {
      dispatch(setGPSLonLat({
        longitude: coords.longitude,
        latitude: coords.latitude,
      }));
      handleFlyTo(coords.longitude, coords.latitude, 15.5, 1500);
    }
  };

  const handleClick = () => {
    if (!isNavigating && isShowingAdditionalPopUp && selectedPOI) {
      dispatch(setIsShowingOnlySelectedPOI(true));
    }
  };

  const handleMouseDown = (event) => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
    pressTimer.current = setTimeout(() => {
      const { lng, lat } = event.lngLat;
      const newMarker = [{
        id: new Date().getTime(),
        lng: lng,
        lat: lat
      }];
      dispatch(setLongPressedLonLat({
        longitude: lng,
        latitude: lat,
      }));
      dispatch(setMarker(newMarker));
      dispatch(setIsUsingGPSLonLat(false));
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
    dispatch(setIsShowingOnlySelectedPOI(false));
    dispatch(setIsNavigating(false));
    dispatch(setIsShowingSideBar(false));
  };

  const renderBottomMenu = () => {
    if (sortedData && sortedData.length > 0 && !isNavigating) {
      return (
        <div className={`bottomMenu ${isShowingAdditionalPopUp ? 'blur-sm' : ''}`}>
          <NearbyPOIList
            data={sortedData}
            handleFlyTo={handleFlyTo}
            activeQueryType={activeQueryType}
          />
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
        <div className={`${isShowingSideBar
          ? 'sidebarInstructions flex-center left'
          : 'sidebarInstructions flex-center left collapsed'}`}
        >
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
            <CustomButton
              className='buttonPOICancel'
              label='Stop Direction'
              onClick={handleCancelDirectionButton}
            />
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
      minZoom={1.7433354864918957}
      attributionControl={false}
    >
      {isUsingMapBoxGeocoder
        ? (
          <GeocoderControl
            mapboxAccessToken={MAPBOX_API_KEY}
            position='top'
            onResult={onGeocoderResult}
          />
        )
        : (
          <InputLandmarkSearch
            handleKeywordSearch={handleKeywordSearch}
            error={errorKeyword}
            isFetching={isFetchingKeyword}
          />
        )}
      <div>
        {(premium) ? <Compass handleNorthUp={handleNorthUp} /> : null}
      </div>
      <div>
        {(premium)
          ? (
            <CustomToggle
              className='toggle absoluteTopToolBarLeft select-none'
              translate='no'
              titleOn='🏖️▼'
              titleOff='🏖️'
              component={<TripPlanningTools handleFlyTo={handleFlyTo} handleFitBounds={handleFitBounds} />}
            />
          )
          : null}
      </div>
      <div>
        {(premium)
          ? (
            <CustomToggle
              className='toggle absoluteTopToolBarRight select-none'
              translate='no'
              titleOn='⚙️▼'
              titleOff='⚙️'
              component={<TripSearchTools />}
            />
          )
          : null}
      </div>
      {(isShowingScaleRuler) ? <ScaleControl /> : null}
      <GeolocateControl
        position='bottom-right'
        positionOptions={{ enableHighAccuracy: true, timeout: 10000 }}
        onError={(error) => { console.error('Geolocate error:', error); }}
        onGeolocate={handleCurrentLocation}
        showUserHeading
        showUserLocation
        trackUserLocation
      />
      <ProximityMarkers
        data={sortedData}
        isFetching={isFetchingKeyword}
        handleFlyTo={handleFlyTo}
        activeQueryType={activeQueryType}
      />
      {selectedPOIName
        ? (
          <AdditionalMarkerInfo
            data={sortedData}
            getDirectionsQueryTrigger={getDirectionsQueryTrigger}
            activeQueryType={activeQueryType}
          />
        ) : null}
      {(mapLoaded) ? <ClickMarker /> : null}
      {(mapLoaded) ? <TripMarker handleKeywordSearch={handleKeywordSearch} /> : null}
      {(mapLoaded) ? <DirectionLayer getDirectionsQueryResults={getDirectionsQueryResults} /> : null}
      {renderBottomMenu()}
      {(getDirectionsQueryResults.isError) ? null : renderDirectionMenu()}
    </Map>
  );
}

CustomMap.propTypes = {
  isFetching: PropTypes.bool,
  premium: PropTypes.bool
};
