import PropTypes from 'prop-types';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { authAPI } from '../../api/authAPI';
import {
  usePostTagByEmailMutation,
  useGetTagsByEmailPaginationQuery,
  useDeleteTagMutation
} from '../../api/tagsAPI';
import {
  usePostTripTagsByTripIDAndTagIDMutation
} from '../../api/tripTagsAPI';

import CustomError from '../CustomError';
import CustomButton from '../CustomButton';
import CustomToggle from '../CustomToggle';

function Tags({ tripID }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tagName, setTagName] = useState('');
  const [page, setPage] = useState(1);
  const limit = 4;

  const isLoadTrip = useSelector((state) => state.userSettingsReducer.isLoadTrip);
  const user = useSelector(authAPI.endpoints.checkAuthStatus.select());
  const email = user.data?.email;
  const { data, isLoading, isFetching, error } = useGetTagsByEmailPaginationQuery({ email, page, limit });
  const { tags, total, totalPages, page: currentPage } = data || {};

  const [postTripTag, postTripTagResult] = usePostTripTagsByTripIDAndTagIDMutation();
  const [postTag] = usePostTagByEmailMutation();
  const [deleteTag] = useDeleteTagMutation();

  const handleEditButton = () => {
    setIsEditing(!isEditing);
  };

  const handleDeleteTagButton = (tagID) => () => {
    deleteTag(tagID);
  };

  const handleButtonTag = (tag) => () => {
    const newTripTag = {
      trips_uuid: tripID,
      tags_uuid: tag.uuid
    };
    postTripTag(newTripTag);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTag = {
      name: tagName,
      owner_email: email
    };
    postTag(newTag);
    setTagName('');
  };

  const handleTagNameChange = (e) => {
    const { value } = e.target;
    setTagName(value);
  };

  const renderDetail = () => (
    <div>
      <div className='text-lg text-center'>
        {tags?.length > 0 ? <span>Customize Tags</span> : null}
        {((tags?.length > 0) && !isLoadTrip)
          ? (
            <CustomButton
              translate='no'
              className='buttonEdit'
              label='✏️'
              onClick={handleEditButton}
            />
          ) : null}
      </div>
      <div>
        <CustomButton
          label='Previous'
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1 || isFetching}
        />
        <CustomButton
          label='Next'
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages || isFetching || totalPages === 0}
        />
      </div>
      <div>
        {`Page ${currentPage} of ${totalPages} `}
        (Total: {total} Tags)
      </div>
      <div>
        Add tag to trip by clicking the customized tag
      </div>
      <div className='flex flex-wrap justify-center'>
        {tags?.map(((tag) => (
          <div key={tag.uuid}>
            <div>
              <CustomButton
                className='button min-h-6 max-w-72 overflow-x-auto text-center px-4 mb-1'
                label={tag.name}
                onClick={handleButtonTag(tag)}
              />
            </div>
            {(isEditing)
              ? (
                <CustomButton
                  className='buttonTrip'
                  translate='no'
                  label={`🗑️ ${tag.name}`}
                  onClick={handleDeleteTagButton(tag.uuid)}
                />
              )
              : null}
          </div>
        )))}
      </div>
      <form onSubmit={handleSubmit} encType='multipart/form-data'>
        <div>
          <label htmlFor='add_tag'>
            Add Tag
          </label>
        </div>
        <div>
          <input
            className='customInput'
            id='add_tag'
            type='text'
            name='add_tag'
            value={tagName}
            placeholder='Tag Name'
            onChange={handleTagNameChange}
            minLength={1}
            maxLength={50}
            required
          />
        </div>
        <div>
          <CustomButton type='submit' label='Add' />
        </div>
      </form>
    </div>
  );

  return (
    <div>
      <div>
        <CustomToggle
          className='toggle min-h-12 min-w-72 max-w-72 overflow-x-auto text-center px-4 mb-1'
          aria-label='Tags Button'
          title='Tags'
          component={renderDetail()}
        />
      </div>
      {(isLoading) ? <div>Loading Trip Tags...</div> : null}
      {isFetching && <div>Fetching new page...</div>}
      {(error) ? <CustomError error={error} /> : null}
      {(postTripTagResult.error) ? <CustomError error={postTripTagResult.error} /> : null}
    </div>
  );
}

Tags.propTypes = {
  tripID: PropTypes.string,
};

export default Tags;
