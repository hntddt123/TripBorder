import PropTypes from 'prop-types';

export const errorPropTypes = PropTypes.shape({
  status: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  error: PropTypes.string,
  data: PropTypes.oneOfType([
    PropTypes.shape({
      error: PropTypes.string
    }),
    PropTypes.shape({
      error: PropTypes.shape({
        code: PropTypes.number,
        message: PropTypes.string
      })
    }),
    PropTypes.string
  ])
});
