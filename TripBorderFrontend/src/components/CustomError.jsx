import { errorPropTypes } from '../constants/errorPropTypes';

export default function CustomError({ error }) {
  if (error) {
    let errorString = '';
    if (error.status === 'FETCH_ERROR') {
      errorString = 'Failed to connect server, check Internet connection';
    } else if (error?.data?.error?.message) {
      errorString = error.data.error.message;
    } else if (error?.data?.error) {
      errorString = error.data.error;
    } else if (error?.error) {
      errorString = error.error;
    } else if (error?.message) {
      errorString = error.message;
    } else {
      errorString = 'Unknown error';
    }

    return (
      <span data-testid='customError' className='customError'>
        {`Status: ${error?.status} - `}
        {`${errorString}`}
      </span>
    );
  }
  return null;
}

CustomError.propTypes = {
  error: errorPropTypes
};
