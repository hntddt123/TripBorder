import { useState } from 'react';
import { useSelector } from 'react-redux';
import { authAPI } from '../../api/authAPI';
import {
  useGetTripsByEmailQuery,
  useDeleteTripsMutation
} from '../../api/tripsAPI';
import CustomButton from '../CustomButton';
import { getLocalTime } from '../../utility/time';
import CustomToggle from '../CustomToggle';
import Meals from './Meals';
import Hotels from './Hotels';
import POIs from './POIs';
import Transports from './Transports';
import Ratings from './Ratings';
import TripTags from './TripTags';

function Trips() {
  const user = useSelector(authAPI.endpoints.checkAuthStatus.select());
  const email = user.data?.email;

  const [page, setPage] = useState(1);
  const limit = 3;
  const { data, isLoading, isFetching, error } = useGetTripsByEmailQuery({ email, page, limit });
  const { trips, total, totalPages, page: currentPage } = data || {};
  const [deleteTrip] = useDeleteTripsMutation();

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{`Status: ${error.status} - ${error.error}`}</div>;
  }

  const renderDetail = (trip) => (
    <div>
      <div>{`Start: ${getLocalTime(trip.start_date)}`}</div>
      <div>{`End: ${getLocalTime(trip.end_date)}`}</div>
      <div>{`Created: ${getLocalTime(trip.created_at)}`}</div>
      <div>{`Updated: ${getLocalTime(trip.updated_at)}`}</div>
    </div>
  );

  const renderTripsItem = (trip) => (
    <div className='flex justify-center'>
      <CustomToggle
        className='container overflow-x-auto font-mono -tracking-wider text-center'
        aria-label={`Trip Button ${trip.uuid}`}
        id={trip.uuid}
        title={trip.title}
        component={renderDetail(trip)}
      />
    </div>
  );

  return (
    <div className='overflow-x-auto table-fixed whitespace-nowrap'>
      <div className='text-base text-center'>
        <div>
          <CustomButton
            label='Previous'
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1 || isFetching}
          />
          <CustomButton
            label='Next'
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages || isFetching || totalPages === 0}
          />
        </div>
        <span>
          Page {currentPage} of {totalPages}
          (Total: {total} items)
        </span>
      </div>
      {isFetching && <div>Fetching new page...</div>}
      {trips?.map(((trip) => (
        <div key={trip.uuid}>
          <div className='cardMileage'>
            {renderTripsItem(trip)}
            <Meals tripID={trip.uuid} />
            <Hotels tripID={trip.uuid} />
            <POIs tripID={trip.uuid} />
            <Transports tripID={trip.uuid} />
            <Ratings tripID={trip.uuid} />
            <TripTags tripID={trip.uuid} />
            <CustomButton label='Delete 🗑️' onClick={() => deleteTrip(trip.uuid)} />
          </div>
        </div>
      )))}
    </div>
  );
}

export default Trips;
