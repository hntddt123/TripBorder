import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  setSelectedPOIIDNumber,
  setSelectedPOIIcon,
  setIsShowingAddtionalPopUp
} from '../../redux/reducers/mapReducer';
import {
  poiCategories
} from '../../constants/constants';

function ButtonPOISelection({ getNearbyPOIQueryTrigger, isFetching }) {
  const selectedPOICount = useSelector((state) => state.mapReducer.selectedPOICount);
  const selectedPOIRadius = useSelector((state) => state.mapReducer.selectedPOIRadius);
  const longPressedLonLat = useSelector((state) => state.mapReducer.longPressedLonLat);
  const gpsLonLat = useSelector((state) => state.mapReducer.gpsLonLat);
  const isUsingGPSLonLat = useSelector((state) => state.mapReducer.isUsingGPSLonLat);

  const dispatch = useDispatch();

  const handleDropdownOnChange = (event) => {
    const selectedID = event.target.value;
    const selectedCategory = poiCategories.find((category) => category.id === selectedID);
    dispatch(setSelectedPOIIDNumber(selectedID));
    dispatch(setSelectedPOIIcon(selectedCategory.icon));
    dispatch(setIsShowingAddtionalPopUp(false));

    if (longPressedLonLat.longitude !== null
      && longPressedLonLat.latitude !== null && !isUsingGPSLonLat) {
      getNearbyPOIQueryTrigger({
        ll: `${longPressedLonLat.latitude},${longPressedLonLat.longitude}`,
        radius: selectedPOIRadius,
        limit: selectedPOICount,
        category: selectedID,
        icon: selectedCategory.icon
      }, true);
    } else if (gpsLonLat.longitude !== null
      && gpsLonLat.latitude !== null) {
      getNearbyPOIQueryTrigger({
        ll: `${gpsLonLat.latitude},${gpsLonLat.longitude}`,
        radius: selectedPOIRadius,
        limit: selectedPOICount,
        category: selectedID,
        icon: selectedCategory.icon
      }, true);
    }
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
  getNearbyPOIQueryTrigger: PropTypes.func,
  isFetching: PropTypes.bool,
};

export default ButtonPOISelection;
