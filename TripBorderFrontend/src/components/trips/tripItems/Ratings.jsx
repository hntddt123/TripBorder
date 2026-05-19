import { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { authAPI } from '../../../api/authAPI';
import {
  useDeleteRatingMutation,
  useGetRatingsByTripIDQuery,
  usePostRatingByTripIDMutation,
  useUpdateRatingByUUIDMutation
} from '../../../api/ratingsAPI';
import CustomError from '../../CustomError';
import CustomButton from '../../CustomButton';
import CustomLoading from '../../CustomLoading';
import CustomFetching from '../../CustomFetching';

export default function Ratings({ tripID }) {
  const [star, setStar] = useState(0);
  const [comment, setComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { isLoadTrip } = useSelector((state) => state.tripReducer);

  const user = useSelector(authAPI.endpoints.checkAuthStatus.select());
  const email = user.data?.email;

  const { data, isLoading, isFetching, error } = useGetRatingsByTripIDQuery({ tripID });
  const { ratings } = data || {};

  const [postRating] = usePostRatingByTripIDMutation();
  const [updateRating] = useUpdateRatingByUUIDMutation();
  const [deleteRating] = useDeleteRatingMutation();

  const handleCommentSubmit = (rating) => (e) => {
    e.preventDefault();
    if (comment !== '') {
      updateRating({
        uuid: rating.uuid,
        updates: {
          comment: comment
        }
      });
    }
    setIsEditing(false);
  };

  const handleCommentChange = (e) => {
    const { value } = e.target;
    setComment(value);
  };

  const handleEditButton = () => {
    setIsEditing(!isEditing);
  };

  const handleDelete = (rating) => () => {
    setStar(0);
    deleteRating(rating.uuid);
    setIsEditing(!isEditing);
  };

  const handleStarClick = (value) => () => {
    setStar(value);
    const rating = {
      trips_uuid: tripID,
      entity_id: tripID,
      entity_type: 'Trips',
      comment: '',
      score: value,
      owner_email: email
    };
    postRating(rating);
  };

  const renderDetail = (rating) => (
    <div className='text-pretty text-xl justify-center text-center'>
      <div>{`★${rating.score}`}</div>
      <div className='flex justify-center'>
        {rating.comment === '' || isEditing
          ? (
            <form onSubmit={handleCommentSubmit(rating)} encType='multipart/form-data'>
              <div>
                <label htmlFor='rate_comment'>
                  Comment
                </label>
                <div>
                  <textarea
                    className='customInput p-4 mb-0 focus:bg-primary-button-dark'
                    id='rate_comment'
                    type='text'
                    name='rate_comment'
                    placeholder='Say something about this trip (max 255 characters)'
                    value={comment === '' ? rating.comment : comment}
                    onChange={handleCommentChange}
                    minLength={1}
                    maxLength={255}
                    rows={3}
                    required
                  />
                  <div>
                    Length: {comment.length}
                  </div>
                </div>
                <CustomButton type='submit' label='Submit' />
              </div>
            </form>
          )
          : (
            <div className='customInput max-w-3/4 p-4 mx-4 wrap-break-word overflow-scroll'>
              {rating.comment}
            </div>
          )}
      </div>
    </div>
  );

  const renderNewRating = () => (
    <div className='text-2xl'>
      <div className='flex justify-center'>
        {Array.from({ length: 10 }, (_, index) => {
          const starValue = index + 1;
          return (
            <CustomButton
              key={starValue}
              label={starValue <= star ? '★' : '☆'}
              className={starValue <= star ? 'active' : 'inactive'}
              onClick={handleStarClick(starValue)}
            />
          );
        })}
      </div>
    </div>
  );

  return (
    <div>
      <div className={`flex items-center justify-center text-lg ${isLoadTrip ? '' : 'ml-10'}`}>
        {ratings?.length > 0 && !isEditing ? <div>Ratings</div> : null}
        {(isEditing) ? <div>Edit Ratings</div> : null}
        {(ratings?.length > 0) && !isLoadTrip
          ? (
            <CustomButton
              translate='no'
              className='buttonEdit select-none'
              label='✏️'
              onClick={handleEditButton}
            />
          ) : null}
      </div>
      {ratings?.map(((rating) => (
        <div key={rating.uuid}>
          {(isEditing)
            ? (
              <CustomButton
                className='buttonDelete'
                translate='no'
                label='🗑️'
                onClick={handleDelete(rating)}
              />
            )
            : null}
          {renderDetail(rating)}
        </div>
      )))}
      {(ratings?.length > 0 || isLoadTrip)
        ? null
        : (
          <div className='justify-center'>
            <div>
              Rate this trip
            </div>
            {renderNewRating()}
          </div>
        )}

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

Ratings.propTypes = {
  tripID: PropTypes.string,
};
