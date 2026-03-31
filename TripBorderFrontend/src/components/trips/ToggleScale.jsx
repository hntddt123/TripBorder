import Toggle from 'react-toggle';
import { useDispatch, useSelector } from 'react-redux';
import { setIsShowingScaleRuler } from '../../redux/reducers/mapReducer';

export default function ToggleScale() {
  const { isShowingScaleRuler } = useSelector((state) => state.mapReducer);

  const dispatch = useDispatch();

  const handleScaleRulerToggle = () => {
    dispatch(setIsShowingScaleRuler(!isShowingScaleRuler));
  };

  return (
    <Toggle
      translate='no'
      className='reactToggle'
      icons={false}
      defaultChecked={isShowingScaleRuler}
      onChange={handleScaleRulerToggle}
    />
  );
}
