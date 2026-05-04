import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import CustomError from '../../CustomError';
import { errorPropTypes } from '../../../constants/errorPropTypes';

export default function InputLandmarkSearch({
  handleKeywordSearch, error }) {
  const [keyword, setKeyword] = useState('');
  const inputRef = useRef(null);
  const { language } = useSelector((state) => state.userSettingsReducer);

  const handleInputChange = (e) => {
    setKeyword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    inputRef.current.blur();
    handleKeywordSearch({ keyword: keyword.trim(), language });
  };

  const handleClear = () => {
    setKeyword('');
    handleKeywordSearch({ keyword: '', language });
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
        <button
          type='button'
          className='clearButton select-none'
          onClick={handleClear}
          hidden={keyword === ''}
        >
          x
        </button>
      </form>
      <CustomError error={error} />
    </div>
  );
}

InputLandmarkSearch.propTypes = {
  handleKeywordSearch: PropTypes.func,
  error: errorPropTypes
};
