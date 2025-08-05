import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
import { errorPropTypes } from '../../constants/errorPropTypes';
import CustomError from '../CustomError';

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
      {(getLandmarkFromKeywordResult.isLoading)
        ? <div>Loading Hotels...</div>
        : null}
      {getLandmarkFromKeywordResult.isFetching && <div>Fetching new page...</div>}
      {(getLandmarkFromKeywordResult.error)
        ? <CustomError error={getLandmarkFromKeywordResult.error} />
        : null}
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
