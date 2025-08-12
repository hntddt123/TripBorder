import { useEffect } from 'react';
import { skipToken } from '@reduxjs/toolkit/query/react';
import {
  useLazyGetNearbyPOIQuery,
  useLazyGetPOIPhotosQuery
} from '../../api/foursquareSliceAPI';
import CustomMap from './CustomMap';
import CustomToggle from '../CustomToggle';
import TripSearchTools from './TripSearchTools';
import CustomError from '../CustomError';
import TripPlanningTools from './TripPlanningTools';
import CustomFetching from '../CustomFetching';

export default function TripsItems() {
  const [getNearbyPOIQueryTrigger, { data: poi, isFetching, isSuccess, error }] = useLazyGetNearbyPOIQuery();
  const [getPOIPhotosQueryTrigger, getPOIPhotosQueryResult] = useLazyGetPOIPhotosQuery(isSuccess ? poi : skipToken);

  useEffect(() => {
    setTimeout(() => window.scrollTo({ top: 30, behavior: 'smooth' }), 100);
  }, []);

  return (
    <div>
      <div className='flex-col overflow-x-auto pt-1 text-center'>
        <CustomToggle
          translate='no'
          title='🏖️'
          component={<TripPlanningTools />}
        />
        <CustomToggle
          translate='no'
          title='⚙️'
          component={<TripSearchTools />}
        />
        <CustomFetching isFetching={isFetching} />
        <CustomError error={error} />
      </div>
      <div>
        <CustomMap
          data={(poi) || null}
          isFetching={isFetching}
          getNearbyPOIQueryTrigger={getNearbyPOIQueryTrigger}
          getPOIPhotosQueryTrigger={getPOIPhotosQueryTrigger}
          getPOIPhotosQueryResult={(getPOIPhotosQueryResult) || null}
        />
      </div>
    </div>
  );
}
