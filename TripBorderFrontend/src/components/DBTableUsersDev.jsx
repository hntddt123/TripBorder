import { useGetUsersQuery } from '../api/usersAPI';

function DBTableUsersDev() {
  const { data: users, isLoading, error } = useGetUsersQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{`Status: ${error.status} - ${error.error}`}</div>;
  }

  return (
    <div>
      <div>user_accounts</div>
      <table>
        <thead>
          <tr>
            <th>uuid</th>
            <th>role</th>
            <th>provider</th>
            <th>provider_user_id</th>
            <th>email</th>
            <th>name</th>
            <th>created_at</th>
            <th>updated_at</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => (
            <tr key={user.uuid}>
              <td>{user.uuid}</td>
              <td>{user.role}</td>
              <td>{user.provider}</td>
              <td>{user.provider_user_id}</td>
              <td>{user.email}</td>
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
