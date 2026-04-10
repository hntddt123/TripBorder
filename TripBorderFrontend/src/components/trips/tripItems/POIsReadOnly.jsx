import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  useGetPOIsByTripIDQuery
} from '../../../api/poisAPI';
import {
  formatDatecccMMMdyyyy,
  formatDateHHmm
} from '../../../utility/time';
import { setMarker } from '../../../redux/reducers/mapReducer';
import { parkIcon } from '../../../constants/constants';
import CustomToggle from '../../CustomToggle';
import CustomError from '../../CustomError';
import CustomButton from '../../CustomButton';
import CustomLoading from '../../CustomLoading';
import CustomFetching from '../../CustomFetching';

export default function POIsReadOnly({ tripID, handleFlyTo }) {
  const { data, isLoading, isFetching, error } = useGetPOIsByTripIDQuery({ tripID });
  const { points_of_interest: pois } = data || {};

  const dispatch = useDispatch();

  // Group pois by formatted date
  const dateGroupedPOIs = (() => {
    const result = {};
    pois?.forEach((poi) => {
      const date = formatDatecccMMMdyyyy(poi.visit_time);
      result[date] = (result[date] || []).concat([poi]);
    });
    return result;
  })();

  const flyToLocation = (poi) => () => {
    if (poi.location && handleFlyTo) {
      const newMarker = [{
        id: new Date().getTime(),
        icon: parkIcon,
        text: poi.name,
        lng: poi.location.x,
        lat: poi.location.y
      }];
      dispatch(setMarker(newMarker));
      handleFlyTo(poi.location.x, poi.location.y, 17);
    }
  };

  const renderDetail = (poi) => (
    <div className='text-pretty'>
      <div className='underline underline-offset-2'>Visit Time</div>
      <div className='px-2 font-mono'>{formatDateHHmm(poi.visit_time)}</div>
      <div className='underline underline-offset-2'>Address</div>
      <div className='px-2 font-mono'>{poi.address}</div>
    </div>
  );

  return (
    <div>
      <div className='text-lg text-center'>
        {(pois?.length > 0) ? <span>Tour Spots</span> : null}
      </div>
      {(dateGroupedPOIs)
        ? Object.entries(dateGroupedPOIs).map(([date, poisForDate]) => (
          <div key={date}>
            <div>
              {date}
            </div>
            {poisForDate?.map((poi) => (
              <div key={poi.uuid}>
                <div className='text-pretty px-2'>
                  <CustomButton
                    className='buttonLocate'
                    label={parkIcon}
                    onClick={flyToLocation(poi)}
                  />
                  <CustomToggle
                    translate='no'
                    className='toggle toggleTrip'
                    aria-label={`Poi Button ${poi.uuid}`}
                    id={poi.uuid}
                    titleOn={`${poi.name} ▼`}
                    titleOff={`${poi.name}`}
                    component={renderDetail(poi)}
                  />
                </div>
              </div>
            ))}
          </div>
        ))
        : null}
      <div>
        <CustomLoading isLoading={isLoading} text='Loading POIs' />
      </div>
      <div>
        <CustomFetching isFetching={isFetching} text='Fetching new page' />
      </div>
      <div>
        <CustomError error={error} />
      </div>
    </div>
  );
}

POIsReadOnly.propTypes = {
  tripID: PropTypes.string,
  handleFlyTo: PropTypes.func
};
