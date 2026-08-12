import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchCountry } from '../../../redux/reducers/userSettingsReducer';
import { COUNTRIES_BOUNDING_BOX } from '../../../constants/constants';

export default function TripCountriesOptions() {
  const [isOnlyEmoji, setIsOnlyEmoji] = useState(false);
  const { searchCountry } = useSelector((state) => state.userSettingsReducer);
  const { searchKeyword } = useSelector((state) => state.mapReducer);
  const dispatch = useDispatch();
  const ref = useRef();

  const getSearchCountry = () => Object.entries(COUNTRIES_BOUNDING_BOX)
    .map(([code, country]) => (
      <option key={code} value={code}>
        {isOnlyEmoji ? `${country.emoji}` : `${country.name} ${country.emoji}`}
      </option>
    ));

  const handleSearchCountryChange = (e) => {
    dispatch(setSearchCountry(e.target.value));
    setIsOnlyEmoji(true);
    if (!isOnlyEmoji) ref.current.blur();
  };

  const handleFocus = () => {
    setIsOnlyEmoji(false);
  };

  const handleBlur = () => {
    setIsOnlyEmoji(true);
  };

  return (
    <select
      ref={ref}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className='clearButton select-none max-w-14 max-h-8 text-sm'
      id='language'
      name='language'
      value={searchCountry}
      onChange={handleSearchCountryChange}
      required
      hidden={searchKeyword !== ''}
    >
      {getSearchCountry()}
    </select>
  );
}
