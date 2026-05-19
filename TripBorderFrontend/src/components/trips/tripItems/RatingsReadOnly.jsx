import PropTypes from 'prop-types';
import {
  useGetRatingsByTripIDQuery,
} from '../../../api/ratingsAPI';
import CustomError from '../../CustomError';
import CustomLoading from '../../CustomLoading';
import CustomFetching from '../../CustomFetching';

export default function RatingsReadOnly({ tripID }) {
  const { data, isLoading, isFetching, error } = useGetRatingsByTripIDQuery({ tripID });
  const { ratings } = data || {};

  const renderDetail = (rating) => (
    <div className='text-xl text-pretty'>
      <div>{`★${rating.score}`}</div>
      <div className='flex justify-center'>
        <div className='customInput max-w-3/4 mx-4 wrap-break-word overflow-scroll'>
          {rating.comment}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className='flex text-lg justify-center text-center'>
        {ratings?.length > 0 ? <div>Ratings</div> : null}
      </div>
      {ratings?.map(((rating) => (
        <div key={rating.uuid}>
          <div className='text-pretty'>
            {renderDetail(rating)}
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
