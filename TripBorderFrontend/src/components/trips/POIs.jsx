import { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useGetPOIsByTripIDQuery, useDeletePOIMutation } from '../../api/poisAPI';
import CustomToggle from '../CustomToggle';
import CustomError from '../CustomError';
import CustomButton from '../CustomButton';

function POIs({ tripID }) {
  const [isEditing, setIsEditing] = useState(false);
  const isLoadTrip = useSelector((state) => state.userSettingsReducer.isLoadTrip);
  const { data, isLoading, isFetching, error } = useGetPOIsByTripIDQuery({ tripID });
  const { points_of_interest: pois } = data || {};
  const [deletePOI] = useDeletePOIMutation();

  const handleEditButton = () => {
    setIsEditing(!isEditing);
  };

  const renderDetail = (poi) => (
    <div className='text-pretty'>
      <div className='underline underline-offset-2'>Address</div>
      <div className='px-2 font-mono'>{poi.address}</div>
      <div className='underline underline-offset-2'>Visit Time</div>
      <div className='px-2 font-mono'>{poi.visit_time ? poi.visit_time : 'Time not set'}</div>
    </div>
  );

  return (
    <div>
      <div className='text-lg text-center'>
        {pois?.length > 0 ? <span>Tour Spots</span> : null}
        {pois?.length > 0 && !isLoadTrip
          ? (
            <CustomButton
              translate='no'
              className='buttonEdit'
              label='✏️'
              onClick={handleEditButton}
            />
          ) : null}
      </div>
      {pois?.map(((poi) => (
        <div key={poi.uuid}>
          <div className='text-pretty px-2'>
            <CustomToggle
              translate='no'
              className='toggle min-h-12 min-w-72 max-w-72 overflow-x-auto text-center px-4 mb-1'
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
                  className='buttonDelete'
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
