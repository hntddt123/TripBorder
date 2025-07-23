import PropTypes from 'prop-types';
import CustomButton from './CustomButton';

function TripBoard({ component }) {
  return (
    <div className='content pt-1'>
      <CustomButton className='buttonBack' label='←' to='/' />
      <div className='flex flex-col'>
        {component}
      </div>
    </div>
  );
}

TripBoard.propTypes = {
  component: PropTypes.node,
};

export default TripBoard;
