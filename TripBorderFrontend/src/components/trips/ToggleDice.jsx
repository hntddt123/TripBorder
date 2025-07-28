import { useDispatch, useSelector } from 'react-redux';
import Toggle from 'react-toggle';
import { diceIcon } from '../../constants/constants';
import {
  setViewState,
  setIsShowingOnlySelectedPOI,
  setIsThrowingDice
} from '../../redux/reducers/mapReducer';
import { FourSquareResponsePropTypes } from '../../constants/fourSquarePropTypes';

function ToggleDice({ poi }) {
  const isThrowingDice = useSelector((state) => state.mapReducer.isThrowingDice);
  const isShowingOnlySelectedPOI = useSelector((state) => state.mapReducer.isShowingOnlySelectedPOI);
  const randomPOINumber = useSelector((state) => state.mapReducer.randomPOINumber);
  const viewState = useSelector((state) => state.mapReducer.viewState);
  const dispatch = useDispatch();

  const handleDiceToggle = () => {
    dispatch(setIsShowingOnlySelectedPOI(!isShowingOnlySelectedPOI));
    dispatch(setIsThrowingDice(!isThrowingDice));
    if (poi !== undefined && isThrowingDice === false) {
      dispatch(setViewState({
        latitude: poi.results[randomPOINumber].geocodes.main.latitude,
        longitude: poi.results[randomPOINumber].geocodes.main.longitude,
        zoom: viewState.zoom
      }));
    }
  };

  return (
    <Toggle
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
  poi: FourSquareResponsePropTypes
};

export default ToggleDice;
