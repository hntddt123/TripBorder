import { useDispatch, useSelector } from 'react-redux';
import { skipToken } from '@reduxjs/toolkit/query/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import Toggle from 'react-toggle';
import { useLazyGetNearbyPOIQuery, useLazyGetPOIPhotosQuery } from '../api/mapboxSliceAPI';
import { setCurrentLocation, setViewState, setIsfullPOIname, setIsShowingOnlySelectedPOI } from '../redux/reducers/mapReducer';
import CustomMap from './CustomMap';
import CustomButton from './CustomButton';
import NearbyPOIList from './NearbyPOIList';

const gpsIcon = '🛰️';
const restaurantIcon = '🍱';
const hotelIcon = '🛌';
const carIcon = '🚘';

function TripsList() {
  const [getNearbyPOIQueryTrigger, { data: poi, isLoading, isFetching, isSuccess, error }] = useLazyGetNearbyPOIQuery();
  const [getPOIPhotosQueryTrigger, getPOIPhotosQueryResult] = useLazyGetPOIPhotosQuery(isSuccess ? poi : skipToken);

  const gpsLonLat = useSelector((state) => state.mapReducer.gpsLonLat);
  const isfullPOIname = useSelector((state) => state.mapReducer.isfullPOIname);
  const isShowingOnlySelectedPOI = useSelector((state) => state.mapReducer.isShowingOnlySelectedPOI);
  const dispatch = useDispatch();

  const setPOIQuery = (ll, radius, limit, category, icon) => ({ ll, radius, limit, category, icon });

  const hasLonLat = () => (gpsLonLat.longitude !== null && gpsLonLat.latitude !== null);

  function success(position) {
    const { longitude, latitude } = position.coords;

    dispatch(setCurrentLocation({
      longitude: longitude,
      latitude: latitude
    }));
    dispatch(setViewState({
      longitude: longitude,
      latitude: latitude,
      zoom: 15
    }));
  }

  function gpsError() {
    console.error('Unable to retrieve your location');
  }

  const handleGPSButton = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, gpsError);
    } else {
      console.error('Geolocation not supported');
    }
  };

  const handleRestaurantButton = () => {
    if (hasLonLat()) {
      getNearbyPOIQueryTrigger(setPOIQuery(`${gpsLonLat.latitude},${gpsLonLat.longitude}`, 500, 20, '4d4b7105d754a06374d81259', restaurantIcon));
    }
  };

  const handleHotelButton = () => {
    if (hasLonLat()) {
      getNearbyPOIQueryTrigger(setPOIQuery(`${gpsLonLat.latitude},${gpsLonLat.longitude}`, 500, 20, '4bf58dd8d48988d1fa931735', hotelIcon));
    }
  };

  const handleCarButton = () => {
    if (hasLonLat()) {
      getNearbyPOIQueryTrigger(setPOIQuery(`${gpsLonLat.latitude},${gpsLonLat.longitude}`, 500, 20, '4d4b7105d754a06379d81259', carIcon));
    }
  };

  const handleFullNameToggle = () => {
    dispatch(setIsfullPOIname(!isfullPOIname));
  };

  const handleIsShowingOnlySelectedPOIToggle = () => {
    dispatch(setIsShowingOnlySelectedPOI(!isShowingOnlySelectedPOI));
  };

  const getLoadingStatus = () => (
    <div>
      <div>
        {(isLoading ? 'Loading...' : null)}
      </div>
      <div>
        {(isFetching) ? 'Fetching...' : null}
      </div>
      <div>
        {(error) ? `Error: ${error.error}` : null}
      </div>
    </div>
  );

  const getLocation = () => ((hasLonLat()) ? (
    <div className='cardInfo'>
      <div className='text-2xl'>
        Click above options
      </div>
      <div className='text-2xl'>
        {`Longtitude: ${gpsLonLat.longitude}`}
      </div>
      <div className='text-2xl'>
        {`Latitude: ${gpsLonLat.latitude}`}
      </div>
    </div>
  ) : <div className='cardInfo text-2xl'>Press location button to get current GPS location for searching</div>);

  return (
    <div className='container mx-auto'>
      <div>
        <CustomButton label={gpsIcon} onClick={handleGPSButton} />
        <CustomButton label={restaurantIcon} onClick={handleRestaurantButton} disabled={!hasLonLat()} />
        <CustomButton label={hotelIcon} onClick={handleHotelButton} disabled={!hasLonLat()} />
        <CustomButton label={carIcon} onClick={handleCarButton} disabled={!hasLonLat()} />
        {getLocation()}
      </div>
      <div className='text-2xl'>
        Show Full POI Name
        <Toggle
          className='ml-2 align-middle'
          icons={false}
          defaultChecked={isfullPOIname}
          onChange={handleFullNameToggle}
        />
      </div>
      <div className='text-2xl'>
        Show only Selected Place
        <Toggle
          className='ml-2 align-middle'
          icons={false}
          defaultChecked={isShowingOnlySelectedPOI}
          onChange={handleIsShowingOnlySelectedPOIToggle}
        />
      </div>
      {getLoadingStatus()}
      <CustomMap
        data={(poi) || null}
        getPOIPhotosQueryResult={(getPOIPhotosQueryResult) || null}
        getPOIPhotosQueryTrigger={getPOIPhotosQueryTrigger}
      />
      <NearbyPOIList poi={poi} />
      {/* <CustomButton label='Save' /> */}
    </div>
  );
}

export default TripsList;
