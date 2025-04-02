import PropTypes from 'prop-types';

export const ImageComponentByteaPropTypes = PropTypes.shape({
  type: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.array
});

export const ImageComponentUUIDPropTypes = PropTypes.string;
