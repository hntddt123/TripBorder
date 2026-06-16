import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import CustomButton from '../../CustomButton';

export default function GPS({ handleGPS, watchState }) {
  const {
    gpsState
  } = useSelector((state) => state.mapReducer);

  const getStyleByGPSState = () => {
    if (gpsState === 'ACTIVE_LOCK') {
      return 'buttonCompass';
    }
    if (gpsState === 'WAITING_ACTIVE') {
      return 'buttonGPS';
    }
    return 'buttonNoHoverBG';
  };

  return (
    <CustomButton
      className={`${getStyleByGPSState()} absoluteBottomToolBarRight select-none active:scale-125`}
      translate='no'
      label={(watchState === 'ACTIVE_LOCK') ? '🔒🛰️' : '🛰️'}
      onClick={handleGPS}
    />
  );
}

GPS.propTypes = {
  handleGPS: PropTypes.func,
  watchState: PropTypes.bool
};
