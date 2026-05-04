export const getOSMAddress = (result) => result.display_name;
export const getAltName = (marker) => (marker.namedetails.alt_name ? `(${marker.namedetails.alt_name})` : '');
