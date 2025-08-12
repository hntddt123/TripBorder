import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
import { errorPropTypes } from '../../constants/errorPropTypes';
import CustomError from '../CustomError';
import CustomLoading from '../CustomLoading';
import CustomFetching from '../CustomFetching';

export default function InputLandmarkSearch({
  getLandmarkFromKeywordQueryTrigger,
  getLandmarkFromKeywordResult
}) {
  const [keyword, setKeyword] = useState('');
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    setKeyword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    inputRef.current.blur();
    getLandmarkFromKeywordQueryTrigger(keyword);
  };

  return (
    <div className='landmarkSearchInput'>
      <form
        onSubmit={handleSubmit}
      >
        <input
          ref={inputRef}
          className='customInputSearch'
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
      <CustomLoading isLoading={getLandmarkFromKeywordResult.isLoading} />
      <CustomFetching isFetching={getLandmarkFromKeywordResult.isFetching} />
      <CustomError error={getLandmarkFromKeywordResult.error} />
    </div>
  );
}

InputLandmarkSearch.propTypes = {
  getLandmarkFromKeywordQueryTrigger: PropTypes.func,
  getLandmarkFromKeywordResult: PropTypes.shape({
    isLoading: PropTypes.bool,
    isFetching: PropTypes.bool,
    error: errorPropTypes
  })
};
