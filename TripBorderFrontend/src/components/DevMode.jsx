import { VERSION_NUMBER, MODE } from '../constants/constants';

function DevMode() {
  return (
    <div className='flex flex-col container justify-center text-center mx-auto max-w-2xl'>
      <p className='text-2xl m-2'>Version: {VERSION_NUMBER} {MODE} </p>
    </div>
  );
}

export default DevMode;
