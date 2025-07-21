import { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { authAPI } from '../../api/authAPI';
import {
  useDeleteRatingMutation,
  useGetRatingsByTripIDQuery,
  usePostRatingByTripIDMutation,
  useUpdateRatingByUUIDMutation
} from '../../api/ratingsAPI';
import CustomToggle from '../CustomToggle';
import CustomError from '../CustomError';
import CustomButton from '../CustomButton';

function Ratings({ tripID }) {
  const [star, setStar] = useState(0);
  const [comment, setComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const tripData = useSelector((state) => state.tripReducer);

  const user = useSelector(authAPI.endpoints.checkAuthStatus.select());
  const email = user.data?.email;

  const { data, isLoading, isFetching, error } = useGetRatingsByTripIDQuery({ tripID });
  const { ratings } = data || {};

  const [postRating] = usePostRatingByTripIDMutation();
  const [updateRating] = useUpdateRatingByUUIDMutation();
  const [deleteRating] = useDeleteRatingMutation();

  const handleCommentSubmit = (rating) => () => {
    updateRating({
      uuid: rating.uuid,
      updates: {
        comment: comment
      }
    });
    setIsEditing(!isEditing);
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
  };

  const handleStarClick = (value) => () => {
    setStar(value);
    const rating = {
      trips_uuid: tripID,
      entity_id: tripID,
      entity_type: 'Trips',
      comment: 'No Comment',
      score: value,
      owner_email: email
    };
    postRating(rating);
  };

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
      {rating.comment === 'No Comment' || isEditing
        ? (
          <div>
            <label htmlFor='rate_comment'>
              Comment
            </label>
            <div>
              <input
                className='customInput'
                id='rate_comment'
                type='text'
                name='rate_comment'
                value={comment}
                onChange={handleCommentChange}
                required
              />
            </div>
            <CustomButton
              type='submit'
              label='Submit'
              onClick={handleCommentSubmit(rating)}
            />
          </div>
        )
        : <div>{`${rating.comment}`}</div>}
    </div>
  );

  const renderNewRating = () => (
    <div className='text-xl'>
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
      <div className='text-lg text-center'>
        {ratings?.length > 0 ? <span>Ratings</span> : null}
        {(ratings?.length > 0) && !tripData.isLoadTrip
          ? (
            <CustomButton
              translate='no'
              className='buttonEdit'
              label='✏️'
              onClick={handleEditButton}
            />
          ) : null}
      </div>
      {ratings?.map(((rating) => (
        <div key={rating.uuid}>
          <div className='text-pretty px-2'>
            <CustomToggle
              className='toggle min-h-12 min-w-72 max-w-72 overflow-x-auto -tracking-wider text-left px-4 mb-1'
              aria-label={`Rating Button ${rating.uuid}`}
              id={rating.uuid}
              title={`${rating.entity_type}`}
              component={renderDetail(rating)}
            />
          </div>
          {(isEditing)
            ? (
              <CustomButton
                className='buttonTrip'
                translate='no'
                label={`🗑️ This Rating of ${rating.score}`}
                onClick={handleDelete(rating)}
              />
            )
            : null}
        </div>
      )))}
      {(ratings?.length > 0)
        ? null
        : (
          <div className='flex justify-center'>
            <CustomToggle
              className='toggle min-h-12 min-w-72 max-w-72 overflow-x-auto -tracking-wider text-center'
              aria-label={`Rating Button ${tripID}`}
              id={tripID}
              title='Rate this Trip'
              component={renderNewRating()}
            />
          </div>
        )}

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
