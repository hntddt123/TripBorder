import { useState } from 'react';
import { useGetUsersQuery, useUpdateUserMutation } from '../../api/usersAPI';
import CustomButton from '../CustomButton';
import CustomError from '../CustomError';
import CustomLoading from '../CustomLoading';
import CustomFetching from '../CustomFetching';

export default function DBTableUsersDev() {
  const [selectedUUID, setSelectedUUID] = useState();
  const [page, setPage] = useState(1);
  const limit = 3;
  const { data, isLoading, isFetching, error } = useGetUsersQuery({ page, limit });
  const { users, total, totalPages, page: currentPage } = data || {};

  const [updateUser, update] = useUpdateUserMutation();

  const handlePageChange = (newPage) => {
    setPage(newPage);
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
      <div>user_accounts</div>
      <div className='text-center'>
        <div>
          <CustomButton
            label='Previous'
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1 || isFetching}
          />
          <CustomButton
            label='Next'
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages || isFetching || totalPages === 0}
          />
        </div>
        <span>
          Page {currentPage} of {totalPages}
          (Total: {total} items)
        </span>
      </div>
      <div>
        <CustomFetching isFetching={isFetching} text='Fetching new page' />
      </div>
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
            <th>trial_started_at</th>
            <th>is_trialed</th>
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
              <td>{user.provider}</td>
              <td>{user.provider_user_id}</td>
              <td>{user.name}</td>
              <td>{user.created_at}</td>
              <td>{user.updated_at}</td>
              <td>{user.trial_started_at}</td>
              <td>{(user.is_trialed) ? 'true' : 'false'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
