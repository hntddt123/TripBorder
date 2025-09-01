import PropTypes from 'prop-types';
import { Sheet } from 'react-modal-sheet';
import TripCurrent from './TripCurrent';

export default function TripPlanningTools({ handleFlyTo, onClose }) {
  const handleCloseEvent = () => {
    if (onClose) onClose();
  };

  return (
    <Sheet
      isOpen
      onClose={handleCloseEvent}
      initialSnap={1}
      snapPoints={[1, 0.35, 0]}
    >
      <Sheet.Container>
        <Sheet.Header className='bg-black' />
        <Sheet.Content
          className='bg-black'
        >
          <Sheet.Scroller>
            <TripCurrent handleFlyTo={handleFlyTo} />
          </Sheet.Scroller>
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
}

TripPlanningTools.propTypes = {
  handleFlyTo: PropTypes.func,
  onClose: PropTypes.func
};
