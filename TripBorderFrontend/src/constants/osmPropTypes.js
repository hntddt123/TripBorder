import PropTypes from 'prop-types';

/**
 address example
 ISO3166-2-lvl4: 'TW-TPE'
 amenity: "Chili's美式餐廳",
 city: 'Taipei',
 country: 'Taiwan',
 country_code: 'tw',
 house_number: '22',
 neighbourhood: 'Xicun Village',
 postcode: '110061',
 road: 'Songshou Road',
 suburb: 'Xinyi District',
 village: 'Xinyi Commercial Zone'
*/
const addressPropType = PropTypes.shape({
  'ISO3166-2-lvl4': PropTypes.string,
  amenity: PropTypes.string,
  city: PropTypes.string,
  country: PropTypes.string,
  country_code: PropTypes.string,
  house_number: PropTypes.string,
  neighbourhood: PropTypes.string,
  postcode: PropTypes.string,
  road: PropTypes.string,
  suburb: PropTypes.string,
  village: PropTypes.string
});

const extratagPropType = PropTypes.shape({
  extra: PropTypes.string
});

const nameDetailsPropType = PropTypes.shape({
  name: PropTypes.string
});

/**
  full osm example
  address: {amenity: "Chili's美式餐廳", house_number: '22', road: 'Songshou Road', neighbourhood: 'Xicun Village', suburb: 'Xinyi District', …}
  addresstype: "amenity"
  boundingbox: ['25.0354703', '25.0355703', '121.5679076', '121.5680076']
  class: "amenity"
  display_name: "Chili's美式餐廳, 22, Songshou Road, Xicun Village, Xinyi District, Xinyi Commercial Zone, Taipei, 110061, Taiwan"
  extratags: {phone: '+886 2 2345 8838', branch: '台北信義店'}
  importance: 0.00000999999999995449
  lat: "25.0355203"
  licence: "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright"
  lon: "121.5679576"
  name: "Chili's美式餐廳"
  namedetails: {name: "Chili's美式餐廳"}
  osm_id: 7759766257
  osm_type: "node"
  place_id: 4389322
  place_rank: 30
  type: "restaurant"
*/
export const OSMPropTypes = (
  PropTypes.shape({
    address: addressPropType,
    addressType: PropTypes.string,
    boundingbox: PropTypes.arrayOf(PropTypes.string),
    class: PropTypes.string,
    display_name: PropTypes.string,
    extratag: extratagPropType,
    importance: PropTypes.number,
    lat: PropTypes.string,
    lon: PropTypes.string,
    licence: PropTypes.string,
    name: PropTypes.string,
    namedetails: nameDetailsPropType,
    osm_id: PropTypes.number,
    osm_type: PropTypes.string,
    place_id: PropTypes.number,
    place_rank: PropTypes.number,
    type: PropTypes.string,
  })
);
