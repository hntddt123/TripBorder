import { processBytea } from '../utility/processBytea';
import { getLocalTime } from '../utility/time';
import { useGetMileagesQuery } from '../api/mileageAPI';

function Mileages() {
  const { data: mileages, isLoading, error } = useGetMileagesQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{`Status: ${error.status} - ${error.error}`}</div>;
  }

  return (
    <div className='text-3xl overflow-x-auto table-fixed whitespace-nowrap'>
      <div className='text-center'>Mileages Exchange</div>
      {mileages.map((mileage) => (
        <div key={mileage.uuid}>
          <button className='cardMileage'>
            <div className='flex overflow-x-auto max-w-full items-center'>
              <div className='p-4 space-x-2 space-y-2'>
                {/* <div>{`${mileage.uuid}`}</div> */}
                <div>{`${mileage.airline}`}</div>
                <div>{`${mileage.frequent_flyer_number}`}</div>
                <div>{`$${mileage.mileage_price}`}</div>
                <div>{`${mileage.mileage_amount} ${mileage.mileage_unit}`}</div>
              </div>
              <div className='p-4 space-x-2 space-y-2'>
                <div>{`Expire at ${getLocalTime(mileage.mileage_expired_at)}`}</div>
                <div>{`Created at ${getLocalTime(mileage.created_at)}`}</div>
                <div>{`Updated at ${getLocalTime(mileage.updated_at)}`}</div>
              </div>
              <div className='space-x-2 space-y-2 h-48 group'>
                <img
                  className='group-hover:absolute min-w-48 h-48 object-contain rounded hover:scale-125 transition-transform duration-300'
                  src={`data:image/png;base64,${processBytea(mileage.mileage_picture)}`}
                  alt='Mileage'
                />
              </div>
            </div>
          </button>
        </div>
      ))}
    </div>
  );
}

export default Mileages;
