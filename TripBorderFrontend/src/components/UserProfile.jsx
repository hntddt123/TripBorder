import { useCheckAuthStatusQuery } from '../api/authAPI';
import CustomError from './CustomError';
import CustomFetching from './CustomFetching';

export default function UserProfile() {
  const { data: user, isFetching, error } = useCheckAuthStatusQuery();
  const profilePicture = user?.profile_picture;

  return (
    <div className='cardInfo p-4 overflow-x-auto text-nowrap'>
      <CustomFetching isFetching={isFetching} />
      <CustomError error={error} />
      <img className='profilepic' src={profilePicture} alt='profilepic' />
      <div className='text-3xl'>Profile</div>
      <table>
        <tbody>
          {(user) ? Object.keys(user)
            .filter((key) => key !== 'profile_picture' && key !== 'isAuthenticated')
            .map((key) => (
              <tr key={key}>
                <th>{key}</th>
                <td>{user[key]}</td>
              </tr>
            ))
            : null}
        </tbody>
      </table>
    </div>
  );
}
