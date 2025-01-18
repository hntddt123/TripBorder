import PropTypes from 'prop-types';
import CustomButton from './CustomButton';

function TripBoard({ label, component }) {
  return (
    <div className='customdiv cardTrip text-left'>
      <div className='grid grid-cols-1 container mx-auto max-w-4xl'>
        <div>
          {component}
        </div>
        <div className='m-2'>
          <h1 className='cardTitle text-2xl'>{label}</h1>
        </div>
        <CustomButton label='Back' to='/' />
      </div>
    </div>
  );
}

TripBoard.propTypes = {
  label: PropTypes.string,
  component: PropTypes.node
};

export default TripBoard;
