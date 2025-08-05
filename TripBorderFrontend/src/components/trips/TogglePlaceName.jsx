import Toggle from 'react-toggle';
import { useDispatch, useSelector } from 'react-redux';
import { numIcon } from '../../constants/constants';
import { setIsFullPOIname } from '../../redux/reducers/mapReducer';

function TogglePlaceName() {
  const { isFullPOIname } = useSelector((state) => state.mapReducer);

  const dispatch = useDispatch();

  const handleFullNameToggle = () => {
    dispatch(setIsFullPOIname(!isFullPOIname));
  };

  return (
    <Toggle
      translate='no'
      className='reactToggle'
      icons={{
        checked: <div className='text-xs leading-3'>{numIcon}</div>,
        unchecked: <div className='text-xs leading-3'>{numIcon}</div>,
      }}
      defaultChecked={!isFullPOIname}
      onChange={handleFullNameToggle}
    />
  );
}

export default TogglePlaceName;
