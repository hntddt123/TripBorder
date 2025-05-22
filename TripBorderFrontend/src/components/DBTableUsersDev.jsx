import { useState } from 'react';
import { useGetUsersQuery, useUpdateUserMutation } from '../api/usersAPI';
import CustomButton from './CustomButton';

function DBTableUsersDev() {
  const [selectedUUID, setSelectedUUID] = useState();
  const { data: users, isLoading, error } = useGetUsersQuery();
  const [updateUser, update] = useUpdateUserMutation();
  console.log(users);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{`Status: ${error.status} - ${error.error}`}</div>;
  }

  const handleUserUpdate = (uuid, updates) => {
    updateUser({ uuid: uuid, updates: updates });
    setSelectedUUID(uuid);
  };

  return (
    <div>
      <div>user_accounts</div>
      <table>
        <thead>
          <tr>
            <th>uuid</th>
            <th>email</th>
            <th>role</th>
            <th>provider</th>
            <th>provider_user_id</th>
            <th>name</th>
            <th>created_at</th>
            <th>updated_at</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => (
            <tr key={user.uuid}>
              <td>{user.uuid}</td>
              <td>{user.email}</td>
              <td>
                {user.role}
                <CustomButton
                  disabled={user.role === 'admin'}
                  label='Promote to Admin'
                  onClick={() => handleUserUpdate(user.uuid, { role: 'admin' })}
                />
                <CustomButton
                  disabled={user.role !== 'admin' || user.email === 'nientaiho@gmail.com'}
                  label='Demote to User'
                  onClick={() => handleUserUpdate(user.uuid, { role: 'user' })}
                />
                {(update.data && selectedUUID === user.uuid)
                  ? (update.data.message)
                  : null}
              </td>
              <td>{user.provider}</td>
              <td>{user.provider_user_id}</td>
              <td>{user.name}</td>
              <td>{user.created_at}</td>
              <td>{user.updated_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DBTableUsersDev;
