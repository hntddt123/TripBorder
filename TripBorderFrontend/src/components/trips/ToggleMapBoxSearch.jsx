import Toggle from 'react-toggle';
import { useDispatch, useSelector } from 'react-redux';
import { setIsUsingMapBoxGeocoder } from '../../redux/reducers/mapReducer';

export default function ToggleMapBoxSearch() {
  const { isUsingMapBoxGeocoder } = useSelector((state) => state.mapReducer);
  const dispatch = useDispatch();

  const handleMapBoxToggle = () => {
    dispatch(setIsUsingMapBoxGeocoder(!isUsingMapBoxGeocoder));
  };

  return (
    <Toggle
      translate='no'
      className='reactToggle'
      icons={false}
      defaultChecked={isUsingMapBoxGeocoder}
      onChange={handleMapBoxToggle}
    />
  );
}
