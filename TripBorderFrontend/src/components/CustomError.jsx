import { errorPropTypes } from '../constants/errorPropTypes';

export default function CustomError({ error }) {
  return (
    <div className='customError'>
      Status: {error.status} - {error?.data?.error ?? error?.error ?? 'Unknown error'}
    </div>
  );
}

CustomError.propTypes = {
  error: errorPropTypes
};
