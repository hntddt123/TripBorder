import { VERSION_NUMBER, MODE } from '../constants/constants';
import CustomButton from './CustomButton';
import { useCheckAuthStatusQuery } from '../api/authAPI';

export default function DevMode() {
  const { data } = useCheckAuthStatusQuery({ skip: true });

  return (
    <div>
      {(!data?.isAuthenticated)
        ? (
          <div className='flex flex-col container justify-center text-center mx-auto max-w-2xl'>
            <div className='text-2xl m-2'>
              Dev Mode
            </div>
            <CustomButton label='Plan Trip' to='/plantrip' />
            <CustomButton label='View Trips' to='/trips' />
            <CustomButton label='Mileages' to='/mileages' />
            <CustomButton label='Mileage Verification' to='/mileagesverification' />
            <CustomButton label='Settings' to='/settings' />
            <CustomButton label='Disclaimers' to='/disclaimers' />
            <CustomButton label='Database Table' to='/database' />

          </div>
        )
        : null}
      <div className='text-2xl m-2'>
        Version: {VERSION_NUMBER} {MODE}
      </div>
    </div>
  );
}
