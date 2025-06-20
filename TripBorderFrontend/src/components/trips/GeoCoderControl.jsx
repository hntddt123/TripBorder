import { useState, } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useControl, Marker } from 'react-map-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import {
  setViewState,
  setLongPressedLonLat,
} from '../../redux/reducers/mapReducer';

const noop = () => { };

export default function GeocoderControl({ mapboxAccessToken, position,
  onLoading = noop, onResult = noop, onResults = noop, onError = noop, marker = true }) {
  const [geocoderMarker, setGeocoderMarker] = useState(true);

  const viewState = useSelector((state) => state.mapReducer.viewState);
  const dispatch = useDispatch();

  const getMarker = (longitude, latitude) => (
    <div>
      <Marker longitude={longitude} latitude={latitude}>
        <div className='text-4xl'>📍</div>
      </Marker>
    </div>
  );

  useControl(
    () => {
      const ctrl = new MapboxGeocoder({
        marker: false,
        accessToken: mapboxAccessToken
      });
      ctrl.on('loading', onLoading);
      ctrl.on('results', onResults);
      ctrl.on('result', (event) => {
        onResult(event);

        const { result } = event;
        const location = result
          && (result.center || (result.geometry?.type === 'Point' && result.geometry.coordinates));
        if (location && marker) {
          setGeocoderMarker(getMarker(location[0], location[1]));
          dispatch(setLongPressedLonLat({ longitude: location[0], latitude: location[1] }));
          dispatch(setViewState({ longitude: location[0], latitude: location[1], pitch: viewState.pitch, zoom: 16 }));
        } else {
          setGeocoderMarker(null);
        }
      });
      ctrl.on('error', onError);
      return ctrl;
    },
    {
      position: position
    }
  );

  return geocoderMarker;
}
