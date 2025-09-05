import { useCallback, useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import Map, { GeolocateControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  setViewState,
  setMarker,
  // setGPSLonLat,
  setLongPressedLonLat,
  setIsShowingOnlySelectedPOI,
  setIsShowingSideBar,
  setIsNavigating,
  setSelectedPOI,
  setIsShowingAdditionalPopUp,
  setIsUsingGPSLonLat,
  setSessionIDFSQ,
  setSelectedPOIIcon
} from '../../redux/reducers/mapReducer';
import { MAPBOX_API_KEY } from '../../constants/apiConstants';
import { useLazyGetDirectionsQuery } from '../../api/mapboxSliceAPI';
import {
  // useLazyGetLandmarksFromPinQuery,
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
// import ButtonGPSSearch from './ButtonGPSSearch';
// import ButtonPOISelection from './ButtonPOISelection';
// import ToggleDice from './ToggleDice';
import CustomToggle from '../CustomToggle';
import TripPlanningTools from './TripPlanningTools';
import TripSearchTools from './TripSearchTools';
import { searchIcon } from '../../constants/constants';
// import CustomFetching from '../CustomFetching';
// import CustomError from '../CustomError';
// import { getNearestPOI } from '../../utility/markerCalculation';
// import { metersToDeltas } from '../../utility/geoCalculation';

// react-map-gl component
export default function CustomMap() {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeQueryType, setActiveQueryType] = useState('pin');
  const [sortedData, setSortedData] = useState([]);
  const {
    mapStyle,
    viewState,
    isShowingAdditionalPopUp,
    isShowingSideBar,
    isNavigating,
    isThrowingDice,
    isUsingMapBoxGeocoder,
    selectedPOI,
    // longPressedLonLat,
    // selectedPOIRadius,
    // selectedPOICount
  } = useSelector((state) => state.mapReducer);
  const {
    isDarkMode,
  } = useSelector((state) => state.userSettingsReducer);

  const dispatch = useDispatch();

  const [getDirectionsQueryTrigger, getDirectionsQueryResults] = useLazyGetDirectionsQuery();
  // const [getLandmarkFromPinQueryTrigger,
  //   { data: resultPin, error: errorPin, isFetching: isFetchingPin }
  // ] = useLazyGetLandmarksFromPinQuery();
  const [getLandmarkFromKeywordTrigger,
    { data: resultKeyword, error: errorKeyword, isFetching: isFetchingKeyword }
  ] = useLazyGetLandmarkFromKeywordQuery();

  const mapCSSStyle = { width: '100%', height: '94dvh', borderRadius: 10 };
  const mapRef = useRef();
  const pressTimer = useRef(null);
  const geoLocateRef = useRef(null);

  const screenHeight = window.innerHeight;
  // From your 0.0025° offset at zoom 15, assuming ~800px height and latitude ~0°
  const percentage = 7.28;
  const pixelShift = (percentage / 100) * screenHeight;
  // Nice for padding mechanics
  const mapViewPadding = { bottom: 4.2 * pixelShift };

  // const getIsFetchingByQueryType = () => {
  //   if (activeQueryType === 'pin') return isFetchingPin;
  //   return isFetchingKeyword;
  // };

  // useEffect(() => {
  //   if (resultPin && activeQueryType === 'pin') {
  //     setSortedData(getNearestPOI(resultPin, longPressedLonLat));
  //   }
  // }, [resultPin, activeQueryType]);

  useEffect(() => {
    if (resultKeyword && activeQueryType === 'keyword') {
      setSortedData(resultKeyword);
    }
  }, [resultKeyword, activeQueryType]);

  const handleFlyTo = (lng, lat, zoom = viewState.zoom, duration = 1000) => {
    mapRef.current.flyTo({
      center: [lng, lat], // Target coordinates (array format: [longitude, latitude]).
      zoom: zoom, // Target zoom level.
      pitch: 30, // Target pitch angle in degrees.
      duration: duration, // Animation time in ms (e.g., 1000 = 1 second smooth transition).
      essential: true // Ensures animation runs even if user interacts (optional, for better UX).
    });
  };

  // const handlePinSearch = (lng, lat) => {
  //   setActiveQueryType('pin');
  //   getLandmarkFromPinQueryTrigger({
  //     q: '[amenity=restaurant] tokyo',
  //     pinLat: lat,
  //     pinLon: lng,
  //     radiusDeg: metersToDeltas(selectedPOIRadius, lat),
  //     limit: selectedPOICount
  //   });
  //   handleFlyTo(lng, lat, 15.5, 1500);

  //   if (isThrowingDice) {
  //     dispatch(setIsShowingOnlySelectedPOI(true));
  //   } else {
  //     dispatch(setIsShowingOnlySelectedPOI(false));
  //     dispatch(setSelectedPOI(''));
  //   }
  //   dispatch(setIsShowingAdditionalPopUp(false));
  // };

  const handleKeywordSearch = async (keyword) => {
    setActiveQueryType('keyword');
    dispatch(setSelectedPOIIcon(searchIcon));
    const resultKey = (await getLandmarkFromKeywordTrigger(keyword)).data;

    if (resultKey.length > 0) {
      handleFlyTo(resultKey[0].lon, resultKey[0].lat, 15.5, 1500);
    }
    if (isThrowingDice) {
      dispatch(setIsShowingOnlySelectedPOI(true));
    } else {
      dispatch(setIsShowingOnlySelectedPOI(false));
      dispatch(setSelectedPOI(''));
    }
    dispatch(setIsShowingAdditionalPopUp(false));
  };

  const onGeocoderResult = (event) => {
    const [lng, lat] = event.result.center;
    dispatch(setLongPressedLonLat({ longitude: lng, latitude: lat }));
    dispatch(setIsUsingGPSLonLat(false));
    // handlePinSearch(lng, lat);
  };

  // const handleGeoRef = (ref) => {
  //   geoLocateRef.current = ref;
  // };

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

  // const handleCurrentLocation = (event) => {
  //   dispatch(setGPSLonLat({
  //     longitude: event.coords.longitude,
  //     latitude: event.coords.latitude,
  //   }));
  // };

  const handleClick = () => {
    if (!isNavigating && isShowingAdditionalPopUp && selectedPOI) {
      dispatch(setIsShowingOnlySelectedPOI(true));
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
      // handlePinSearch(lng, lat);
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
    if (sortedData && sortedData.length > 0 && !isThrowingDice && !isNavigating) {
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
        <CustomToggle
          className='toggle absoluteTopToolBarLeft'
          translate='no'
          titleOn='🏖️▼'
          titleOff='🏖️'
          component={<TripPlanningTools handleFlyTo={handleFlyTo} />}
        />
      </div>
      <div>
        <CustomToggle
          className='toggle absoluteTopToolBarRight'
          translate='no'
          titleOn='⚙️▼'
          titleOff='⚙️'
          component={<TripSearchTools />}
        />
      </div>
      <div className='absoluteBottomToolBar mb-1'>
        <div className='min-h-5'>
          {/* <CustomFetching isFetching={isFetchingPin} />
          <CustomError error={errorPin} /> */}
        </div>
        {/* <ButtonPOISelection
          isFetching={isFetchingPin}
        />
        <ButtonGPSSearch
          handleGPSSearch={handlePinSearch}
          isFetching={isFetchingPin}
        />
        <ToggleDice data={sortedData} handleFlyTo={handleFlyTo} /> */}
      </div>
      <GeolocateControl
        // ref={(ref) => handleGeoRef(ref)}
        position='bottom-right'
        positionOptions={{ enableHighAccuracy: true }}
        // onGeolocate={handleCurrentLocation}
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
      <AdditionalMarkerInfo
        data={sortedData}
        getDirectionsQueryTrigger={getDirectionsQueryTrigger}
        activeQueryType={activeQueryType}
      />
      {(mapLoaded) ? <ClickMarker /> : null}
      {(mapLoaded) ? <DirectionLayer getDirectionsQueryResults={getDirectionsQueryResults} /> : null}
      {renderBottomMenu()}
      {(getDirectionsQueryResults.isError) ? null : renderDirectionMenu()}
    </Map>
  );
}

CustomMap.propTypes = {
  isFetching: PropTypes.bool,
};
