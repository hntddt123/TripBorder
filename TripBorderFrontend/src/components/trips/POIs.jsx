import { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useGetPOIsByTripIDQuery, useDeletePOIMutation } from '../../api/poisAPI';
import CustomToggle from '../CustomToggle';
import CustomError from '../CustomError';
import CustomButton from '../CustomButton';

function POIs({ tripID }) {
  const [isEditing, setIsEditing] = useState(false);
  const tripData = useSelector((state) => state.tripReducer);
  const { data, isLoading, isFetching, error } = useGetPOIsByTripIDQuery({ tripID });
  const { points_of_interest: pois } = data || {};
  const [deletePOI] = useDeletePOIMutation();

  const handleEditButton = () => {
    setIsEditing(!isEditing);
  };

  const renderDetail = (poi) => (
    <div className='text-pretty'>
      <div>{`Address: ${poi.address}`}</div>
    </div>
  );

  return (
    <div>
      <div className='text-xl text-center'>
        <div>
          {pois?.length > 0 ? <span>Tour Spots</span> : null}
          {pois?.length > 0 && !tripData.isLoadTrip
            ? (
              <CustomButton
                translate='no'
                className='editButton'
                label='✏️'
                onClick={handleEditButton}
              />
            ) : null}
        </div>
      </div>
      {pois?.map(((poi) => (
        <div key={poi.uuid}>
          <div className='text-pretty px-2'>
            <CustomToggle
              className='toggle container overflow-x-auto -tracking-wider text-left px-2 mb-1'
              aria-label={`Poi Button ${poi.uuid}`}
              id={poi.uuid}
              title={poi.name}
              component={renderDetail(poi)}
            />
          </div>
          <div>
            {(isEditing)
              ? (
                <CustomButton
                  className='tripButton'
                  translate='no'
                  label={`🗑️ ${poi.name}`}
                  onClick={() => deletePOI(poi.uuid)}
                />
              )
              : null}
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
