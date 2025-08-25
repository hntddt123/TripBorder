import Toggle from 'react-toggle';
import { useDispatch, useSelector } from 'react-redux';
import { setIsFullPOIname } from '../../redux/reducers/mapReducer';

export default function TogglePlaceName() {
  const { isFullPOIname } = useSelector((state) => state.mapReducer);

  const dispatch = useDispatch();

  const handleFullNameToggle = () => {
    dispatch(setIsFullPOIname(!isFullPOIname));
  };

  return (
    <Toggle
      translate='no'
      className='reactToggle'
      icons={false}
      defaultChecked={isFullPOIname}
      onChange={handleFullNameToggle}
    />
  );
}
