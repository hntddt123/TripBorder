import { useDispatch, useSelector } from 'react-redux';
import ReactSlider from 'react-slider';
import {
  setSelectedPOICount,
  setSelectedPOIRadius
} from '../../redux/reducers/mapReducer';
import TogglePlaceName from './TogglePlaceName';
import ToggleDistance from './ToggleDistance';
import ToggleMapBoxSearch from './ToggleMapBoxSearch';

export default function TripSearchTools() {
  const {
    gpsLonLat,
    selectedPOICount,
    selectedPOIRadius,
  } = useSelector((state) => state.mapReducer);

  const dispatch = useDispatch();

  const handleItemCountChange = (count) => {
    dispatch(setSelectedPOICount(count));
  };

  const handleRadiusChange = (radius) => {
    dispatch(setSelectedPOIRadius(radius));
  };

  const hasGPSLonLat = () => (
    gpsLonLat.longitude !== null
    && gpsLonLat.latitude !== null
  );

  const getLocation = () => ((hasGPSLonLat()) ? (
    <div className='cardInfo text-left'>
      <div className='text-lg'>
        {`Longtitude: ${(gpsLonLat.longitude.toFixed(8))}`}
      </div>
      <div className='text-lg'>
        {`Latitude: ${gpsLonLat.latitude.toFixed(8)}`}
      </div>
    </div>
  ) : (
    <div className='cardInfo text-center text-sm'>
      Press location button to get current GPS location for searching
    </div>
  )
  );

  return (
    <div className='text-lg tripAbsoluteContentRight'>
      <div className='flex justify-around'>
        <span className='min-w-2/3 text-left'>Show name on markers</span>
        <TogglePlaceName />
      </div>
      <div className='flex justify-around'>
        <span className='min-w-2/3 text-left'>Show distance on markers</span>
        <ToggleDistance />
      </div>
      <div className='flex justify-around'>
        <span className='min-w-2/3 text-left'>Use Mapbox place search</span>
        <ToggleMapBoxSearch />
      </div>
      Item Count
      <ReactSlider
        className='slider notranslate'
        markClassName='sliderMark'
        thumbClassName='sliderThumbCount'
        trackClassName='sliderTrackCount'
        defaultValue={selectedPOICount}
        marks={[10, 15, 20, 25, 30, 35, 40, 45, 50]}
        step={5}
        min={10}
        max={50}
        // eslint-disable-next-line react/prop-types
        renderThumb={(props, state) => <div {...props} key={props.key}>{state.valueNow}</div>}
        // eslint-disable-next-line react/prop-types
        renderTrack={(props, state) => <div {...props} key={props.key}>{state.valueNow}</div>}
        onChange={(value) => handleItemCountChange(value)}
      />
      Radius (meter)
      <ReactSlider
        className='slider notranslate'
        markClassName='sliderMark'
        thumbClassName='sliderThumbRadius'
        trackClassName='sliderTrackRadius'
        defaultValue={selectedPOIRadius}
        marks={[100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]}
        step={100}
        min={100}
        max={1000}
        // eslint-disable-next-line react/prop-types
        renderThumb={(props, state) => <div {...props} key={props.key}>{state.valueNow}</div>}
        onChange={(value) => handleRadiusChange(value)}
      />
      {getLocation()}
    </div>
  );
}
