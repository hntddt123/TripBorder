import { useEffect, useState, useRef } from 'react';
import { useTransform } from 'motion/react';
import PropTypes from 'prop-types';
import { Sheet } from 'react-modal-sheet';
import { useOrientation } from '../../hooks/useOrientation';
import TripCurrent from './TripCurrent';

export default function TripPlanningTools({ handleFlyTo, handleFitBounds, onClose }) {
  const [remountKey, setRemountKey] = useState(0);
  const { isPortrait } = useOrientation();
  const ref = useRef(null);
  const paddingBottom = useTransform(() => ref.current?.y.get() ?? 0);
  const initialSnap = 2;
  const snapPoints = [0, 0.25, 0.5, 0.75, 1];

  const handleCloseEvent = () => {
    if (onClose) onClose();
  };

  useEffect(() => {
    setRemountKey((prev) => prev + 1);
  }, [isPortrait]);

  return (
    <Sheet
      ref={ref}
      key={remountKey}
      isOpen
      onClose={handleCloseEvent}
      initialSnap={initialSnap}
      snapPoints={snapPoints}
      detent='full'
    >
      <Sheet.Container className='bg-black'>
        <Sheet.Header className='bg-black' />
        <Sheet.Content
          className='safeArea bg-black select-text'
          scrollStyle={{ paddingBottom }}
          disableDrag
        >
          <TripCurrent handleFlyTo={handleFlyTo} handleFitBounds={handleFitBounds} />
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
}

TripPlanningTools.propTypes = {
  handleFlyTo: PropTypes.func,
  handleFitBounds: PropTypes.func,
  onClose: PropTypes.func
};
