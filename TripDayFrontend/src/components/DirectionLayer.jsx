/* eslint-disable react/prop-types */
import { Source, Layer, Marker } from 'react-map-gl';
import { useSelector } from 'react-redux';

export default function DirectionLayer({ getDirectionsQueryResults }) {
  const selectedPOILonLat = useSelector((state) => state.mapReducer.selectedPOILonLat);

  const geojson = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: (getDirectionsQueryResults.isSuccess) ? getDirectionsQueryResults.data.routes[0].geometry.coordinates : ''
    }
  };

  const lineLayer = {
    id: 'route',
    type: 'line',
    source: {
      type: 'geojson',
      data: geojson
    },
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': 'orange',
      'line-width': 15,
      'line-opacity': 0.7
    }
  };

  return (
    <Source id='direction-data' type='geojson' data={geojson}>
      <Layer
        {...lineLayer}
      />
      {(getDirectionsQueryResults.isSuccess && !getDirectionsQueryResults.isUninitialized)
        ? (
          <Marker longitude={selectedPOILonLat.longitude} latitude={selectedPOILonLat.latitude} offset={[0, -50]}>
            <div className='text-2xl cardPOIMarker text-orange-500'>
              {`${(getDirectionsQueryResults.data.routes[0].legs[0].duration / 60).toFixed(0)} Min walk`}
            </div>
            <div className='text-4xl instructions'>
              {`${(getDirectionsQueryResults.data.routes[0].legs[0].steps.map((step) => step.maneuver.instruction))}`}
            </div>
          </Marker>
        ) : null}
    </Source>
  );
}
