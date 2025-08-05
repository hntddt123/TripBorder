import { useCallback, useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import Map, { FullscreenControl, GeolocateControl, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { v4 as uuidv4 } from 'uuid';
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
  setIsShowingAddtionalPopUp,
  setIsUsingGPSLonLat,
  setSessionIDFSQ
} from '../../redux/reducers/mapReducer';
import { MAPBOX_API_KEY } from '../../constants/constants';
import { useLazyGetDirectionsQuery } from '../../api/mapboxSliceAPI';
import { useLazyGetLandmarkFromKeywordQuery } from '../../api/openstreemapSliceAPI';
import ClickMarker from './ClickMarker';
import ProximityMarkers from './ProximityMarkers';
import AdditionalMarkerInfo from './AdditionalMarkerInfo';
import DirectionLayer from './DirectionLayer';
import NearbyPOIList from './NearbyPOIList';
import CustomButton from '../CustomButton';
import GeocoderControl from './GeoCoderControl';
import InputLandmarkSearch from './InputLandmarkSearch';

// react-map-gl component
export default function CustomMap({
  data,
  isFetching,
  getNearbyPOIQueryTrigger,
  getPOIPhotosQueryTrigger,
  getPOIPhotosQueryResult
}) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const {
    mapStyle,
    viewState,
    isShowingAddtionalPopUp,
    isShowingSideBar,
    isNavigating,
    isThrowingDice,
    isDarkMode,
    isUsingMapBoxGeocoder,
    selectedPOIIDNumber,
    selectedPOIIcon,
    selectedPOICount,
    selectedPOIRadius,
    sessionIDFSQ,
  } = useSelector((state) => state.mapReducer);

  const dispatch = useDispatch();

  const [getDirectionsQueryTrigger, getDirectionsQueryResults] = useLazyGetDirectionsQuery();
  const [getLandmarkFromKeywordQueryTrigger, getLandmarkFromKeywordResult] = useLazyGetLandmarkFromKeywordQuery();

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

  const handleFlyTo = (lng, lat, zoom = viewState.zoom, duration = 1000) => {
    mapRef.current.flyTo({
      center: [lng, lat], // Target coordinates (array format: [longitude, latitude]).
      zoom: zoom, // Target zoom level.
      pitch: 30, // Target pitch angle in degrees.
      duration: duration, // Animation time in ms (e.g., 1000 = 1 second smooth transition).
      essential: true // Ensures animation runs even if user interacts (optional, for better UX).
    });
  };

  const handleMarkerSearch = (lng, lat) => {
    getNearbyPOIQueryTrigger({
      ll: `${lat},${lng}`,
      radius: selectedPOIRadius,
      limit: selectedPOICount,
      category: selectedPOIIDNumber,
      icon: selectedPOIIcon,
      sessionToken: sessionIDFSQ
    }, true);

    handleFlyTo(lng, lat, 15.5, 1500);

    if (isThrowingDice) {
      dispatch(setIsShowingOnlySelectedPOI(true));
    } else {
      dispatch(setIsShowingOnlySelectedPOI(false));
      dispatch(setSelectedPOI(''));
    }
    dispatch(setIsShowingAddtionalPopUp(false));
  };

  useEffect(() => {
    if (getLandmarkFromKeywordResult?.data && mapRef?.current) {
      const { lon, lat } = getLandmarkFromKeywordResult.data;
      const newMarker = {
        id: new Date().getTime(),
        lng: lon,
        lat: lat
      };

      console.log(getLandmarkFromKeywordResult.data);
      dispatch(setLongPressedLonLat({ longitude: lon, latitude: lat }));
      dispatch(setIsUsingGPSLonLat(false));
      dispatch(setMarker(newMarker));

      handleFlyTo(lon, lat, 15.5, 1500);
      handleMarkerSearch(lon, lat);
    }
  }, [getLandmarkFromKeywordResult]);

  const onGeocoderResult = (event) => {
    const [lng, lat] = event.result.center;
    dispatch(setLongPressedLonLat({ longitude: lng, latitude: lat }));
    dispatch(setIsUsingGPSLonLat(false));
    handleMarkerSearch(lng, lat);
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
    dispatch(setSessionIDFSQ(uuidv4()));
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
      dispatch(setIsUsingGPSLonLat(false));
      handleMarkerSearch(lng, lat);
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
          <NearbyPOIList
            poi={data}
            handleFlyTo={handleFlyTo}
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
    >
      {isUsingMapBoxGeocoder
        ? (
          <GeocoderControl
            mapboxAccessToken={MAPBOX_API_KEY}
            position='top-left'
            onResult={onGeocoderResult}
          />
        )
        : (
          <InputLandmarkSearch
            getLandmarkFromKeywordQueryTrigger={getLandmarkFromKeywordQueryTrigger}
          />
        )}
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
      <ProximityMarkers
        data={data}
        getPOIPhotosQueryTrigger={getPOIPhotosQueryTrigger}
        isFetching={isFetching}
        handleFlyTo={handleFlyTo}
      />
      <AdditionalMarkerInfo
        data={data}
        getPOIPhotosQueryResult={getPOIPhotosQueryResult}
        getDirectionsQueryTrigger={getDirectionsQueryTrigger}
      />
      {(mapLoaded) ? <ClickMarker /> : null}
      {(mapLoaded) ? <DirectionLayer getDirectionsQueryResults={getDirectionsQueryResults} /> : null}
      {renderBottomMenu()}
      {(getDirectionsQueryResults.isError) ? null : renderDirectionMenu()}
    </Map>
  );
}

CustomMap.propTypes = {
  data: FourSquareResponsePropTypes,
  isFetching: PropTypes.bool,
  getNearbyPOIQueryTrigger: PropTypes.func,
  getPOIPhotosQueryTrigger: PropTypes.func,
  getPOIPhotosQueryResult: FourSquareResponsePropTypes,
  getLandmarkFromKeywordResult: PropTypes.shape({
    lat: PropTypes.number,
    lon: PropTypes.number,
    name: PropTypes.string,
  })
};
