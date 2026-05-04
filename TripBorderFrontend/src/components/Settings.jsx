import { useDispatch, useSelector } from 'react-redux';
import DarkModeToggle from './DarkModeToggle';
import MileagesByEmail from './mileages/MileagesByEmail';
import UserProfile from './UserProfile';
import { MAPBOX_LANGS } from '../constants/constants';
import { setLanguage } from '../redux/reducers/userSettingsReducer';

export default function Settings() {
  const dispatch = useDispatch();
  const { language } = useSelector((state) => state.userSettingsReducer);

  const getLanguagesOptions = () => Object.entries(MAPBOX_LANGS).map(([code, name]) => (
    <option key={code} value={code} defaultValue={language}>
      {name}
    </option>
  ));

  const handleLangChange = (e) => {
    dispatch(setLanguage(e.target.value));
  };

  return (
    <div className='cardMX1'>
      <div className='grid grid-cols-1 container mx-auto max-w-6xl'>
        <div className='cardInfo p-4 text-3xl'>
          <div>Settings</div>
          <div className='text-2xl'>Theme: <DarkModeToggle /></div>
          <div className='text-2xl'>Map Direction Language: {language} </div>
          <select
            className='customInput text-nowrap'
            id='language'
            name='language'
            value={language}
            onChange={handleLangChange}
            required
          >
            {getLanguagesOptions()}
          </select>
        </div>
        <UserProfile />
        <MileagesByEmail />
      </div>
    </div>
  );
}
