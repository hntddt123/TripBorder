import { errorPropTypes } from '../constants/errorPropTypes';

export default function CustomError({ error }) {
  if (error) {
    return (
      <span data-testid='customError' className='customError'>
        Status: {error.status} - {error?.data?.error ?? error?.error ?? 'Unknown error'}
      </span>
    );
  }
  return null;
}

CustomError.propTypes = {
  error: errorPropTypes
};
