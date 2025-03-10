import { useSelector } from 'react-redux';
import { authAPI } from '../api/authAPI';

function UserProfile() {
  const user = useSelector(authAPI.endpoints.checkAuthStatus.select());
  const email = user.data?.email;
  const username = user.data?.name;
  const uuid = user.data?.uuid;
  const provider = user.data?.provider;
  const providerID = user.data?.provider_user_id;
  const createdAt = user.data?.createdAt;
  const updatedAt = user.data?.updatedAt;
  const role = user.data?.role;

  return (
    <div className='cardInfo p-4'>
      <div className='text-3xl'>Profile</div>
      <div className='text-xl'>Name: {username}</div>
      <div className='text-xl'>Email: {email}</div>
      <div className='text-xl'>Provider: {provider}</div>
      <div className='text-xl'>ProviderID: {providerID}</div>
      <div className='text-xl'>UUID: {uuid}</div>
      <div className='text-xl'>Created at: {createdAt}</div>
      <div className='text-xl'>Updated at: {updatedAt}</div>
      <div className='text-xl'>Role: {role}</div>
    </div>
  );
}

export default UserProfile;
