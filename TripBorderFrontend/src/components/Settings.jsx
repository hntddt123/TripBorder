import DarkModeToggle from './DarkModeToggle';
import MileagesByEmail from './MileagesByEmail';
import UserProfile from './UserProfile';

function Settings() {
  return (
    <div className='cardTrip'>
      <div className='grid grid-cols-1 container mx-auto max-w-6xl'>
        <div className='cardInfo p-4 text-3xl'>
          <div>Settings</div>
          <div className='text-2xl'>Theme: <DarkModeToggle /></div>
        </div>
        <UserProfile />
        <MileagesByEmail />
      </div>
    </div>
  );
}

export default Settings;
