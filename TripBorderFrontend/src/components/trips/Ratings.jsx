import PropTypes from 'prop-types';
import { useGetRatingsByTripIDQuery } from '../../api/ratingsAPI';
import { getLocalTime } from '../../utility/time';
import CustomToggle from '../CustomToggle';
import CustomError from '../CustomError';

function Ratings({ tripID }) {
  const { data, isLoading, isFetching, error } = useGetRatingsByTripIDQuery({ tripID });
  const { ratings } = data || {};

  const renderDetail = (rating) => (
    <div className='text-pretty'>
      <div>{`${rating.comment}`}</div>
      <div>{`score: ${rating.score}`}</div>
      <div>{`created_at: ${getLocalTime(rating.created_at)}`}</div>
      <div>{`updated_at: ${getLocalTime(rating.updated_at)}`}</div>
    </div>
  );

  const renderRatingsItem = (rating) => (
    <div className='flex justify-center'>
      <CustomToggle
        className='toggle min-h-12 min-w-72 max-w-72 overflow-x-auto -tracking-wider text-center'
        aria-label={`Rating Button ${rating.uuid}`}
        id={rating.uuid}
        title={`${rating.entity_type} rating`}
        component={renderDetail(rating)}
      />
    </div>
  );

  return (
    <div className='overflow-x-auto table-fixed whitespace-nowrap'>
      {ratings?.map(((rating) => (
        <div key={rating.uuid}>
          <div>
            {renderRatingsItem(rating)}
          </div>
        </div>
      )))}
      {(isLoading) ? <div>Loading Ratings...</div> : null}
      {isFetching && <div>Fetching new page...</div>}
      {(error) ? <CustomError error={error} /> : null}
    </div>
  );
}

Ratings.propTypes = {
  tripID: PropTypes.string,
};

export default Ratings;
