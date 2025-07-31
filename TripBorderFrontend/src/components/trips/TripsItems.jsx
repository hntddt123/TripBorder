import { useEffect } from 'react';
import { skipToken } from '@reduxjs/toolkit/query/react';
import {
  useLazyGetNearbyPOIQuery,
  useLazyGetPOIPhotosQuery
} from '../../api/foursquareSliceAPI';
import CustomMap from './CustomMap';
import CustomToggle from '../CustomToggle';
import ButtonPOISelection from './ButtonPOISelection';
import ToggleDice from './ToggleDice';
import TripSearchTools from './TripSearchTools';
import ButtonGPSSearch from './ButtonGPSSearch';
import CustomError from '../CustomError';
import TripPlanningTools from './TripPlanningTools';

function TripsItems() {
  const [getNearbyPOIQueryTrigger, { data: poi, isLoading, isFetching, isSuccess, error, reset }] = useLazyGetNearbyPOIQuery();
  const [getPOIPhotosQueryTrigger, getPOIPhotosQueryResult] = useLazyGetPOIPhotosQuery(isSuccess ? poi : skipToken);

  useEffect(() => {
    setTimeout(() => window.scrollTo({ top: 30, behavior: 'smooth' }), 100);
  }, []);

  const getAPIStatus = () => {
    if (isLoading) {
      return <span>Loading</span>;
    }
    if (isFetching) {
      return <span>Fetching</span>;
    }

    if (error) {
      return <CustomError error={error} />;
    }

    return null;
  };

  return (
    <div>
      <div className='flex-col overflow-x-auto pt-1.5'>
        <div className='max-h-13'>
          <ButtonGPSSearch getNearbyPOIQueryTrigger={getNearbyPOIQueryTrigger} />
          <ButtonPOISelection reset={reset} isFetching={isFetching} />
          <ToggleDice poi={poi} />
          <CustomToggle
            translate='no'
            title='⚙️'
            component={<TripSearchTools />}
          />
          <CustomToggle
            translate='no'
            title='🏖️'
            component={<TripPlanningTools />}
          />
          {getAPIStatus()}
        </div>
      </div>
      <div>
        <CustomMap
          data={(poi) || null}
          getNearbyPOIQueryTrigger={getNearbyPOIQueryTrigger}
          getPOIPhotosQueryTrigger={getPOIPhotosQueryTrigger}
          getPOIPhotosQueryResult={(getPOIPhotosQueryResult) || null}
        />
      </div>
    </div>
  );
}

export default TripsItems;
