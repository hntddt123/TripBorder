import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Sheet } from 'react-modal-sheet';
import { useOrientation } from '../../hooks/useOrientation';
import TripCurrent from './TripCurrent';

export default function TripPlanningTools({ handleFlyTo, onClose }) {
  const [remountKey, setRemountKey] = useState(0);
  const { isPortrait } = useOrientation();

  const handleCloseEvent = () => {
    if (onClose) onClose();
  };

  useEffect(() => {
    setRemountKey((prev) => prev + 1);
  }, [isPortrait]);

  return (
    <Sheet
      key={remountKey}
      isOpen
      onClose={handleCloseEvent}
      initialSnap={2}
      snapPoints={[1, 0.7, 0.5, 0]}
    >
      <Sheet.Container className='bg-black'>
        <Sheet.Header className='bg-black' />
        <Sheet.Content
          className='safeArea bg-black'
        >
          <Sheet.Scroller className='select-text'>
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
