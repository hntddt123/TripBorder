import { useCallback, useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import Map, { GeolocateControl, ScaleControl } from 'react-map-gl';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  setViewState,
  setMarker,
  setGPSLonLat,
  setGPSState,
  setLongPressedLonLat,
  setIsShowingOnlySelectedPOI,
  setIsShowingSideBar,
  setIsNavigating,
  setSelectedPOI,
  setIsShowingAdditionalPopUp,
  setIsUsingGPSLonLat,
  setSessionIDFSQ,
  setSelectedPOIIcon,
  setIsNorthUp,
  setBearing
} from '../../redux/reducers/mapReducer';
import { useOrientation } from '../../hooks/useOrientation';
import { MAPBOX_API_KEY } from '../../constants/apiConstants';
import { useLazyGetDirectionsQuery } from '../../api/mapboxSliceAPI';
import {
  useLazyGetLandmarkFromKeywordQuery
} from '../../api/openstreemapSliceAPI';
import { searchIcon } from '../../constants/constants';
import ClickMarker from './ClickMarker';
import ProximityMarkers from './ProximityMarkers';
import AdditionalMarkerInfo from './AdditionalMarkerInfo';
import DirectionLayer from './DirectionLayer';
import NearbyPOIList from './NearbyPOIList';
import CustomButton from '../CustomButton';
import GeocoderControl from './GeoCoderControl';
import CustomToggle from '../CustomToggle';
import TripPlanningTools from './mapControls/TripPlanningTools';
import InputLandmarkSearch from './mapControls/InputLandmarkSearch';
import TripSearchTools from './mapControls/TripSearchTools';
import Compass from './mapControls/Compass';
import TripMarker from './TripMarker';
import GPS from './mapControls/GPS';

