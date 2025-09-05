import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import CustomError from '../CustomError';
import CustomFetching from '../CustomFetching';
import { errorPropTypes } from '../../constants/errorPropTypes';

export default function InputLandmarkSearch({
  handleKeywordSearch, isFetching, error }) {
  const [keyword, setKeyword] = useState('');
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    setKeyword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    inputRef.current.blur();
    handleKeywordSearch(keyword.trim());
  };

  return (
    <div className='landmarkSearchContainer'>
      <form
        onSubmit={handleSubmit}
      >
        <input
          ref={inputRef}
          className='customInputLandmarkSearch'
          id='landmark_keyword_search'
          type='text'
          name='landmark_keyword_search'
          value={keyword}
          onChange={handleInputChange}
          required
          placeholder='Search'
          minLength={1}
          maxLength={42}
          enterKeyHint='search'
        />
      </form>
      <CustomFetching isFetching={isFetching} />
      <CustomError error={error} />
    </div>
  );
}

InputLandmarkSearch.propTypes = {
  handleKeywordSearch: PropTypes.func,
  isFetching: PropTypes.bool,
  error: errorPropTypes
};
