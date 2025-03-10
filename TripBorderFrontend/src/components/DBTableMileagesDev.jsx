import { processBytea } from '../utility/processBytea';
import { useGetMileagesQuery } from '../api/mileagesAPI';

function DBTableMileagesDev() {
  const { data: mileages, isLoading, error } = useGetMileagesQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{`Status: ${error.status} - ${error.error}`}</div>;
  }

  return (
    <div>
      <div>mileages</div>
      <table>
        <thead>
          <tr>
            <th>is_listed</th>
            <th>is_verified</th>
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
          {mileages?.map((mileage) => (
            <tr key={mileage.uuid}>
              <td>{mileage.is_listed.toString()}</td>
              <td>{mileage.is_verified.toString()}</td>
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
  );
}

export default DBTableMileagesDev;
