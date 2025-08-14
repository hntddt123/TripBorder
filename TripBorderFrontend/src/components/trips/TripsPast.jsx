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
import {
  setIsLoadTrip
} from '../../redux/reducers/userSettingsReducer';
import {
  formatDatecccMMMdyyyy,
  formatDateMMMMddyyyyHHmmssZZZZ
} from '../../utility/time';
import CustomButton from '../CustomButton';
import CustomToggle from '../CustomToggle';
import Meals from './Meals';
import Hotels from './Hotels';
import POIs from './POIs';
import Transports from './Transports';
import Ratings from './Ratings';
import TripTags from './TripTags';
import CustomError from '../CustomError';
import CustomFetching from '../CustomFetching';
import CustomLoading from '../CustomLoading';

export default function TripsPast() {
  const {
    isLoadTrip
  } = useSelector((state) => state.userSettingsReducer);
  const user = useSelector(authAPI.endpoints.checkAuthStatus.select());
  const email = user.data?.email;
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);

  const limit = 3;
  const { data, isLoading, isFetching, error } = useGetTripsByEmailPaginationQuery({ email, page, limit });
  const { trips, total, totalPages, page: currentPage } = data || {};

  const [deleteTrip] = useDeleteTripsMutation();

  const handleBackButton = () => {
    dispatch(setIsLoadTrip(false));
  };

  const handleEditButton = () => {
    setIsEditing(!isEditing);
  };

  const handleLoad = (trip) => {
    dispatch(setTripUUID(trip.uuid));
    dispatch(setTitle(trip.title));
    dispatch(setOwnerEmail(trip.onwer_email));
    if (trip.start_date) {
      dispatch(setStartDate(trip.start_date));
    }
    if (trip.end_date) {
      dispatch(setEndDate(trip.end_date));
    }
    dispatch(setIsLoadTrip(false));
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const renderDetail = (trip) => (
    <div className='text-pretty'>
      <div className='underline underline-offset-2'>Travel Date</div>
      {(formatDatecccMMMdyyyy(trip.start_date) === formatDatecccMMMdyyyy(trip.end_date))
        ? (
          <div className='px-2 font-mono'>
            {formatDatecccMMMdyyyy(trip.end_date)}
          </div>
        )
        : (
          <div className='px-2 font-mono'>
            {formatDatecccMMMdyyyy(trip.start_date)} - {formatDatecccMMMdyyyy(trip.end_date)}
          </div>
        )}
      <div>{`Created: ${formatDateMMMMddyyyyHHmmssZZZZ(trip.created_at)}`}</div>
      <div>{`Updated: ${formatDateMMMMddyyyyHHmmssZZZZ(trip.updated_at)}`}</div>
      <Meals tripID={trip.uuid} />
      <Hotels tripID={trip.uuid} />
      <POIs tripID={trip.uuid} />
      <Transports tripID={trip.uuid} />
      <Ratings tripID={trip.uuid} />
      <TripTags tripID={trip.uuid} />
    </div>
  );

  const renderTripsItem = (trip) => (
    <div className='flex justify-center'>
      <CustomToggle
        className='toggle min-h-12 min-w-72 max-w-72 overflow-x-auto text-center px-4 mb-1'
        aria-label={`Trip Button ${trip.uuid}`}
        id={trip.uuid}
        titleOn={`${trip.title} ▼`}
        titleOff={`${trip.title} ▶`}
        component={renderDetail(trip)}
      />
      {!isLoadTrip
        ? (
          <CustomButton
            translate='no'
            className='buttonEdit'
            label='✏️'
            onClick={handleEditButton}
          />
        ) : null}
    </div>
  );

  return (
    <div className='overflow-x-auto table-fixed whitespace-nowrap'>
      <div className='text-base text-center'>
        <div className='flex justify-between'>
          {(isLoadTrip)
            ? (
              <CustomButton
                className='buttonBack'
                label='←Trip Selection'
                onClick={handleBackButton}
              />
            )
            : <div />}
        </div>
        <div>
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
        </div>
        <span>
          {(currentPage && totalPages) ? `Page ${currentPage} of ${totalPages}` : null}
          {(total) ? `(Total: ${total} Trips)` : null}
        </span>
      </div>
      <CustomFetching isFetching={isFetching} text='Fetching new page' />
      {trips?.map(((trip) => (
        <div key={trip.uuid}>
          <div className='cardBorderT text-center'>
            {renderTripsItem(trip)}
            <div className='text-center'>
              {(isLoadTrip)
                ? <CustomButton label='Load' onClick={() => handleLoad(trip)} />
                : null}
            </div>
            <div className='text-center'>
              {(isEditing)
                ? <CustomButton translate='no' label='Delete 🗑️' onClick={() => deleteTrip(trip.uuid)} />
                : null}
            </div>
          </div>
        </div>
      )))}
      <CustomLoading isLoading={isLoading} />
      <CustomError error={error} />
    </div>
  );
}
