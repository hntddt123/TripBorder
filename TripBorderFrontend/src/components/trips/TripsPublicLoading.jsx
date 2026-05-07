import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  useGetTripsPublicPaginationQuery
} from '../../api/tripsAPI';
import {
  setTripUUID,
  setTitle,
  setStartDate,
  setEndDate,
  setSharedMode,
  setIsLoadTripPublic
} from '../../redux/reducers/tripReducer';
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
import { useGetPublicTripTagsAllInfiniteQuery } from '../../api/tripTagsAPI';

export default function TripsPulbicLoading({ handleFlyTo }) {
  const { isLoadTripPublic } = useSelector((state) => state.tripReducer);
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [tripTags, setAllTripTags] = useState([]);
  const [tripTagsPage, setTripTagsPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [tagName, setTagName] = useState('');

  const limit = 3;
  const tripTagslimit = 3;
  const { data, isLoading, isFetching, error } = useGetTripsPublicPaginationQuery({ page, limit, tagName });

  const {
    data: publicTripTagsData,
    isFetching: isTripTagsFetching,
    error: tripTagsError
  } = useGetPublicTripTagsAllInfiniteQuery({ page: tripTagsPage, limit: tripTagslimit });
  const { trips, total, totalPages, page: currentPage } = data || {};

  const observer = useRef();
  const sentinelRef = useRef(null);

  useEffect(() => {
    // Don't set up observer if we're already loading or have no more
    if (!sentinelRef.current || isTripTagsFetching || !hasMore) {
      if (observer.current) {
        observer.current.disconnect();
        observer.current = null;
      }
      return;
    }
    observer.current = new IntersectionObserver(
      (entries) => {
        // Use refs inside callback → always fresh values, no stale closure
        if (entries[0].isIntersecting && hasMore) {
          setTripTagsPage((prev) => prev + 1);
        }
      },
      {
        threshold: 0.8,
        rootMargin: '0px 120px 0px 0px', // horizontal scroll friendly
      }
    );
    observer.current.observe(sentinelRef.current);
  }, [isTripTagsFetching, hasMore]); // re-run only when these actually change

  useEffect(() => {
    if (publicTripTagsData?.tripTags) {
      setAllTripTags((prev) => {
        const existingIds = new Set(prev.map((t) => t.uuid));
        const freshTags = publicTripTagsData.tripTags.filter((triptag) => !existingIds.has(triptag.uuid));
        return [...prev, ...freshTags];
      });

      setHasMore(publicTripTagsData.hasMore !== false);
    }
  }, [publicTripTagsData]);

  // Cleanup observer when component unmounts
  useEffect(() => () => {
    if (observer.current) observer.current.disconnect();
    setTagName('');
  }, []);

  const handleTagButton = (tag) => () => {
    setTagName(tag.name);
  };

  const handleBackButton = () => {
    dispatch(setIsLoadTripPublic(false));
  };

  const handleLoad = (trip) => {
    dispatch(setTripUUID(trip.uuid));
    dispatch(setTitle(trip.title));
    dispatch(setStartDate(trip.start_date));
    dispatch(setEndDate(trip.end_date));
    dispatch(setSharedMode(trip.shared_mode));
    dispatch(setIsLoadTripPublic(true));
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
          {(isLoadTripPublic)
            ? (
              <CustomButton
                className='buttonBack'
                label='←Trip Selection'
                onClick={handleBackButton}
              />
            )
            : <div />}
        </div>
        <div className='text-center'>
          <span>
            Showing {tripTags.length} of {publicTripTagsData?.total || 0} tags
          </span>
        </div>
        <div className='overflow-x-auto'>
          {tripTags?.map((tag) => (
            <button
              key={tag.uuid}
              className='button'
              onClick={handleTagButton(tag)}
            >
              {tag.name}
            </button>
          ))}
          {hasMore && (
            <button
              className='button'
              ref={sentinelRef}
              disabled={isTripTagsFetching}
            >
              {isTripTagsFetching ? (
                'Loading'
              ) : (
                'Load more tags →'
              )}
              <CustomError error={tripTagsError} />
            </button>
          )}
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
          <div className='text-lg'>
            {tagName ? `Filter: ${tagName}` : null}
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
            {(isLoadTripPublic)
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

TripsPulbicLoading.propTypes = {
  handleFlyTo: PropTypes.func
};
