import { useState, useEffect } from 'react';
import { BACKEND_DOMAIN } from '../constants/constants';

const fetchUsers = async () => {
  const response = await fetch(`https://${BACKEND_DOMAIN}/api/users`, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const fetchMileages = async () => {
  const response = await fetch(`https://${BACKEND_DOMAIN}/api/mileages`, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

function DatabaseTableDev() {
  const [users, setUsers] = useState([]);
  const [mileages, setMilages] = useState([]);
  const [userError, setUserError] = useState(null);
  const [mileageError, setMileageError] = useState(null);

  useEffect(() => {
    fetchUsers()
      .then((data) => setUsers(data))
      .catch((err) => setUserError(err.message));
  }, []);

  useEffect(() => {
    fetchMileages()
      .then((data) => setMilages(data))
      .catch((err) => setMileageError(err.message));
  }, []);

  if (userError) {
    return <div className='customdiv text-2xl'>Error: User {userError}</div>;
  }
  if (mileageError) {
    return <div className='customdiv text-2xl'>Error: Milage {mileageError}</div>;
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
            <table>
              <thead>
                <tr>
                  <th>id</th>
                  <th>frequent_flyer_number</th>
                  <th>airline</th>
                  <th>mileage_price</th>
                  <th>mileage_amount</th>
                  <th>mileage_unit</th>
                  <td>mileage_picture</td>
                  <th>mileage_expired_at</th>
                  <th>created_at</th>
                  <th>updated_at</th>
                </tr>
              </thead>
              <tbody>
                {mileages.map((mileage) => (
                  <tr key={mileage.id}>
                    <td>{mileage.id}</td>
                    <td>{mileage.frequent_flyer_number}</td>
                    <td>{mileage.airline}</td>
                    <td>{mileage.mileage_price}</td>
                    <td>{mileage.mileage_amount}</td>
                    <td>{mileage.mileage_unit}</td>
                    <td>{mileage.mileage_picture}</td>
                    <td>{mileage.mileage_expired_at}</td>
                    <td>{mileage.created_at}</td>
                    <td>{mileage.updated_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DatabaseTableDev;
