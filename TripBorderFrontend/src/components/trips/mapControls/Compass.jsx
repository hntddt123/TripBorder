import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import CustomButton from '../../CustomButton';

export default function Compass({ handleNorthUp }) {
  const { isNorthUp, gpsLonLat } = useSelector((state) => state.mapReducer);

  if (isNorthUp) {
    return (
      <CustomButton
        className='button absoluteTopToolBarRight mt-14 select-none'
        translate='no'
        label='N'
        onClick={handleNorthUp}
        hidden={!gpsLonLat?.longitude && !gpsLonLat?.latitude}
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
