import { useState, useEffect } from 'react';
import { processBytea } from '../utility/processBytea';
import { useGetMileagesQuery } from '../api/mileageAPI';
import { fetchUsers } from '../api/userAPI';

function DatabaseTableDev() {
  const { data: mileages, isLoading, error } = useGetMileagesQuery();
  const [users, setUsers] = useState([]);
  const [userError, setUserError] = useState(null);

  useEffect(() => {
    fetchUsers()
      .then((data) => setUsers(data))
      .catch((err) => setUserError(err.message));
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{`Status: ${error.status} - ${error.error}`}</div>;
  }

  if (userError) {
    return <div className='text-2xl'>Error: User {userError}</div>;
  }
  return (
    <div className='cardTrip text-left'>
      <div className='grid grid-cols-1 container mx-auto max-w-6xl'>
        <div className='m-2'>
          <div className='cardInfo text-xl overflow-x-auto table-fixed whitespace-nowrap'>
            <div>Database Table</div>
            <div>user_accounts</div>
            <table>
              <thead>
                <tr>
                  <th>uuid</th>
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
                  <tr key={user.uuid}>
                    <td>{user.uuid}</td>
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
                  <th>verified</th>
                  <th>owner_email</th>
                  <th>uuid</th>
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
                  <tr key={mileage.uuid}>
                    <td>{mileage.verified.toString()}</td>
                    <td>{mileage.owner_email}</td>
                    <td>{mileage.uuid}</td>
                    <td>{mileage.frequent_flyer_number}</td>
                    <td>{mileage.airline}</td>
                    <td>{mileage.mileage_price}</td>
                    <td>{mileage.mileage_amount}</td>
                    <td>{mileage.mileage_unit}</td>
                    <td>{processBytea(mileage.mileage_picture).substring(0, 20)}</td>
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
