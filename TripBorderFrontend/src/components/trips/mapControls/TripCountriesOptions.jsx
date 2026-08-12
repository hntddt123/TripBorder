import { useDispatch, useSelector } from 'react-redux';
import { setSearchCountry } from '../../../redux/reducers/userSettingsReducer';
import { COUNTRIES_BOUNDING_BOX } from '../../../constants/constants';

export default function TripCountriesOptions() {
  const { searchCountry } = useSelector((state) => state.userSettingsReducer);
  const { searchKeyword } = useSelector((state) => state.mapReducer);
  const dispatch = useDispatch();

  const getSearchCountry = () => Object.entries(COUNTRIES_BOUNDING_BOX)
    .map(([code, country]) => (
      <option key={code} value={code}>
        {country.name} {country.emoji}
      </option>
    ));

  const handleSearchCountryChange = (e) => {
    dispatch(setSearchCountry(e.target.value));
  };

  return (
    <select
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
