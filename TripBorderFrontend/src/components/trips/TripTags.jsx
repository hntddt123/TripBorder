import PropTypes from 'prop-types';
import { useGetTripTagsByTripIDQuery } from '../../api/tripTagsAPI';
import CustomToggle from '../CustomToggle';

function TripTags({ tripID }) {
  const { data, isLoading, isFetching, error } = useGetTripTagsByTripIDQuery({ tripID });
  const { tripTags } = data || {};

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{`Status: ${error.status} - ${error.error}`}</div>;
  }

  const renderDetail = () => (
    tripTags?.map((tag) => (
      <div key={tag.uuid} className='flex justify-center'>
        {tag.name}
      </div>
    ))
  );

  return (
    <div className='overflow-x-auto table-fixed whitespace-nowrap'>
      {isFetching && <div>Fetching new page...</div>}
      <CustomToggle
        className='container overflow-x-auto -tracking-wider text-center'
        aria-label='TripTag Button'
        title='Tags'
        component={renderDetail()}
      />
    </div>
  );
}

TripTags.propTypes = {
  tripID: PropTypes.string,
};

export default TripTags;
