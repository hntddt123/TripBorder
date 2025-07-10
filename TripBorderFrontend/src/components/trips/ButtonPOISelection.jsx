import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  setSelectedPOIIDNumber,
  setSelectedPOIIcon
} from '../../redux/reducers/mapReducer';
import {
  iconMap,
  restaurantIcon,
  museumIcon,
  hotelIcon,
  carIcon,
  shoppingIcon
} from '../../constants/constants';

function ButtonPOISelection({ reset, isFetching }) {
  const dispatch = useDispatch();

  const handleDropdownOnChange = (event) => {
    dispatch(setSelectedPOIIDNumber(event.target.value));
    dispatch(setSelectedPOIIcon(iconMap[event.target.value]));
    reset();
  };

  return (
    <select
      className='poiDropdownButton'
      onChange={(event) => handleDropdownOnChange(event)}
      disabled={isFetching}
    >
      <option value='4d4b7105d754a06374d81259'> {restaurantIcon}</option>
      <option value='4bf58dd8d48988d181941735'> {museumIcon}</option>
      <option value='4bf58dd8d48988d1fa931735'> {hotelIcon}</option>
      <option value='4d4b7105d754a06379d81259'> {carIcon}</option>
      <option value='4bf58dd8d48988d1fd941735'> {shoppingIcon}</option>
    </select>
  );
}

ButtonPOISelection.propTypes = {
  reset: PropTypes.func,
  isFetching: PropTypes.bool,
};

export default ButtonPOISelection;
