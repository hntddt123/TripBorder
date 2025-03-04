import PropTypes from 'prop-types';
import CustomButton from './CustomButton';

function TripBoard({ component }) {
  return (
    <div className='cardTrip text-left'>
      <div className='grid grid-cols-1 container mx-auto max-w-6xl'>
        <div>
          {component}
        </div>
        <CustomButton label='Back' to='/' />
      </div>
    </div>
  );
}

TripBoard.propTypes = {
  component: PropTypes.node
};

export default TripBoard;
