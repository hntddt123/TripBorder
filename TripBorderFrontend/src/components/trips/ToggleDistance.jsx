import Toggle from 'react-toggle';
import { useDispatch, useSelector } from 'react-redux';
import { setIsShowingDistance } from '../../redux/reducers/mapReducer';

export default function ToggleDistance() {
  const { isShowingDistance } = useSelector((state) => state.mapReducer);

  const dispatch = useDispatch();

  const handleFullNameToggle = () => {
    dispatch(setIsShowingDistance(!isShowingDistance));
  };

  return (
    <Toggle
      translate='no'
      className='reactToggle'
      icons={false}
      defaultChecked={isShowingDistance}
      onChange={handleFullNameToggle}
    />
  );
}
