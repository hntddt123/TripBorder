import PropTypes from 'prop-types';
import {
  useGetTripTagsByTripIDQuery
} from '../../../api/tripTagsAPI';
import CustomError from '../../CustomError';
import CustomLoading from '../../CustomLoading';
import CustomFetching from '../../CustomFetching';

export default function TripTagsReadOnly({ tripID }) {
  const { data, isLoading, isFetching, error } = useGetTripTagsByTripIDQuery({ tripID });
  const { tripTags } = data || {};

  return (
    <div>
      <div>
        <div className='text-lg text-center'>
          {tripTags?.length > 0 ? <span>Trip Tags</span> : null}
        </div>
        <div className='flex flex-wrap justify-center'>
          {tripTags?.map((tag) => (
            <div key={tag.uuid} className='text-pretty'>
              <div className='toggle min-h-6 max-w-72 overflow-x-auto text-center px-4 mb-1'>
                {tag.name}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <CustomLoading isLoading={isLoading} text='Loading Trip Tags' />
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

TripTagsReadOnly.propTypes = {
  tripID: PropTypes.string,
};
