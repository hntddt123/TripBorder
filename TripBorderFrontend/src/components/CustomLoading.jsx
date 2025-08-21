import PropTypes from 'prop-types';

export default function CustomLoading({ isLoading, text = 'Loading' }) {
  if (isLoading) {
    return (
      <span data-testid='customLoading' className='customLoading'>
        {text}
      </span>
    );
  }
  return null;
}

CustomLoading.propTypes = {
  isLoading: PropTypes.bool,
  text: PropTypes.string
};
