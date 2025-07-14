import { useSelector } from 'react-redux';
import { Marker, Source, Layer } from 'react-map-gl';

export default function ClickMarker() {
  const mapMarkers = useSelector((state) => state.mapReducer.markers);
  const selectedPOIRadius = useSelector((state) => state.mapReducer.selectedPOIRadius);

  const createGeoJSONCircle = (center, radiusInMeters, points = 64) => {
    const coords = {
      longitude: center[0],
      latitude: center[1],
    };

    const km = radiusInMeters / 1000;

    const ret = [];
    const distanceX = km / (111.320 * Math.cos((coords.latitude * Math.PI) / 180));
    const distanceY = km / 110.574;

    let theta;
    let x;
    let y;

    for (let i = 0; i < points; i++) {
      theta = (i / points) * (2 * Math.PI);
      x = distanceX * Math.cos(theta);
      y = distanceY * Math.sin(theta);

      ret.push([coords.longitude + x, coords.latitude + y]);
    }
    ret.push(ret[0]);

    return {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [ret],
      },
    };
  };

  const drawRadius = (lng, lat) => createGeoJSONCircle([lng, lat], selectedPOIRadius);

  return ((mapMarkers.length > 0) ? mapMarkers.map((marker) => (
    <div key={marker.id}>
      <Marker longitude={marker.lng} latitude={marker.lat}>
        <div translate='no' className='text-4xl'>📍</div>
      </Marker>
      <Marker longitude={marker.lng} latitude={marker.lat} offset={[0, 30]}>
        <div translate='no' className='text-2xl  text-red-600'>{marker.restaurantName}</div>
      </Marker>

      <Source id='circle-data' type='geojson' data={drawRadius(marker.lng, marker.lat)}>
        <Layer
          id='circle-layer'
          type='fill'
          paint={{
            'fill-color': '#777',
            'fill-opacity': 0.3,
          }}
        />
      </Source>
    </div>
  )) : null);
}
