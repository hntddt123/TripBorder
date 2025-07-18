import PropTypes from 'prop-types';
import CustomButton from './CustomButton';

function TripBoard({ component }) {
  return (
    <div className='cardTrip text-left'>
      <CustomButton className='backButton px-4 mr-1 mb-0.5' label='←' to='/' />
      <div className='flex flex-col'>
        <div>
          {component}
        </div>
      </div>
    </div>
  );
}

TripBoard.propTypes = {
  component: PropTypes.node,
};

export default TripBoard;
