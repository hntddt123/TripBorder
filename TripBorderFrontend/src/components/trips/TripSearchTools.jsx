import { useDispatch, useSelector } from 'react-redux';
import ReactSlider from 'react-slider';
import TripCurrent from './TripCurrent';
import {
  setSelectedPOICount,
  setSelectedPOIRadius
} from '../../redux/reducers/mapReducer';

function TripSearchTools() {
  const gpsLonLat = useSelector((state) => state.mapReducer.gpsLonLat);
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
    <div className='cardInfo'>
      <div className='text-xl'>
        {`Longtitude: ${(gpsLonLat.longitude.toFixed(8))}`}
      </div>
      <div className='text-xl'>
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
    <div className='text-xl m-2'>
      Item Count
      <ReactSlider
        className='slider'
        markClassName='sliderMark'
        thumbClassName='sliderThumbCount'
        trackClassName='sliderTrackCount'
        defaultValue={20}
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
        className='slider'
        markClassName='sliderMark'
        thumbClassName='sliderThumbRadius'
        trackClassName='sliderTrackRadius'
        defaultValue={500}
        marks={[100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]}
        step={100}
        min={100}
        max={1000}
        // eslint-disable-next-line react/prop-types
        renderThumb={(props, state) => <div {...props} key={props.key}>{state.valueNow}</div>}
        onChange={(value) => handleRadiusChange(value)}
      />
      {getLocation()}
      <TripCurrent />
    </div>
  );
}

export default TripSearchTools;
