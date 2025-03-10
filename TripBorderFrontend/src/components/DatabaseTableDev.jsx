import DBTableMileagesDev from './DBTableMileagesDev';
import DBTableUsersDev from './DBTableUsersDev';

function DatabaseTableDev() {
  return (
    <div className='cardTrip text-left'>
      <div className='grid grid-cols-1 container mx-auto max-w-6xl'>
        <div className='m-2'>
          <div className='cardInfo text-xl overflow-x-auto table-fixed whitespace-nowrap'>
            <div>Database Table</div>
            <DBTableUsersDev />
            <DBTableMileagesDev />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DatabaseTableDev;
