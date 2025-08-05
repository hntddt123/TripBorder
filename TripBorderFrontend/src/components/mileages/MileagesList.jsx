import MileageUploadForm from './MileageUploadForm';
import Mileages from './Mileages';

export default function MileagesList() {
  return (
    <div className='cardMX1'>
      <div className='grid grid-cols-1 container mx-auto max-w-6xl'>
        <div className='text-xl overflow-x-auto table-fixed whitespace-nowrap'>
          <MileageUploadForm />
          <Mileages />
        </div>
      </div>
    </div>
  );
}
