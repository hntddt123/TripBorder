import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { skipToken } from '@reduxjs/toolkit/query/react';
import Toggle from 'react-toggle';
// eslint-disable-next-line import/no-extraneous-dependencies
import ReactSlider from 'react-slider';
import { useLazyGetNearbyPOIQuery, useLazyGetPOIPhotosQuery } from '../api/foursquareSliceAPI';
import {
  setViewState,
  setIsFullPOIname,
  setIsShowingOnlySelectedPOI,
  setSelectedPOIIDNumber,
  setSelectedPOI,
  setSelectedPOICount,
  setSelectedPOIRadius,
  setIsThrowingDice
} from '../redux/reducers/mapReducer';
import CustomMap from './CustomMap';
import CustomButton from './CustomButton';
// import fourSquareCategory from '../constants/foursquarePOICategory.json';

const restaurantIcon = '🍱';
const hotelIcon = '🛌';
const carIcon = '🚘';
const GPSIcon = '🛰️🔎';
const pinIcon = '📍🔎';
const diceIcon = '🎲';

function TripsList() {
  const [getNearbyPOIQueryTrigger, { data: poi, isLoading, isFetching, isSuccess, error }] = useLazyGetNearbyPOIQuery();
  const [getPOIPhotosQueryTrigger, getPOIPhotosQueryResult] = useLazyGetPOIPhotosQuery(isSuccess ? poi : skipToken);

  const mapRef = useRef();
  const gpsLonLat = useSelector((state) => state.mapReducer.gpsLonLat);
  const longPressedLonLat = useSelector((state) => state.mapReducer.longPressedLonLat);
  const isFullPOIname = useSelector((state) => state.mapReducer.isFullPOIname);
  const isThrowingDice = useSelector((state) => state.mapReducer.isThrowingDice);
  const selectedPOIIDNumber = useSelector((state) => state.mapReducer.selectedPOIIDNumber);
  const selectedPOICount = useSelector((state) => state.mapReducer.selectedPOICount);
  const selectedPOIRadius = useSelector((state) => state.mapReducer.selectedPOIRadius);
  const selectedPOIIcon = useSelector((state) => state.mapReducer.selectedPOIIcon);
  const dispatch = useDispatch();

  const setPOIQuery = (ll, radius, limit, category, icon) => ({ ll, radius, limit, category, icon });

  const hasGPSLonLat = () => (gpsLonLat.longitude !== null && gpsLonLat.latitude !== null);
  const hasLongPressedLonLat = () => (longPressedLonLat.longitude !== null && longPressedLonLat.latitude !== null);

  const handleDropdownOnChange = (event) => {
    dispatch(setSelectedPOIIDNumber(event.target.value));
  };

  const handleLongPressedMarkerButton = () => {
    if (hasLongPressedLonLat()) {
      getNearbyPOIQueryTrigger(setPOIQuery(
        `${longPressedLonLat.latitude},${longPressedLonLat.longitude}`,
        selectedPOIRadius,
        selectedPOICount,
        selectedPOIIDNumber,
        selectedPOIIcon
      ), true);
      if (isThrowingDice) {
        dispatch(setIsShowingOnlySelectedPOI(true));
      } else {
        dispatch(setIsShowingOnlySelectedPOI(false));
        dispatch(setSelectedPOI(''));
      }
    }
  };

  const handleGPSButton = () => {
    if (hasGPSLonLat()) {
      getNearbyPOIQueryTrigger(setPOIQuery(
        `${gpsLonLat.latitude},${gpsLonLat.longitude}`,
        selectedPOIRadius,
        selectedPOICount,
        selectedPOIIDNumber,
        selectedPOIIcon
      ), true);
      dispatch(setViewState({
        longitude: gpsLonLat.longitude,
        latitude: gpsLonLat.latitude,
        zoom: 16
      }));

      if (isThrowingDice) {
        dispatch(setIsShowingOnlySelectedPOI(true));
      } else {
        dispatch(setIsShowingOnlySelectedPOI(false));
        dispatch(setSelectedPOI(''));
      }
    }
  };

  const handleDiceToggle = () => {
    dispatch(setIsThrowingDice(!isThrowingDice));
  };

  const handleFullNameToggle = () => {
    dispatch(setIsFullPOIname(!isFullPOIname));
  };

  const handleItemCountChange = (count) => {
    dispatch(setSelectedPOICount(count));
  };

  const handleRadiusChange = (radius) => {
    dispatch(setSelectedPOIRadius(radius));
  };

  const getLocation = () => ((hasGPSLonLat()) ? (
    <div className='cardInfo'>
      <div className='text-2xl'>
        {`Longtitude: ${(gpsLonLat.longitude.toFixed(8))}`}
      </div>
      <div className='text-2xl'>
        {`Latitude: ${gpsLonLat.latitude.toFixed(8)}`}
      </div>
    </div>
  ) : <div className='cardInfo text-2xl'>Press location button to get current GPS location for searching</div>);

  const getPlaceNameToggle = () => (
    <div className='text-2xl m-2'>
      Place Name
      <Toggle
        className='ml-2 align-middle'
        icons={false}
        defaultChecked={isFullPOIname}
        onChange={handleFullNameToggle}
      />
    </div>
  );

  const getDiceToggle = () => (
    <Toggle
      className='ml-2 align-middle'
      icons={false}
      defaultChecked={isThrowingDice}
      onChange={handleDiceToggle}
    />
  );

  const getAPIStatus = () => {
    if (isLoading) {
      return 'Loading...';
    }
    if (isFetching) {
      return 'Fetching...';
    }

    if (error) {
      return `Error: ${error.error}`;
    }

    return '';
  };

  return (
    <div className='mx-auto'>
      <div className='text-2xl'>
        <div className='m-1'>
          <CustomButton
            className='poiButton'
            label={GPSIcon}
            onClick={handleGPSButton}
            disabled={!hasGPSLonLat()}
          />
          <CustomButton
            className='poiButton'
            label={pinIcon}
            onClick={handleLongPressedMarkerButton}
            disabled={!hasLongPressedLonLat()}
          />
          {diceIcon}
          {getDiceToggle()}
          <select
            className='poiDropdownButton'
            onChange={(event) => handleDropdownOnChange(event)}
          >
            <option value='4d4b7105d754a06374d81259'> {restaurantIcon}</option>
            <option value='4bf58dd8d48988d1fa931735'> {hotelIcon}</option>
            <option value='4d4b7105d754a06379d81259'> {carIcon}</option>
          </select>
          {getAPIStatus()}
        </div>
      </div>
      <div ref={mapRef}>
        <CustomMap
          data={(poi) || null}
          getPOIPhotosQueryResult={(getPOIPhotosQueryResult) || null}
          getPOIPhotosQueryTrigger={getPOIPhotosQueryTrigger}
        />
      </div>
      <div className='text-2xl ml-2'>
        Item Count
        <ReactSlider
          className='slider'
          markClassName='sliderMark'
          thumbClassName='sliderThumbCount'
          trackClassName='sliderTrackCount'
          defaultValue={20}
          marks={[10, 15, 20, 25, 30, 35, 40, 45, 50]}
          step={5}
          min={10}
          max={50}
          // eslint-disable-next-line react/prop-types
          renderThumb={(props, state) => <div {...props} key={props.key}>{state.valueNow}</div>}
          // eslint-disable-next-line react/prop-types
          renderTrack={(props, state) => <div {...props} key={props.key}>{state.valueNow}</div>}
          onChange={(value) => handleItemCountChange(value)}
        />
        Radius (meter)
        <ReactSlider
          className='slider'
          markClassName='sliderMark'
          thumbClassName='sliderThumbRadius'
          trackClassName='sliderTrackRadius'
          defaultValue={500}
          marks={[100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]}
          step={100}
          min={100}
          max={1000}
          // eslint-disable-next-line react/prop-types
          renderThumb={(props, state) => <div {...props} key={props.key}>{state.valueNow}</div>}
          onChange={(value) => handleRadiusChange(value)}
        />
        {getPlaceNameToggle()}
        {getLocation()}
        {/* <CustomButton label='Save' /> */}
      </div>
    </div>
  );
}

export default TripsList;
