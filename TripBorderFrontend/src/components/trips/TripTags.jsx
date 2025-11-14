import { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  useGetTripTagsByTripIDQuery,
  useDeleteTripTagsMutation
} from '../../api/tripTagsAPI';
import CustomError from '../CustomError';
import CustomButton from '../CustomButton';
import CustomLoading from '../CustomLoading';
import CustomFetching from '../CustomFetching';

export default function TripTags({ tripID }) {
  const [isEditing, setIsEditing] = useState(false);
  const isLoadTrip = useSelector((state) => state.userSettingsReducer.isLoadTrip);

  const { data, isLoading, isFetching, error } = useGetTripTagsByTripIDQuery({ tripID });
  const { tripTags } = data || {};
  const [deleteTripTags] = useDeleteTripTagsMutation();

  const handleDeleteButton = (triptagID) => () => {
    deleteTripTags(triptagID);
  };

  const handleEditButton = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div>
      <div>
        <div className='text-lg text-center'>
          {tripTags?.length > 0 ? <span>Trip Tags</span> : null}
          {((tripTags?.length > 0) && !isLoadTrip)
            ? (
              <CustomButton
                translate='no'
                className='buttonEdit'
                label='✏️'
                onClick={handleEditButton}
              />
            ) : null}
        </div>
        <div className='flex flex-wrap justify-center'>
          {tripTags?.map((tag) => (
            <div key={tag.uuid} className='text-pretty'>
              <div className='toggle min-h-6 max-w-72 overflow-x-auto text-center px-4 mb-1'>
                {tag.name}
              </div>
              {(isEditing)
                ? (
                  <CustomButton
                    className='buttonDelete'
                    translate='no'
                    label='🗑️'
                    onClick={handleDeleteButton(tag.uuid)}
                  />
                )
                : null}
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

TripTags.propTypes = {
  tripID: PropTypes.string,
};
