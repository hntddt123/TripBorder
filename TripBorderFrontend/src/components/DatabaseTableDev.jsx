import { useState, useEffect } from 'react';
import { BACKEND_DOMAIN } from '../constants/constants';

function DatabaseTableDev() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`https://${BACKEND_DOMAIN}/api/users`, {
      credentials: 'include',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => setUsers(data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return <div className='customdiv text-2xl'>Error: {error}</div>;
  }
  return (
    <div className='customdiv cardTrip text-left'>
      <div className='grid grid-cols-1 container mx-auto max-w-4xl'>
        <div className='m-2'>
          <div className='cardInfo text-xl overflow-x-auto table-fixed whitespace-nowrap'>
            <div>Database Table</div>
            <div>user_accounts</div>
            <table>
              <thead>
                <tr>
                  <th>id</th>
                  <th>provider</th>
                  <th>provider_user_id</th>
                  <th>email</th>
                  <th>name</th>
                  <th>created_at</th>
                  <th>updated_at</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
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
            <div>mileages</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DatabaseTableDev;
