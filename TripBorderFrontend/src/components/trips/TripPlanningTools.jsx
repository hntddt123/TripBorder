import PropTypes from 'prop-types';
import TripCurrent from './TripCurrent';

export default function TripPlanningTools({ handleFlyTo }) {
  return (
    <div className='tripAbsoluteContentLeft'>
      <TripCurrent handleFlyTo={handleFlyTo} />
    </div>
  );
}

TripPlanningTools.propTypes = {
  handleFlyTo: PropTypes.func,
};
