import PropTypes from 'prop-types';
import { useGetPOIsByTripIDQuery } from '../../api/poisAPI';
import CustomToggle from '../CustomToggle';
import CustomError from '../CustomError';

function POIs({ tripID }) {
  const { data, isLoading, isFetching, error } = useGetPOIsByTripIDQuery({ tripID });
  const { points_of_interest: pois } = data || {};

  const renderDetail = (poi) => (
    <div className='text-pretty'>
      <div>{`Address: ${poi.address}`}</div>
    </div>
  );

  const renderPOIsItem = (poi) => (
    <div className='flex justify-center'>
      <CustomToggle
        className='container overflow-x-auto -tracking-wider text-center'
        aria-label={`Poi Button ${poi.uuid}`}
        id={poi.uuid}
        title={poi.name}
        component={renderDetail(poi)}
      />
    </div>
  );

  return (
    <div className='overflow-x-auto table-fixed whitespace-nowrap'>
      {pois?.map(((poi) => (
        <div key={poi.uuid}>
          <div>
            {renderPOIsItem(poi)}
          </div>
        </div>
      )))}
      {(isLoading) ? <div>Loading POIs...</div> : null}
      {isFetching && <div>Fetching new page...</div>}
      {(error) ? <CustomError error={error} /> : null}
    </div>
  );
}

POIs.propTypes = {
  tripID: PropTypes.string,
};

export default POIs;
