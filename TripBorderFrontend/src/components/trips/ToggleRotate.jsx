import Toggle from 'react-toggle';
import { useDispatch, useSelector } from 'react-redux';
import { setIsMapRotate } from '../../redux/reducers/mapReducer';

export default function ToggleRotate() {
  const { isMapRotate } = useSelector((state) => state.mapReducer);

  const dispatch = useDispatch();

  const handleScaleRulerToggle = () => {
    dispatch(setIsMapRotate(!isMapRotate));
  };

  return (
    <Toggle
      translate='no'
      className='reactToggle'
      icons={false}
      defaultChecked={isMapRotate}
      onChange={handleScaleRulerToggle}
    />
  );
}
