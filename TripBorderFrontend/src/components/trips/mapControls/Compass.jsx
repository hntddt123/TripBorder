import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import CustomButton from '../../CustomButton';

export default function Compass({ handleNorthUp }) {
  const {
    isNorthUp,
    bearing,
    gpsLonLat
  } = useSelector((state) => state.mapReducer);

  return (
    <CustomButton
      className={`${isNorthUp ? 'buttonNoHoverBG' : 'buttonCompass'} absoluteTopToolBarRight mt-14 select-none active:scale-125`}
      translate='no'
      label={isNorthUp ? 'N' : `${bearing}`}
      onClick={handleNorthUp}
      hidden={!gpsLonLat?.longitude && !gpsLonLat?.latitude}
    />
  );
}

Compass.propTypes = {
  handleNorthUp: PropTypes.func
};
