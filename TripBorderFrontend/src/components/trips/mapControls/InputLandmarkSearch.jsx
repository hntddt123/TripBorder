import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import TripCountriesOptions from './TripCountriesOptions';
import CustomError from '../../CustomError';
import { errorPropTypes } from '../../../constants/errorPropTypes';
import { setSearchKeyword } from '../../../redux/reducers/mapReducer';

export default function InputLandmarkSearch({ handleKeywordSearch, error }) {
  const { language } = useSelector((state) => state.userSettingsReducer);
  const { searchKeyword } = useSelector((state) => state.mapReducer);
  const dispatch = useDispatch();
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    dispatch(setSearchKeyword(e.target.value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    inputRef.current.blur();
    handleKeywordSearch({ keyword: searchKeyword.trim(), language });
  };

  const handleClear = () => {
    dispatch(setSearchKeyword(''));
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
          value={searchKeyword}
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
          hidden={searchKeyword === ''}
        >
          x
        </button>
        <TripCountriesOptions />
      </form>
      <div className='absolute'>
        <CustomError error={error} />
      </div>
    </div>
  );
}

InputLandmarkSearch.propTypes = {
  handleKeywordSearch: PropTypes.func,
  error: errorPropTypes
};
