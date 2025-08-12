import PropTypes from 'prop-types';

export default function CustomFetching({ isFetching, text = 'Fetching' }) {
  if (isFetching) {
    return (
      <span className='customFetching'>
        {text}
      </span>
    );
  }
  return null;
}

CustomFetching.propTypes = {
  isFetching: PropTypes.bool,
  text: PropTypes.string
};
