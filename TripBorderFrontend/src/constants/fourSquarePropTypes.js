import PropTypes from 'prop-types';

const LocationPropType = PropTypes.shape({
  address: PropTypes.string,
  census_block: PropTypes.string,
  country: PropTypes.string,
  cross_street: PropTypes.string,
  formatted_address: PropTypes.string,
  locality: PropTypes.string,
  postcode: PropTypes.string,
  region: PropTypes.string,
});

const GeocodePropType = PropTypes.shape({
  latitude: PropTypes.number,
  longitude: PropTypes.number,
});

const CategoryPropType = PropTypes.shape({
  id: PropTypes.number,
  name: PropTypes.string,
  icon: PropTypes.shape({
    prefix: PropTypes.string,
    suffix: PropTypes.string,
  }),
});

const ChainPropType = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
});

const ResultPropType = PropTypes.shape({
  fsq_id: PropTypes.string,
  categories: PropTypes.arrayOf(CategoryPropType),
  chains: PropTypes.arrayOf(ChainPropType),
  distance: PropTypes.number,
  geocodes: PropTypes.shape({
    main: GeocodePropType,
    roof: GeocodePropType,
  }),
  link: PropTypes.string,
  location: LocationPropType,
  name: PropTypes.string,
  timezone: PropTypes.string,
});

export const FourSquareResponsePropTypes = PropTypes.shape({
  context: PropTypes.shape({
    geo_bounds: PropTypes.shape({
      circle: PropTypes.shape({
        center: PropTypes.shape({
          latitude: PropTypes.number,
          longitude: PropTypes.number
        }),
        radius: PropTypes.number
      }),
    })
  }),
  results: PropTypes.arrayOf(ResultPropType)
});
