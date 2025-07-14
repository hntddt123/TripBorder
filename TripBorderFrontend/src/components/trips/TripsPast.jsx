import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { authAPI } from '../../api/authAPI';
import {
  useGetTripsByEmailPaginationQuery,
  useDeleteTripsMutation
} from '../../api/tripsAPI';
import {
  setTripUUID,
  setTitle,
  setOwnerEmail,
  setStartDate,
  setEndDate
} from '../../redux/reducers/tripReducer';
import { getLocalTime, getLocalTimeToSecond, getDate } from '../../utility/time';
import CustomButton from '../CustomButton';
import CustomToggle from '../CustomToggle';
import Meals from './Meals';
import Hotels from './Hotels';
import POIs from './POIs';
import Transports from './Transports';
import Ratings from './Ratings';
import TripTags from './TripTags';
import CustomError from '../CustomError';

function TripsPast() {
  const user = useSelector(authAPI.endpoints.checkAuthStatus.select());
  const email = user.data?.email;
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);

  const limit = 3;
  const { data, isLoading, isFetching, error } = useGetTripsByEmailPaginationQuery({ email, page, limit });
  const { trips, total, totalPages, page: currentPage } = data || {};

  const [deleteTrip] = useDeleteTripsMutation();

  const handleEditButton = () => {
    setIsEditing(!isEditing);
  };

  const handleLoad = (trip) => {
    dispatch(setTripUUID(trip.uuid));
    dispatch(setTitle(trip.title));
    dispatch(setOwnerEmail(trip.onwer_email));
    if (trip.start_date) {
      dispatch(setStartDate(getDate(trip.start_date)));
    }
    if (trip.end_date) {
      dispatch(setEndDate(getDate(trip.end_date)));
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <CustomError error={error} />;
  }

  const renderDetail = (trip) => (
    <div>
      <div>{`Start: ${getLocalTime(trip.start_date)}`}</div>
      <div>{`End: ${getLocalTime(trip.end_date)}`}</div>
      <div>{`Created: ${getLocalTimeToSecond(trip.created_at)}`}</div>
      <div>{`Updated: ${getLocalTimeToSecond(trip.updated_at)}`}</div>
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
      <CustomButton className='editButton' label='✏️' onClick={handleEditButton} />
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
            <div className='text-center'>
              <CustomButton label='Load' onClick={() => handleLoad(trip)} />
            </div>
            <div className='text-center'>
              {(isEditing) ? <CustomButton label='Delete 🗑️' onClick={() => deleteTrip(trip.uuid)} /> : null}
            </div>
          </div>
        </div>
      )))}
    </div>
  );
}

export default TripsPast;
