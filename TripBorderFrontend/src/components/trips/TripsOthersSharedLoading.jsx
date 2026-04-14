import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { useCheckAuthStatusQuery } from '../../api/authAPI';
import {
  useGetOthersSharedTripsPaginationQuery
} from '../../api/tripsAPI';
import {
  setTripUUID,
  setTitle,
  setStartDate,
  setEndDate,
  setSharedMode
} from '../../redux/reducers/tripReducer';
import {
  setIsLoadTripOthersShared
} from '../../redux/reducers/userSettingsReducer';
import {
  formatDatecccMMMdyyyy,
  formatDateMMMMddyyyyHHmmssZZZZ
} from '../../utility/time';
import CustomButton from '../CustomButton';
import CustomToggle from '../CustomToggle';
import MealsReadOnly from './tripItems/MealsReadOnly';
import HotelsReadOnly from './tripItems/HotelsReadOnly';
import POIsReadOnly from './tripItems/POIsReadOnly';
import TransportsReadOnly from './tripItems/TransportsReadOnly';
import RatingsReadOnly from './tripItems/RatingsReadOnly';
import TripTagsReadOnly from './tripItems/TripTagsReadOnly';
import CustomError from '../CustomError';
import CustomFetching from '../CustomFetching';
import CustomLoading from '../CustomLoading';

export default function TripsOthersSharedLoading({ handleFlyTo }) {
  const { data: user } = useCheckAuthStatusQuery(undefined, { refetchOnFocus: true, refetchOnReconnect: true });
  const email = user?.email;

  const {
    isLoadTripOthersShared
  } = useSelector((state) => state.userSettingsReducer);
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);

  const limit = 3;
  const { data, isLoading, isFetching, error } = useGetOthersSharedTripsPaginationQuery({ email: email, page, limit });
  const { trips, total, totalPages, page: currentPage } = data || {};

  const handleBackButton = () => {
    dispatch(setIsLoadTripOthersShared(false));
  };

  const handleLoad = (trip) => {
    dispatch(setTripUUID(trip.uuid));
    dispatch(setTitle(trip.title));
    dispatch(setStartDate(trip.start_date));
    dispatch(setEndDate(trip.end_date));
    dispatch(setSharedMode(trip.shared_mode));
    dispatch(setIsLoadTripOthersShared(true));
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
      <MealsReadOnly tripID={trip.uuid} handleFlyTo={handleFlyTo} />
      <HotelsReadOnly tripID={trip.uuid} handleFlyTo={handleFlyTo} />
      <POIsReadOnly tripID={trip.uuid} handleFlyTo={handleFlyTo} />
      <TransportsReadOnly tripID={trip.uuid} handleFlyTo={handleFlyTo} />
      <RatingsReadOnly tripID={trip.uuid} />
      <TripTagsReadOnly tripID={trip.uuid} />
    </div>
  );

  const renderTripsItem = (trip) => (
    <div className='flex justify-center'>
      <CustomToggle
        className='toggle toggleTrip'
        aria-label={`Trip Button ${trip.uuid}`}
        id={trip.uuid}
        titleOn={`${trip.title} ▼`}
        titleOff={`${trip.title}`}
        component={renderDetail(trip)}
      />
    </div>
  );

  return (
    <div className='overflow-x-auto table-fixed whitespace-nowrap'>
      <div className='text-base text-center'>
        <div className='flex justify-between'>
          {(isLoadTripOthersShared)
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
          {(total) ? ` (Total: ${total} Trips)` : null}
        </span>
      </div>
      <CustomFetching isFetching={isFetching} text='Fetching new page' />
      {trips?.map(((trip) => (
        <div key={trip.uuid}>
          <div className='cardBorderT text-center'>
            {(isLoadTripOthersShared)
              ? <CustomButton className='button max-h-12' label='Load' onClick={() => handleLoad(trip)} />
              : null}
            {renderTripsItem(trip)}
          </div>
        </div>
      )))}
      <CustomLoading isLoading={isLoading} />
      <CustomError error={error} />
    </div>
  );
}

TripsOthersSharedLoading.propTypes = {
  handleFlyTo: PropTypes.func
};
