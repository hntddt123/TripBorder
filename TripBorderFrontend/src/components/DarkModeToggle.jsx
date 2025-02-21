import { useSelector, useDispatch } from 'react-redux';
import {
  setDarkMode
} from '../redux/reducers/mapReducer';

function DarkModeToggle() {
  const darkMode = useSelector((state) => state.mapReducer.isDarkMode);
  const dispatch = useDispatch();

  const toggleDarkMode = () => {
    dispatch(setDarkMode(!darkMode));
    document.documentElement.classList.toggle('dark');
  };

  return (
    <button className='darkmodeButton bg-slate-100 dark:bg-slate-800 p-2' onClick={toggleDarkMode}>
      {darkMode ? '🌙' : '🌞'}
    </button>
  );
}

export default DarkModeToggle;
