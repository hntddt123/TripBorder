import { useSelector, useDispatch } from 'react-redux';
import {
  setIsDarkMode
} from '../redux/reducers/userSettingsReducer';
import CustomButton from './CustomButton';

export default function DarkModeToggle() {
  const { isDarkMode } = useSelector((state) => state.userSettingsReducer);

  const dispatch = useDispatch();

  const toggleDarkMode = () => {
    dispatch(setIsDarkMode(!isDarkMode));
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
