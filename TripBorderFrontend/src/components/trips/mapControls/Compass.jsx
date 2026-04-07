import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import CustomButton from '../../CustomButton';

export default function Compass({ handleNorthUp }) {
  const { isNorthUp } = useSelector((state) => state.mapReducer);

  if (isNorthUp) {
    return (
      <CustomButton
        className='button absoluteTopToolBarRight mt-14 select-none'
        translate='no'
        label='N'
        onClick={handleNorthUp}
      />
    );
  }
  return (
    <CustomButton
      className='button absoluteTopToolBarRight mt-14 select-none'
      translate='no'
      label='🧭'
      onClick={handleNorthUp}
    />
  );
}

Compass.propTypes = {
  handleNorthUp: PropTypes.func
};
