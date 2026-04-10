import PropTypes from 'prop-types';
import {
  useGetRatingsByTripIDQuery,
} from '../../../api/ratingsAPI';
import CustomToggle from '../../CustomToggle';
import CustomError from '../../CustomError';
import CustomLoading from '../../CustomLoading';
import CustomFetching from '../../CustomFetching';

export default function RatingsReadOnly({ tripID }) {
  const { data, isLoading, isFetching, error } = useGetRatingsByTripIDQuery({ tripID });
  const { ratings } = data || {};

  const renderDetail = (rating) => (
    <div className='text-pretty'>
      <div>{`Score: ${rating.score}`}</div>
      {[...Array(10)].map((_, index) => (
        <span
          key={`${rating.uuid + index}`}
          className={(index < rating.score) ? 'active' : 'inactive'}
        >
          {(index < rating.score) ? '★' : '☆'}
        </span>
      ))}
    </div>
  );

  return (
    <div>
      <div className='text-lg text-center'>
        {ratings?.length > 0 ? <span>Ratings</span> : null}
      </div>
      {ratings?.map(((rating) => (
        <div key={rating.uuid}>
          <div className='text-pretty'>
            <CustomToggle
              className='toggle toggleTrip'
              aria-label={`Rating Button ${rating.uuid}`}
              id={rating.uuid}
              titleOn={`${rating.entity_type} ▼`}
              titleOff={`${rating.entity_type}`}
              component={renderDetail(rating)}
            />
          </div>
        </div>
      )))}
      <div>
        <CustomLoading isLoading={isLoading} text='Loading Ratings' />
      </div>
      <div>
        <CustomFetching isFetching={isFetching} text='Fetching new page' />
      </div>
      <div>
        <CustomError error={error} />
      </div>
    </div>
  );
}

RatingsReadOnly.propTypes = {
  tripID: PropTypes.string,
};
