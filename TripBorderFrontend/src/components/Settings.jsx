import DarkModeToggle from './DarkModeToggle';
import MileagesByEmail from './mileages/MileagesByEmail';
import UserProfile from './UserProfile';

export default function Settings() {
  return (
    <div className='cardMX1'>
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
