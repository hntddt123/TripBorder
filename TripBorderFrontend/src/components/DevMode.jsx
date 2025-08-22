import { VERSION_NUMBER, MODE } from '../constants/constants';
import CustomButton from './CustomButton';
import { useCheckAuthStatusQuery } from '../api/authAPI';

export default function DevMode() {
  const { data } = useCheckAuthStatusQuery({ skip: true });

  return (
    <div>
      {(!data?.isAuthenticated)
        ? (
          <div>
            <div className='text-2xl m-2'>
              Dev Mode
            </div>
            <div className='mainmenu'>
              <CustomButton
                className='buttonMainmenu bg-[url(/menuImages/Plantrips.png)]'
                label='Plan Trip'
                to='/plantrip'
              />
              <CustomButton
                className='buttonMainmenu'
                label='View Trips'
                to='/trips'
              />
              <CustomButton
                className='buttonMainmenu'
                label='Mileages'
                to='/mileages'
              />
              <CustomButton
                className='buttonMainmenu'
                label='Mileage Verification'
                to='/mileagesverification'
              />
              <CustomButton
                className='buttonMainmenu'
                label='Database Table'
                to='/database'
              />
              <CustomButton
                className='buttonMainmenu'
                label='Settings'
                to='/settings'
              />
            </div>
            <CustomButton
              label='Disclaimers'
              to='/disclaimers'
            />
          </div>
        )
        : null}
      <div className='text-2xl m-2'>
        Version: {VERSION_NUMBER} {MODE}
      </div>
    </div>
  );
}
