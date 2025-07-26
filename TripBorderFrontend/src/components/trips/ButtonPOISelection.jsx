import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  setSelectedPOIIDNumber,
  setSelectedPOIIcon
} from '../../redux/reducers/mapReducer';
import {
  poiCategories
} from '../../constants/constants';

function ButtonPOISelection({ reset, isFetching }) {
  const dispatch = useDispatch();

  const handleDropdownOnChange = (event) => {
    const selectedID = event.target.value;
    const selectedCategory = poiCategories.find((category) => category.id === selectedID);
    dispatch(setSelectedPOIIDNumber(selectedID));
    dispatch(setSelectedPOIIcon(selectedCategory.icon));
    reset();
  };

  return (
    <select
      translate='no'
      id='poiSelection'
      className='buttonPOIDropdown'
      onChange={handleDropdownOnChange}
      disabled={isFetching}
    >
      {poiCategories.map((category) => (
        <option
          key={category.id}
          value={category.id}
        >
          {category.icon}
        </option>
      ))}
    </select>
  );
}

ButtonPOISelection.propTypes = {
  reset: PropTypes.func,
  isFetching: PropTypes.bool,
};

export default ButtonPOISelection;
