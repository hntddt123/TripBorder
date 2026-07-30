import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  useGetPOIsByTripIDQuery,
  useUpdatePOIByUUIDMutation,
  useDeletePOIMutation
} from '../../../api/poisAPI';
import {
  formatDatecccMMMdyyyy,
  formatDateHHmm,
  formatLocalDateTimeString,
  isTimeValid,
  setLocalTime,
} from '../../../utility/time';
import { setTripMarker } from '../../../redux/reducers/mapReducer';
import { parkIcon } from '../../../constants/constants';
import CustomToggle from '../../CustomToggle';
import CustomError from '../../CustomError';
import CustomButton from '../../CustomButton';
import CustomLoading from '../../CustomLoading';
import CustomFetching from '../../CustomFetching';

export default function POIs({ tripID, handleFlyTo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [visitTimes, setVisitTimes] = useState({});
  const [inputErrors, setInputErrors] = useState({});

  const trip = useSelector((state) => state.tripReducer);
  const { isLoadTrip } = useSelector((state) => state.tripReducer);

  const { data, isLoading, isFetching, error } = useGetPOIsByTripIDQuery({ tripID });
  const { points_of_interest: pois } = data || {};

  const [updatePOI] = useUpdatePOIByUUIDMutation();
  const [deletePOI] = useDeletePOIMutation();

  const dispatch = useDispatch();
  const datePickerRefs = useRef({});

  const openPicker = (id) => (e) => {
    const input = datePickerRefs.current[id];
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    if (isIOS) {
      const btn = e.currentTarget.getBoundingClientRect();

      // Temporarily place a real-sized invisible input exactly on the button
      Object.assign(input.style, {
        position: 'fixed',
        left: `${btn.left}px`,
        top: `${btn.top}px`,
        width: `${btn.width}px`,
        height: `${btn.height}px`,
        opacity: '0.01',
        zIndex: '99999',
        pointerEvents: 'auto',
      });

      input.focus({ preventScroll: true });

      // Restore after the picker has a chance to open
      setTimeout(() => {
        Object.assign(input.style, {
          position: '',
          left: '',
          top: '',
          width: '',
          height: '',
          opacity: '',
          zIndex: '',
          pointerEvents: '',
        });
      }, 400);
    }
    if (input.showPicker) {
      input.showPicker();
    } else {
      input.click();
    }
  };

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
      dispatch(setTripMarker(newMarker));
      handleFlyTo(poi.location.x, poi.location.y, 17);
    }
  };

  const getVisitTimeValue = (poi) => {
    if (visitTimes[poi.uuid] === undefined) {
      setVisitTimes((prevTimes) => ({
        ...prevTimes,
        [poi.uuid]: formatLocalDateTimeString(poi.visit_time),
      }));
    }
    return visitTimes[poi.uuid];
  };

  const validateVisitTime = (value) => isTimeValid(value, undefined, trip, 'Tour');

  const handleInputChange = (poiID) => (e) => {
    const { value } = e.target;

    const visitTimeError = validateVisitTime(value);

    setInputErrors((prevErrors) => ({
      ...prevErrors,
      [poiID]: visitTimeError,
    }));

    if (!visitTimeError) {
      setVisitTimes((prevTimes) => ({
        ...prevTimes,
        [poiID]: value,
      }));
      if (value !== '') {
        updatePOI({
          uuid: poiID,
          updates: {
            visit_time: setLocalTime(value)
          }
        });
      }
    }
  };

  const handleEditButton = () => {
    if (isEditing) {
      setVisitTimes({});
      setInputErrors({});
    }
    setIsEditing(!isEditing);
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
      <div className={`flex items-center justify-center text-lg ${isLoadTrip ? '' : 'ml-10'}`}>
        {(pois?.length > 0) && !isEditing ? <div>Tour Spots</div> : null}
        {(isEditing) ? <div>Edit Tour Spots</div> : null}
        {pois?.length > 0 && !isLoadTrip
          ? (
            <CustomButton
              translate='no'
              className='buttonEdit select-none'
              label='✏️'
              onClick={handleEditButton}
            />
          ) : null}
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
                  {(isEditing)
                    ? (
                      <CustomButton
                        className='buttonDelete'
                        translate='no'
                        label='🗑️'
                        onClick={() => deletePOI(poi.uuid)}
                      />
                    )
                    : (
                      <>
                        <label
                          htmlFor={poi.uuid}
                          className='buttonLocate text-sm'
                        />
                        <CustomButton
                          className='buttonLocate text-sm'
                          label={formatDateHHmm(poi.visit_time)}
                          onClick={openPicker(poi.uuid)}
                        />
                        <CustomButton
                          className='buttonLocate'
                          label={parkIcon}
                          onClick={flyToLocation(poi)}
                        />
                        <input
                          ref={(el) => {
                            if (el) {
                              datePickerRefs.current[poi.uuid] = el;
                            } else {
                              // clean-up ref when item removed
                              delete datePickerRefs.current[poi.uuid];
                            }
                          }}
                          className='sr-only relative'
                          id={poi.uuid}
                          type='datetime-local'
                          name='visit_time'
                          value={getVisitTimeValue(poi)}
                          onChange={handleInputChange(poi.uuid)}
                          required
                        />
                      </>
                    )}
                  <CustomToggle
                    translate='no'
                    className='toggle toggleTrip'
                    aria-label={`Poi Button ${poi.uuid}`}
                    id={poi.uuid}
                    titleOn={`${poi.name} ▼`}
                    titleOff={`${poi.name}`}
                    component={renderDetail(poi)}
                  />
                  <div className='text-red-600'>{inputErrors[poi.uuid] || ''}</div>
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

POIs.propTypes = {
  tripID: PropTypes.string,
  handleFlyTo: PropTypes.func
};
