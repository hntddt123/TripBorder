import { skipToken } from '@reduxjs/toolkit/query/react';
import { useLazyGetNearbyPOIQuery, useLazyGetPOIPhotosQuery } from '../../api/foursquareSliceAPI';
import CustomMap from './CustomMap';
import CustomToggle from '../CustomToggle';
import ButtonPOISelection from './ButtonPOISelection';
import TogglePlaceName from './TogglePlaceName';
import ToggleDice from './ToggleDice';
import TripSearchTools from './TripSearchTools';
import ButtonGPSSearch from './ButtonGPSSearch';
import ButtonPinSearch from './ButtonPinSearch';

function TripsItems() {
  const [getNearbyPOIQueryTrigger, { data: poi, isLoading, isFetching, isSuccess, error, reset }] = useLazyGetNearbyPOIQuery();
  const [getPOIPhotosQueryTrigger, getPOIPhotosQueryResult] = useLazyGetPOIPhotosQuery(isSuccess ? poi : skipToken);

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
        <div className='flex-col overflow-x-auto mt-1'>
          <div>
            <ButtonGPSSearch getNearbyPOIQueryTrigger={getNearbyPOIQueryTrigger} />
            <ButtonPinSearch getNearbyPOIQueryTrigger={getNearbyPOIQueryTrigger} />
            <ButtonPOISelection reset={reset} isFetching={isFetching} />
            <ToggleDice poi={poi} />
            <TogglePlaceName />
            <CustomToggle
              title='⚙️'
              component={<TripSearchTools />}
            />
          </div>
          {getAPIStatus()}
        </div>
      </div>
      <div>
        <CustomMap
          data={(poi) || null}
          getPOIPhotosQueryResult={(getPOIPhotosQueryResult) || null}
          getPOIPhotosQueryTrigger={getPOIPhotosQueryTrigger}
        />
      </div>
    </div>
  );
}

export default TripsItems;
