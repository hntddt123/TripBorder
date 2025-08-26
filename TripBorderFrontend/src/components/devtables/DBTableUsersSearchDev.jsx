import { useRef, useState } from 'react';
import { useLazyGetUserByEmailQuery, useUpdateUserMutation } from '../../api/usersAPI';
import CustomButton from '../CustomButton';
import CustomError from '../CustomError';
import CustomLoading from '../CustomLoading';
import CustomFetching from '../CustomFetching';

export default function DBTableUsersDev() {
  const [selectedUUID, setSelectedUUID] = useState();
  const [userEmail, setUserEmail] = useState('');
  const inputRef = useRef(null);

  const [getUserByEmailQueryTrigger, { data: user, isLoading, isFetching, error }] = useLazyGetUserByEmailQuery();

  const [updateUser, update] = useUpdateUserMutation();

  const handleInputChange = (e) => {
    setUserEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    inputRef.current.blur();
    getUserByEmailQueryTrigger(userEmail);
  };

  if (isLoading) {
    return <div><CustomLoading isLoading={isLoading} /></div>;
  }

  if (error) {
    return <CustomError error={error} />;
  }

  const handleUserUpdate = (uuid, updates) => () => {
    updateUser({ uuid: uuid, updates: updates });
    setSelectedUUID(uuid);
  };

  return (
    <div>
      <div>Search user_accounts</div>
      <form
        onSubmit={handleSubmit}
      >
        <input
          className='customInputUserSearch'
          ref={inputRef}
          id='user_email_search'
          type='text'
          name='user_email_search'
          value={userEmail}
          onChange={handleInputChange}
          required
          placeholder='Search'
          minLength={1}
          maxLength={42}
          enterKeyHint='search'
        />
      </form>
      <div>
        <CustomFetching isFetching={isFetching} text='Fetching new page' />
      </div>
      <table>
        <thead>
          <tr>
            <th>email</th>
            <th>role</th>
            <th>uuid</th>
            <th>provider</th>
            <th>provider_user_id</th>
            <th>name</th>
            <th>created_at</th>
            <th>updated_at</th>
            <th>trial_started_at</th>
            <th>is_trialed</th>
          </tr>
        </thead>
        <tbody>
          {(user) ? (
            <tr key={user.uuid}>
              <td>{user.email}</td>
              <td>
                {user.role}
                <CustomButton
                  disabled={user.role === 'admin'}
                  label='Promote to Admin'
                  onClick={handleUserUpdate(user.uuid, { role: 'admin' })}
                />
                <CustomButton
                  disabled={user.role === 'premium_user' || user.role === 'admin'}
                  label='Promote to Premium User'
                  onClick={handleUserUpdate(user.uuid, { role: 'premium_user' })}
                />
                <CustomButton
                  disabled={user.role === 'user'
                    || user.email === 'nientaiho@gmail.com'}
                  label='Demote to User'
                  onClick={handleUserUpdate(user.uuid, { role: 'user' })}
                />
                {(update.data && selectedUUID === user.uuid)
                  ? (update.data.message)
                  : null}
              </td>
              <td>{user.uuid}</td>
              <td>{user.provider}</td>
              <td>{user.provider_user_id}</td>
              <td>{user.name}</td>
              <td>{user.created_at}</td>
              <td>{user.updated_at}</td>
              <td>{user.trial_started_at}</td>
              <td>{(user.is_trialed) ? 'true' : 'false'}</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