// react-map-gl component
export default function TripMap({ premium }) {
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
    isMapRotate,
    gpsLonLat
  } = useSelector((state) => state.mapReducer);
  const {
    isDarkMode
  } = useSelector((state) => state.userSettingsReducer);
  const { type } = useOrientation();

  const dispatch = useDispatch();

  const [getDirectionsQueryTrigger, getDirectionsQueryResults] = useLazyGetDirectionsQuery();
  const [getLandmarkFromKeywordTrigger,
    { data: resultKeyword, error: errorKeyword, isFetching: isFetchingKeyword }
  ] = useLazyGetLandmarkFromKeywordQuery();

  const mapCSSStyle = { width: '100%', height: '100dvh' };
  const mapRef = useRef();
  const geocoderRef = useRef();
  const geolocateControlRef = useRef();
  const pressTimer = useRef(null);
  const rafID = useRef(null);
  const lastBearingRef = useRef(null);
  const lastOrientationUpdate = useRef(0);

  const screenHeight = window.innerHeight;
  // From your 0.0025° offset at zoom 15, assuming ~800px height and latitude ~0°
  const percentage = 7.28;
  const pixelShift = (percentage / 100) * screenHeight;
  // Nice for padding mechanics
  const mapViewPadding = { bottom: 4.2 * pixelShift };

  const getDirectionLabel = (bearing) => {
    if (bearing == null || Number.isNaN(bearing)) return '';

    // Normalize 0–360 and handle negative/overflow
    const normalized = ((bearing % 360) + 360) % 360;

    const directions = ['⬆️', '↗️', '➡️', '↘️', '⬇️', '↙️', '⬅️', '↖️'];
    const index = Math.round(normalized / 45) % 8;

    return directions[index];
  };

  useEffect(() => {
    if (mapRef.current !== null) {
      const map = mapRef.current.getMap();
      if (isMapRotate) {
        map.touchZoomRotate.enableRotation();
        map.dragRotate._mouseRotate.enable();
      } else {
        map.touchZoomRotate.disableRotation();
        map.dragRotate._mouseRotate.disable();
        map.resetNorth();
      }
    }
  }, [isMapRotate]);

  useEffect(() => {
    if (resultKeyword && activeQueryType === 'keyword') {
      setSortedData(resultKeyword);
    }
  }, [resultKeyword, activeQueryType]);

  const orientationEvent = useCallback((e) => {
    const now = Date.now();
    if (now - lastOrientationUpdate.current < 25) return; // throttle
    lastOrientationUpdate.current = now;

    if (!isNorthUp && gpsLonLat?.longitude && gpsLonLat?.latitude) {
      let newBearing = -e.alpha;
      newBearing = ((newBearing % 360) + 360) % 360;

      rafID.current = requestAnimationFrame(() => {
        if (Math.abs(newBearing - lastBearingRef.current) > 0.5) {
          if (type === 'portrait-primary') {
            mapRef.current?.getMap().setBearing(newBearing);
            lastBearingRef.current = newBearing;
            dispatch(setBearing(getDirectionLabel(newBearing)));
          } else if (type === 'landscape-primary') {
            mapRef.current?.getMap().setBearing(newBearing + 90);
            lastBearingRef.current = newBearing + 90;
            dispatch(setBearing(getDirectionLabel(newBearing + 90)));
          } else if (type === 'landscape-secondary') {
            mapRef.current?.getMap().setBearing(newBearing - 90);
            lastBearingRef.current = newBearing - 90;
            dispatch(setBearing(getDirectionLabel(newBearing - 90)));
          }
        }
        if (geolocateControlRef.current?._watchState !== 'ACTIVE_LOCK') {
          geolocateControlRef.current?.trigger();
        }
      });
    }
  });

  useEffect(() => {
    const orient = 'deviceorientation';
    if (isNorthUp === false) {
      window.addEventListener(orient, orientationEvent);
    }
    return () => window.removeEventListener(orient, orientationEvent);
  }, [isNorthUp, type]);

  const handleNorthUp = async () => {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      const permissionState = await DeviceMotionEvent.requestPermission();
      if (permissionState === 'granted') {
        dispatch(setIsNorthUp(!isNorthUp));
      }
      mapRef.current?.easeTo({ bearing: 0, pitch: 45, duration: 400 });
    }
  };

  const handleGPS = () => {
    geolocateControlRef.current?.trigger();
    dispatch(setGPSState(geolocateControlRef.current?._watchState));
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

  const handleKeywordSearch = async (query) => {
    setActiveQueryType('keyword');
    dispatch(setSelectedPOIIcon(searchIcon));
    const resultKey = (await getLandmarkFromKeywordTrigger(query)).data;

    if (resultKey?.length > 0) {
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
    handleFlyTo(viewState.longitude, viewState.latitude, viewState.zoom, 10);
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
      mapLib={mapboxgl}
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
            ref={geocoderRef}
            mapboxAccessToken={MAPBOX_API_KEY}
            position='top'
            onResult={onGeocoderResult}
          />
        )
        : (
          <InputLandmarkSearch
            handleKeywordSearch={handleKeywordSearch}
            error={errorKeyword}
          />
        )}
      <div>
        <Compass handleNorthUp={handleNorthUp} />
        <GPS handleGPS={handleGPS} watchState={geolocateControlRef.current?._watchState} />
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
        ref={geolocateControlRef}
        showButton={false}
        positionOptions={{ enableHighAccuracy: true, timeout: 5000 }}
        onError={(error) => { console.error('Geolocate error:', error); }}
        onGeolocate={handleCurrentLocation}
        showUserLocation
        showAccuracyCircle={false}
        followUserLocation
        showUserHeading
        trackUserLocation
        fitBoundsOptions={{
          maxZoom: 15,
          pitch: 45 // ← Tilt the camera when locking
        }}
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
      {(mapLoaded) ? <TripMarker /> : null}
      {(mapLoaded) ? <DirectionLayer getDirectionsQueryResults={getDirectionsQueryResults} /> : null}
      {renderBottomMenu()}
      {(getDirectionsQueryResults.isError) ? null : renderDirectionMenu()}
    </Map>
  );
}

TripMap.propTypes = {
  premium: PropTypes.bool
};
