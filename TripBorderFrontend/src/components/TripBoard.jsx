import PropTypes from 'prop-types';
import CustomButton from './CustomButton';

function TripBoard({ component }) {
  return (
    <div className='cardTrip text-left'>
      <CustomButton className='backButton pl-2 pr-2' label='←' to='/' />
      <div className='grid grid-cols-1 container mx-auto max-w-6xl'>
        <div>
          {component}
        </div>
      </div>
    </div>
  );
}

TripBoard.propTypes = {
  component: PropTypes.node
};

export default TripBoard;
