import PropTypes from 'prop-types';

export const errorPropTypes = PropTypes.shape({
  status: PropTypes.PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  error: PropTypes.string,
  data: PropTypes.shape({
    error: PropTypes.string
  })
});
