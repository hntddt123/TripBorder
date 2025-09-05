import { useCheckAuthStatusQuery } from '../api/authAPI';
import CustomError from './CustomError';
import CustomFetching from './CustomFetching';

export default function UserProfile() {
  const { data: user, isFetching, error } = useCheckAuthStatusQuery();

  const email = user?.email;
  const username = user?.name;
  const uuid = user?.uuid;
  const profilePicture = user?.profile_picture;
  const provider = user?.provider;
  const providerID = user?.provider_user_id;
  const createdAt = user?.created_at;
  const updatedAt = user?.updated_at;
  const role = user?.role;
  const isTrialed = user?.is_trialed;
  const trialStartedAt = user?.trial_started_at;

  return (
    <div className='cardInfo p-4 overflow-x-auto text-nowrap'>
      <CustomFetching isFetching={isFetching} />
      <CustomError error={error} />
      <img className='profilepic' src={profilePicture} alt='profilepic' />
      <div className='text-3xl'>Profile</div>
      <div className='flex justify-around text-xl'>
        <span className='min-w-1/3'>Name:</span>
        <div className='min-w-2/3'>{username}</div>
      </div>
      <div className='flex justify-around text-xl'>
        <span className='min-w-1/3'>Email:</span>
        <div className='min-w-2/3'>{email}</div>
      </div>
      <div className='flex justify-around text-xl'>
        <span className='min-w-1/3'>Provider:</span>
        <div className='min-w-2/3'>{provider}</div>
      </div>
      <div className='flex justify-around text-xl'>
        <span className='min-w-1/3'>ProviderID:</span>
        <div className='min-w-2/3'>{providerID}</div>
      </div>
      <div className='flex justify-around text-xl'>
        <span className='min-w-1/3'>UUID:</span>
        <div className='min-w-2/3'>{uuid}</div>
      </div>
      <div className='flex justify-around text-xl'>
        <span className='min-w-1/3'>Created:</span>
        <div className='min-w-2/3'>{createdAt}</div>
      </div>
      <div className='flex justify-around text-xl'>
        <span className='min-w-1/3'>Updated:</span>
        <span className='min-w-2/3'>{updatedAt}</span>
      </div>
      <div className='flex justify-around text-xl'>
        <span className='min-w-1/3'>Role:</span>
        <span className='min-w-2/3'>{role}</span>
      </div>
      <div className='flex justify-around text-xl'>
        <span className='min-w-1/3'>Trial:</span>
        <span className='min-w-2/3'>{isTrialed ? 'Yes' : 'No'}</span>
      </div>
      <div className='flex justify-around text-xl'>
        <span className='min-w-1/3'>Trial start:</span>
        <span className='min-w-2/3'>{trialStartedAt}</span>
      </div>
    </div>
  );
}
