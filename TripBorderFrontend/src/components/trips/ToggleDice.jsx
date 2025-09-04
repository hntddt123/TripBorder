import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Toggle from 'react-toggle';
import { diceIcon } from '../../constants/constants';
import {
  setIsShowingOnlySelectedPOI,
  setIsThrowingDice
} from '../../redux/reducers/mapReducer';
import { OSMPropTypes } from '../../constants/osmPropTypes';

export default function ToggleDice({ data, handleFlyTo }) {
  const {
    isThrowingDice,
    isShowingOnlySelectedPOI,
    randomPOINumber,
    viewState
  } = useSelector((state) => state.mapReducer);
  const dispatch = useDispatch();

  const handleDiceToggle = () => {
    dispatch(setIsShowingOnlySelectedPOI(!isShowingOnlySelectedPOI));
    dispatch(setIsThrowingDice(!isThrowingDice));
    if (data && data.length > 0
      && data[randomPOINumber].lon
      && data[randomPOINumber].lat
      && isThrowingDice === false) {
      handleFlyTo(
        data[randomPOINumber].lon,
        data[randomPOINumber].lat,
        viewState.zoom,
        1500
      );
    }
  };

  return (
    <Toggle
      aria-label='toggle'
      translate='no'
      className='mx-2 align-middle justify-center scale-120'
      icons={{
        checked: <div className='text-xs leading-3'>{diceIcon}</div>,
        unchecked: <div className='text-xs leading-3'>{diceIcon}</div>,
      }}
      defaultChecked={isThrowingDice}
      onChange={handleDiceToggle}
    />
  );
}

ToggleDice.propTypes = {
  data: OSMPropTypes,
  handleFlyTo: PropTypes.func
};
