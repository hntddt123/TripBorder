import PropTypes from 'prop-types';
import { useState, useRef } from 'react';

function InputLandmarkSearch({ getLandmarkFromKeywordQueryTrigger }) {
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
    <form
      className='landmarkSearchInput'
      onSubmit={handleSubmit}
    >
      <input
        ref={inputRef}
        className='customInput'
        id='landmark_keyword_search'
        type='text'
        name='landmark_keyword_search'
        value={keyword}
        onChange={handleInputChange}
        required
        placeholder='Search Place'
        minLength={1}
        maxLength={42}
        enterKeyHint='search'
      />
    </form>
  );
}

InputLandmarkSearch.propTypes = {
  getLandmarkFromKeywordQueryTrigger: PropTypes.func
};

export default InputLandmarkSearch;
