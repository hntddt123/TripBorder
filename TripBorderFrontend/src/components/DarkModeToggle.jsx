import { useSelector, useDispatch } from 'react-redux';
import {
  setDarkMode
} from '../redux/reducers/mapReducer';
import CustomButton from './CustomButton';

export default function DarkModeToggle() {
  const { isDarkMode } = useSelector((state) => state.mapReducer);

  const dispatch = useDispatch();

  const toggleDarkMode = () => {
    dispatch(setDarkMode(!isDarkMode));
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  };

  return (
    <CustomButton
      className='buttonDarkmode'
      onClick={toggleDarkMode}
      label={isDarkMode ? '🌙' : '🌞'}
    />
  );
}
