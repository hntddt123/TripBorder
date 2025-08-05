import PropTypes from 'prop-types';

export default function CustomError({ error }) {
  return (
    <div className='text-red-600'>
      Status: {error.status} - {error?.data?.error ?? error?.error ?? 'Unknown error'}
    </div>
  );
}

CustomError.propTypes = {
  error: PropTypes.shape({
    status: PropTypes.PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    error: PropTypes.string,
    data: PropTypes.shape({
      error: PropTypes.string
    })
  })
};
