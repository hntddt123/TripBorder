import DarkModeToggle from './DarkModeToggle';

function Settings() {
  return (
    <div className='customdiv cardTrip text-left'>
      <div className='grid grid-cols-1 container mx-auto max-w-4xl'>
        <div className='m-2'>
          <div className='cardInfo text-3xl'>
            <div>Settings</div>
            <div className='text-2xl'>Theme: <DarkModeToggle /></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
