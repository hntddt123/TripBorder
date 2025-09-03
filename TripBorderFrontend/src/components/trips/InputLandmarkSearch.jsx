import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLazyGetLandmarkFromKeywordQuery } from '../../api/openstreemapSliceAPI';
import CustomError from '../CustomError';
import CustomLoading from '../CustomLoading';
import CustomFetching from '../CustomFetching';

export default function InputLandmarkSearch({ handleFlyTo }) {
  const [getLandmarkFromKeywordQueryTrigger, { data, isLoading, isFetching, error }] = useLazyGetLandmarkFromKeywordQuery();
  const [keyword, setKeyword] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (data) {
      handleFlyTo(data.lon, data.lat, 15.5, 1500);
    }
  }, [data, isFetching]);

  const handleInputChange = (e) => {
    setKeyword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    inputRef.current.blur();
    getLandmarkFromKeywordQueryTrigger(keyword);
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
      <CustomLoading isLoading={isLoading} />
      <CustomFetching isFetching={isFetching} />
      <CustomError error={error} />
    </div>
  );
}

InputLandmarkSearch.propTypes = {
  handleFlyTo: PropTypes.func
};
