import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  setSelectedPOIIDNumber,
  setSelectedPOIIcon,
  setIsShowingAdditionalPopUp,
  setIsShowingOnlySelectedPOI
} from '../../redux/reducers/mapReducer';
import {
  poiCategories
} from '../../constants/constants';

export default function ButtonPOISelection({ isFetching }) {
  const {
    longPressedLonLat,
    gpsLonLat,
    isUsingGPSLonLat,
  } = useSelector((state) => state.mapReducer);

  const dispatch = useDispatch();

  const handleDropdownOnChange = (event) => {
    const selectedID = event.target.value;
    const selectedCategory = poiCategories.find((category) => category.id === selectedID);
    dispatch(setSelectedPOIIDNumber(selectedID));
    dispatch(setSelectedPOIIcon(selectedCategory.icon));
    dispatch(setIsShowingAdditionalPopUp(false));
    dispatch(setIsShowingOnlySelectedPOI(false));

    if (longPressedLonLat.longitude !== null
      && longPressedLonLat.latitude !== null && !isUsingGPSLonLat) {
      // getNearbyPOIQueryTrigger({
      //   ll: `${longPressedLonLat.latitude},${longPressedLonLat.longitude}`,
      //   radius: selectedPOIRadius,
      //   limit: selectedPOICount,
      //   category: selectedID,
      //   icon: selectedCategory.icon,
      //   sessionToken: sessionIDFSQ
      // }, true);
    } else if (gpsLonLat.longitude !== null
      && gpsLonLat.latitude !== null) {
      // getNearbyPOIQueryTrigger({
      //   ll: `${gpsLonLat.latitude},${gpsLonLat.longitude}`,
      //   radius: selectedPOIRadius,
      //   limit: selectedPOICount,
      //   category: selectedID,
      //   icon: selectedCategory.icon,
      //   sessionToken: sessionIDFSQ
      // }, true);
    }
  };

  return (
    <select
      aria-label='poiSelection'
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
  isFetching: PropTypes.bool,
};
