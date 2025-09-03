import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Toggle from 'react-toggle';
import { diceIcon } from '../../constants/constants';
import {
  setIsShowingOnlySelectedPOI,
  setIsThrowingDice
} from '../../redux/reducers/mapReducer';
import { OSMPropTypes } from '../../constants/osmPropTypes';

export default function ToggleDice({ poi, handleFlyTo }) {
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
    if (poi && poi[randomPOINumber].lon && poi[randomPOINumber].lat && isThrowingDice === false) {
      handleFlyTo(
        poi[randomPOINumber].lon,
        poi[randomPOINumber].lat,
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
  poi: OSMPropTypes,
  handleFlyTo: PropTypes.func
};
